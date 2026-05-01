import React from 'react';
import Table from 'ink-table';
import { Box, Text } from 'ink';
import type { ExtractResult } from '../lib/readExtractResult.js';

export function PendingLinksTable({
  links
}: {
  links: ExtractResult["pendingLinks"]
}) {
  if (links.length === 0) return null;

  const data = links.map(l => ({
    "From node":   l.fromLabel,
    "Label":       l.label,
    "Target hint": l.targetHint,
    "Route":       l.routePattern,
    "Method":      l.method,
  }));

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="yellow">
        Pending cross-repo edges ({links.length})
      </Text>
      <Table data={data} />
      <Text dimColor>
        Run `spec merge` with the other repo's specs to resolve these.
      </Text>
    </Box>
  );
}
