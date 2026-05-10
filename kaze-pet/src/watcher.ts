import chokidar from 'chokidar';
import { EventEmitter } from 'events';
import path from 'path';
import fs from 'fs';

export type PetState = 'idle' | 'working' | 'sleeping' | 'celebrating' | 'error' | 'commit';

export interface StateChangeEvent {
  state: PetState;
  trigger: string;
}

const IDLE_TIMEOUT_MS  = 25_000;   // 25s no activity → idle
const SLEEP_TIMEOUT_MS = 4 * 60_000; // 4min idle → sleep

export class WorkspaceWatcher extends EventEmitter {
  private state: PetState = 'idle';
  private idleTimer:  ReturnType<typeof setTimeout> | null = null;
  private sleepTimer: ReturnType<typeof setTimeout> | null = null;
  private transientTimer: ReturnType<typeof setTimeout> | null = null;
  private watchers: chokidar.FSWatcher[] = [];

  constructor(private readonly workspacePath: string) {
    super();
  }

  start(): void {
    const resolved = path.resolve(this.workspacePath);

    if (!fs.existsSync(resolved)) {
      this.setState('error', `path not found: ${resolved}`);
      return;
    }

    // ── Source file watcher ───────────────────────────────
    const srcWatcher = chokidar.watch(resolved, {
      ignored: [
        /(^|[/\\])\../,          // dot files
        /node_modules/,
        /\.git/,
        /dist[/\\]/,
        /build[/\\]/,
        /\.next[/\\]/,
        /coverage[/\\]/,
        /\.turbo[/\\]/,
      ],
      ignoreInitial: true,
      depth: 10,
      usePolling: true,
      interval: 100,
      awaitWriteFinish: false,
    });
    this.watchers.push(srcWatcher);

    srcWatcher.on('change', (filePath) => {
      this.onFileActivity(`changed: ${path.relative(resolved, filePath)}`);
    });
    srcWatcher.on('add', (filePath) => {
      this.onFileActivity(`added: ${path.relative(resolved, filePath)}`);
    });
    srcWatcher.on('unlink', (filePath) => {
      this.onFileActivity(`deleted: ${path.relative(resolved, filePath)}`);
    });

    // ── Git commit watcher ────────────────────────────────
    const gitIndexPath = path.join(resolved, '.git', 'index');
    if (fs.existsSync(path.join(resolved, '.git'))) {
      const gitWatcher = chokidar.watch(gitIndexPath, {
        ignoreInitial: true,
        usePolling: true,
        interval: 100,
      });
      this.watchers.push(gitWatcher);
      gitWatcher.on('change', () => this.onCommit());
    }

    // ── Build output watcher (detects successful builds) ──
    const buildPaths = [
      path.join(resolved, 'dist'),
      path.join(resolved, 'build'),
      path.join(resolved, '.next'),
      path.join(resolved, 'out'),
    ];

    const buildWatcher = chokidar.watch(buildPaths, {
      ignoreInitial: true,
      depth: 1,
      usePolling: true,
      interval: 100,
    });
    this.watchers.push(buildWatcher);
    buildWatcher.on('addDir', () => this.onBuild());
    buildWatcher.on('add', () => this.onBuild());

    this.startSleepChain();
  }

  private onFileActivity(trigger: string): void {
    if (this.state === 'celebrating' || this.state === 'commit') return;
    if (this.state !== 'working') {
      this.setState('working', trigger);
    }
    this.resetActivityTimers();
  }

  private onCommit(): void {
    this.cancelTransient();
    this.setState('commit', 'git commit');
    this.transientTimer = setTimeout(() => {
      this.setState('celebrating', 'post-commit glow');
      this.transientTimer = setTimeout(() => {
        this.setState('idle', 'settled');
        this.startSleepChain();
      }, 4_000);
    }, 2_000);
  }

  private onBuild(): void {
    this.cancelTransient();
    this.setState('celebrating', 'build output appeared');
    this.transientTimer = setTimeout(() => {
      this.setState('idle', 'build done');
      this.startSleepChain();
    }, 5_000);
  }

  private resetActivityTimers(): void {
    if (this.idleTimer)  clearTimeout(this.idleTimer);
    if (this.sleepTimer) clearTimeout(this.sleepTimer);

    this.idleTimer = setTimeout(() => {
      if (this.state === 'working') {
        this.setState('idle', 'no activity');
      }
      this.startSleepChain();
    }, IDLE_TIMEOUT_MS);
  }

  private startSleepChain(): void {
    if (this.sleepTimer) clearTimeout(this.sleepTimer);
    this.sleepTimer = setTimeout(() => {
      if (this.state === 'idle') {
        this.setState('sleeping', 'long inactivity');
      }
    }, SLEEP_TIMEOUT_MS);
  }

  private cancelTransient(): void {
    if (this.transientTimer) {
      clearTimeout(this.transientTimer);
      this.transientTimer = null;
    }
  }

  private setState(next: PetState, trigger: string): void {
    if (this.state === next) return;
    this.state = next;
    const event: StateChangeEvent = { state: next, trigger };
    this.emit('state', event);
  }

  getState(): PetState {
    return this.state;
  }

  // Allow external callers (e.g. process signals) to force a state
  forceState(next: PetState): void {
    this.cancelTransient();
    this.setState(next, 'external');
  }

  stop(): void {
    this.cancelTransient();
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.sleepTimer) clearTimeout(this.sleepTimer);
    this.watchers.forEach(w => w.close());
    this.watchers = [];
    this.removeAllListeners();
  }
}
