import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { Spinner } from '@inkjs/ui';
import { readSarif, Gap } from '../lib/readSarif.js';
import { SeverityChart } from '../components/SeverityChart.js';
import { GapTable }      from '../components/GapTable.js';
import { ExportSelect }  from '../components/ExportSelect.js';
import { writeSarif }    from '../lib/sarifWriter.js';
import { writeMarkdown } from '../lib/markdownWriter.js';

type Props = {
  path:        string;
  minSeverity: 'high' | 'medium' | 'low' | 'info';
  format:      string;
};

const LEVEL_ORDER = ["error", "warning", "note", "none"];

export function Check({ path, minSeverity, format }: Props) {
  const [gaps,      setGaps]      = useState<Gap[] | null>(null);
  const [error,     setError]     = useState<string | null>(null);
  const [exported,  setExported]  = useState<string | null>(null);

  useEffect(() => {
    readSarif(path).then(setGaps).catch(e => setError(e.message));
  }, []);

  const handleExport = async (fmt: string) => {
    if (!gaps) return;
    if (fmt === 'sarif' || fmt === 'all') await writeSarif(gaps, path);
    if (fmt === 'md'    || fmt === 'all') await writeMarkdown(gaps, path);
    if (fmt === 'json'  || fmt === 'all') {
      const { applyResolutions } = await import('../lib/applyResolutions.js');
      await applyResolutions(gaps, path);
    }
    setExported(fmt);
  };

  if (error) return <Text color="red">Error: {error}</Text>;

  if (!gaps) return (
    <Box gap={1}><Spinner label="Reading gap-report.sarif..." /></Box>
  );

  const minIdx = LEVEL_ORDER.indexOf(
    minSeverity === 'high' ? 'error' : minSeverity === 'medium' ? 'warning' : 'note'
  );
  const filtered  = gaps.filter(g => LEVEL_ORDER.indexOf(g.level) <= minIdx);
  const highCount = gaps.filter(g => g.level === "error").length;

  return (
    <Box flexDirection="column" gap={2}>

      <SeverityChart gaps={gaps} />

      <GapTable gaps={filtered} />

      {highCount > 0 && (
        <Text color="red">
          {highCount} high-severity gap{highCount > 1 ? "s" : ""} must be
          resolved before import into the Spec Visualizer.
        </Text>
      )}

      {!exported
        ? <ExportSelect onSelect={handleExport} />
        : <Text color="green">✓ Exported as {exported}. Files written to {path}</Text>
      }
    </Box>
  );
}
