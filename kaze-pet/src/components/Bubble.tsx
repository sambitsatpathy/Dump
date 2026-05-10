import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import type { PetState } from '../sprites/index.js';

const MESSAGES: Record<PetState, string[]> = {
  idle: [
    'watching...',
    '( ˘ω˘ )',
    'ready.',
    '...',
    'here if you need me.',
  ],
  working: [
    'on it.',
    'I see you.',
    '( •̀ ω •́ )✧',
    'those edits look good.',
    'keep going...',
    'busy busy.',
  ],
  sleeping: [
    'z z z',
    '(˘ з˘)♡',
    'z... z...',
    '*soft snoring*',
    '💤',
  ],
  celebrating: [
    '✨ LETS GO ✨',
    '( *˘▿˘* )/',
    'YESSS!!',
    'committed!! 🎉',
    '✦ ✦ ✦',
  ],
  error: [
    'oh no...',
    '(╥_╥)',
    'we can fix this.',
    '...debugging mode.',
    'stay calm.',
  ],
  commit: [
    '⟡ committed!',
    'history preserved.',
    '( ˙꒳˙ )',
    'nice work.',
  ],
};

const ZZZ_FLOATS = ['z', 'z z', 'z z z'];

interface BubbleProps {
  state: PetState;
  petName: string;
}

export default function Bubble({ state, petName }: BubbleProps) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [zIdx, setZIdx] = useState(0);

  // Rotate message every 4s
  useEffect(() => {
    setMsgIdx(0);
    const pool = MESSAGES[state];
    const t = setInterval(() => {
      setMsgIdx(i => (i + 1) % pool.length);
    }, 4_000);
    return () => clearInterval(t);
  }, [state]);

  // ZZZ float animation for sleep
  useEffect(() => {
    if (state !== 'sleeping') return;
    const t = setInterval(() => {
      setZIdx(i => (i + 1) % ZZZ_FLOATS.length);
    }, 600);
    return () => clearInterval(t);
  }, [state]);

  const msg = state === 'sleeping'
    ? ZZZ_FLOATS[zIdx]!
    : MESSAGES[state][msgIdx]!;

  const color =
    state === 'celebrating' ? 'yellow' :
    state === 'error'       ? 'red' :
    state === 'commit'      ? 'green' :
    state === 'working'     ? 'cyan' :
    state === 'sleeping'    ? 'gray' :
    'white';

  const border =
    state === 'celebrating' ? 'yellow' :
    state === 'error'       ? 'red' :
    state === 'commit'      ? 'green' :
    'gray';

  return (
    <Box flexDirection="column" marginLeft={2}>
      {/* Pet name */}
      <Text bold color="magenta">{petName}</Text>

      {/* Speech bubble */}
      <Box
        borderStyle="round"
        borderColor={border}
        paddingX={1}
        marginTop={0}
      >
        <Text color={color}>{msg}</Text>
      </Box>

      {/* State label */}
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          [{state}]{'  '}{stateIcon(state)}
        </Text>
      </Box>
    </Box>
  );
}

function stateIcon(state: PetState): string {
  switch (state) {
    case 'idle':        return '○';
    case 'working':     return '◉';
    case 'sleeping':    return '◌';
    case 'celebrating': return '★';
    case 'error':       return '✕';
    case 'commit':      return '✓';
  }
}
