import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { ANIMATIONS } from './animations';
import { MonkeyProps } from './types';

export { AnimationName } from './types';

export function Monkey({
  animation = 'idle',
  fps = 8,
  color = 'yellow',
  loop = true,
  onDone,
}: MonkeyProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    setFrame(0);
    const frames = ANIMATIONS[animation];
    const intervalMs = 1000 / fps;

    const id = setInterval(() => {
      setFrame(f => {
        const next = f + 1;
        if (next >= frames.length) {
          if (!loop) {
            clearInterval(id);
            onDone?.();
            return f;
          }
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(id);
  }, [animation, fps, loop, onDone]);

  const lines = ANIMATIONS[animation][frame];

  return (
    <Box flexDirection="column">
      {lines.map((line, i) => (
        <Text key={i} color={color}>{line}</Text>
      ))}
    </Box>
  );
}
