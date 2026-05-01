import React from 'react';
import { Static, Box, Text } from 'ink';
import { StatusMessage } from '@inkjs/ui';

type Phase = {
  label:  string;
  status: 'done' | 'running' | 'warn';
  detail?: string;
};

export function PhaseLog({ phases }: { phases: Phase[] }) {
  return (
    <Static items={phases.filter(p => p.status !== "running")}>
      {(phase, i) => (
        <Box key={i} gap={1}>
          <StatusMessage variant={phase.status === "done" ? "success" : "warning"}>
            <Text>{phase.label}</Text>
            {phase.detail && <Text dimColor> — {phase.detail}</Text>}
          </StatusMessage>
        </Box>
      )}
    </Static>
  );
}
