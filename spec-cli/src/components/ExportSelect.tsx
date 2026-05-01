import React from 'react';
import { Box, Text } from 'ink';
import { Select } from '@inkjs/ui';

type Props = {
  onSelect: (format: string) => void;
};

export function ExportSelect({ onSelect }: Props) {
  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>Export report as:</Text>
      <Select
        options={[
          { label: 'SARIF  (VS Code Problems panel, GitHub Code Scanning)', value: 'sarif' },
          { label: 'JSON   (annotate resolution field, return to re-run)',   value: 'json' },
          { label: 'Markdown',                                               value: 'md' },
          { label: 'All three',                                              value: 'all' },
        ]}
        onChange={onSelect}
      />
    </Box>
  );
}
