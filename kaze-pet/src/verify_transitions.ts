import fs from 'fs';
import path from 'path';
import { WorkspaceWatcher } from './watcher.js';

const TEST_DIR = path.resolve('test-workspace');

// Setup test workspace
if (fs.existsSync(TEST_DIR)) {
  fs.rmSync(TEST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(TEST_DIR);
fs.mkdirSync(path.join(TEST_DIR, '.git'));
fs.writeFileSync(path.join(TEST_DIR, '.git', 'index'), '');

console.log('--- Kaze Pet State Transition Verification ---');

const watcher = new WorkspaceWatcher(TEST_DIR);
let currentState: any = watcher.getState();

watcher.on('state', (event) => {
  console.log(`[STATE CHANGE] ${currentState} -> ${event.state} (Trigger: ${event.trigger})`);
  currentState = event.state;
});

watcher.start();

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  try {
    // 1. Test Working State
    console.log('\n1. Testing file activity -> working');
    for (let i = 0; i < 5; i++) {
        fs.writeFileSync(path.join(TEST_DIR, `hello-${i}.txt`), 'world');
        await wait(200);
        if (currentState === 'working') break;
    }
    if (currentState !== 'working') throw new Error('Failed to transition to working');

    // 2. Test Git Commit
    console.log('\n2. Testing git commit -> commit -> celebrating -> idle');
    fs.writeFileSync(path.join(TEST_DIR, '.git', 'index'), 'new index');
    await wait(500);
    if (currentState !== 'commit') throw new Error('Failed to transition to commit');

    await wait(2500);
    if (currentState !== 'celebrating') throw new Error('Failed to transition to celebrating after commit');

    await wait(4500);
    if (currentState !== 'idle') throw new Error('Failed to transition back to idle after celebration');

    // 3. Test Build Detection (Existing Dir)
    console.log('\n3. Testing build detection in existing dir -> celebrating');
    const distDir = path.join(TEST_DIR, 'dist');
    if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

    await wait(200);
    fs.writeFileSync(path.join(distDir, 'bundle.js'), 'code');
    await wait(500);
    if (currentState !== 'celebrating') throw new Error('Failed to detect build in existing dist dir');

    await wait(5500);
    if (currentState !== 'idle') throw new Error('Failed to transition back to idle after build celebration');

    console.log('\n✅ All automated state transitions verified!');
  } catch (err) {
    console.error('\n❌ Verification failed:', err);
    process.exit(1);
  } finally {
    watcher.stop();
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
}

runTests();
