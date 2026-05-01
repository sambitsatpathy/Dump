import fs from 'fs/promises';
import path from 'path';
import type { Gap } from './readSarif.js';

const LEVEL_LABEL: Record<string, string> = {
  error:   'High',
  warning: 'Medium',
  note:    'Low',
  none:    'Info',
};

export async function writeMarkdown(gaps: Gap[], outDir: string): Promise<void> {
  const lines: string[] = [
    '# Gap Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `**Total gaps:** ${gaps.length}`,
    '',
    '| Gap ID | Severity | Object | Rule | File |',
    '|--------|----------|--------|------|------|',
    ...gaps.map(g =>
      `| ${g.gapId} | ${LEVEL_LABEL[g.level] ?? g.level} | ${g.objectLabel} | ${g.ruleId} | ${g.file} |`
    ),
    '',
    '## Details',
    '',
    ...gaps.flatMap(g => [
      `### ${g.gapId} — ${g.objectLabel}`,
      '',
      `**Severity:** ${LEVEL_LABEL[g.level] ?? g.level}  `,
      `**Rule:** ${g.ruleId}  `,
      `**File:** \`${g.file}\`  `,
      `**Object type:** ${g.objectType}  `,
      `**Repo:** ${g.repoRef}  `,
      '',
      `**Message:** ${g.message}`,
      '',
      `**Suggestion:** ${g.suggestion}`,
      '',
      g.resolution ? `**Resolution:** ${g.resolution}` : '',
      '',
    ]),
  ];

  const outPath = path.join(outDir, 'gap-report.md');
  await fs.writeFile(outPath, lines.join('\n'), "utf8");
}
