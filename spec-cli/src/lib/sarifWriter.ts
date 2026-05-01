import fs from 'fs/promises';
import path from 'path';
import type { Gap } from './readSarif.js';

function buildRules(gaps: Gap[]) {
  const seen = new Set<string>();
  return gaps
    .filter(g => { const n = !seen.has(g.ruleId); seen.add(g.ruleId); return n; })
    .map(g => ({
      id:   g.ruleId,
      name: g.ruleId.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase()),
      shortDescription: { text: g.message.split(".")[0] },
      defaultConfiguration: { level: g.level },
    }));
}

export async function writeSarif(gaps: Gap[], outDir: string): Promise<void> {
  const sarif = {
    "$schema": "https://json.schemastore.org/sarif-2.1.0.json",
    "version": "2.1.0",
    runs: [{
      tool: { driver: { name: 'spec-checker', version: '1.0.0', rules: buildRules(gaps) } },
      results: gaps.map(g => ({
        ruleId:  g.ruleId,
        level:   g.level,
        message: { text: `${g.message} Suggestion: ${g.suggestion}` },
        locations: [{
          physicalLocation: {
            artifactLocation: { uri: g.file },
            region: { startLine: 1 }
          }
        }],
        properties: {
          gapId:          g.gapId,
          objectLabel:    g.objectLabel,
          objectType:     g.objectType,
          repoRef:        g.repoRef,
          suggestion:     g.suggestion,
          autoResolvable: g.autoResolvable,
          resolution:     g.resolution,
        }
      }))
    }]
  };

  const outPath = path.join(outDir, 'gap-report.sarif');
  await fs.writeFile(outPath, JSON.stringify(sarif, null, 2), "utf8");
}
