import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { Spinner } from '@inkjs/ui';
import { readExtractResult, ExtractResult } from '../lib/readExtractResult.js';
import { PhaseLog }            from '../components/PhaseLog.js';
import { NodeBreakdownChart }  from '../components/NodeBreakdownChart.js';
import { PendingLinksTable }   from '../components/PendingLinksTable.js';
import { Check }               from './check.js';

type Props = {
  path:      string;
  repoName?: string;
  layer?:    string;
  runCheck:  boolean;
};

export function Extract({ path, repoName, layer, runCheck }: Props) {
  const [result,    setResult]    = useState<ExtractResult | null>(null);
  const [error,     setError]     = useState<string | null>(null);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    readExtractResult(path)
      .then(r => {
        setResult(r);
        if (runCheck) setTimeout(() => setShowCheck(true), 600);
      })
      .catch(e => setError(e.message));
  }, []);

  if (error) return <Text color="red">Error: {error}</Text>;

  if (!result) return (
    <Box gap={1}>
      <Spinner label="Reading extract-result.json..." />
    </Box>
  );

  const { repo, framework, counts, pendingLinks, warnings } = result;

  return (
    <Box flexDirection="column" gap={2}>

      {/* Header */}
      <Box gap={1}>
        <Text bold color="blue">Extraction complete</Text>
        <Text dimColor>— {repo.name} ({framework})</Text>
      </Box>

      {/* Node breakdown */}
      <NodeBreakdownChart counts={counts} />

      {/* Edge summary */}
      <Box gap={3}>
        <Text>Edges: <Text bold>{counts.edges.total}</Text></Text>
        <Text>Workflows: <Text bold>{counts.workflows}</Text></Text>
        <Text>Files written: <Text bold>{counts.filesWritten}</Text></Text>
      </Box>

      {/* Warnings */}
      {warnings.length > 0 && (
        <Box flexDirection="column" gap={0}>
          <Text color="yellow" bold>Warnings ({warnings.length})</Text>
          {warnings.map((w, i) => (
            <Text key={i} color="yellow">  ⚠ {w.code}: {w.message}</Text>
          ))}
        </Box>
      )}

      {/* Pending cross-repo links */}
      <PendingLinksTable links={pendingLinks} />

      {/* Chain into Check */}
      {showCheck && (
        <Box flexDirection="column" gap={1}>
          <Text dimColor>─────────────────────────────────</Text>
          <Text dimColor>Running spec-checker...</Text>
          <Check path={path} minSeverity="low" format="sarif" />
        </Box>
      )}
    </Box>
  );
}
