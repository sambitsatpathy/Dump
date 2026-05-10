import React, { useState, useEffect, useRef } from 'react';
import { Box, Text } from 'ink';
import { renderFrame } from '../sprites/renderer.js';
import { ANIMATIONS, type PetState } from '../sprites/index.js';

interface PetProps {
  state: PetState;
}

export default function Pet({ state }: PetProps) {
  const anim = ANIMATIONS[state];
  const [frameIdx, setFrameIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset to frame 0 on state change, then start new interval
  useEffect(() => {
    setFrameIdx(0);
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setFrameIdx(i => (i + 1) % anim.frames.length);
    }, anim.intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state, anim.intervalMs, anim.frames.length]);

  const lines = renderFrame(anim.frames[frameIdx]!);

  return (
    <Box flexDirection="column">
      {lines.map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
    </Box>
  );
}
