import React, { useState, useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import Pet from './components/Pet.js';
import Bubble from './components/Bubble.js';
import { WorkspaceWatcher, type PetState } from './watcher.js';
import type { StateChangeEvent } from './watcher.js';
import path from 'path';

interface AppProps {
  workspacePath: string;
  petName: string;
}

export default function App({ workspacePath, petName }: AppProps) {
  const { exit } = useApp();
  const [state, setState] = useState<PetState>('idle');
  const [lastTrigger, setLastTrigger] = useState<string>('started');

  useEffect(() => {
    const watcher = new WorkspaceWatcher(workspacePath);

    watcher.on('state', (event: StateChangeEvent) => {
      setState(event.state);
      setLastTrigger(event.trigger);
    });

    watcher.start();

    // Clean exit on ctrl-c
    process.on('SIGINT', () => {
      exit();
      process.exit(0);
    });

    return () => {
      watcher.removeAllListeners();
    };
  }, [workspacePath, exit]);

  const resolvedPath = path.resolve(workspacePath);
  const displayPath = resolvedPath.length > 40
    ? '…' + resolvedPath.slice(-38)
    : resolvedPath;

  return (
    <Box flexDirection="column" padding={1}>

      {/* Header */}
      <Box marginBottom={1}>
        <Text color="gray" dimColor>
          {'  '}watching{' '}
        </Text>
        <Text color="blueBright">{displayPath}</Text>
      </Box>

      {/* Main: pet + bubble side by side */}
      <Box flexDirection="row" alignItems="flex-start">
        <Pet state={state} />
        <Bubble state={state} petName={petName} />
      </Box>

      {/* Footer */}
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          {'  '}last: {lastTrigger}{'   '}ctrl-c to quit
        </Text>
      </Box>

    </Box>
  );
}
