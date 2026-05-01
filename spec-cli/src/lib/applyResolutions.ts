import fs from 'fs/promises';
import path from 'path';
import type { Gap } from './readSarif.js';

export async function applyResolutions(gaps: Gap[], specsDir: string): Promise<number> {
  const annotated = gaps.filter(g => g.resolution !== null);
  if (annotated.length === 0) return 0;

  const reportPath = path.join(specsDir, 'gap-report.json');
  await fs.writeFile(reportPath, JSON.stringify(gaps, null, 2), "utf8");
  return annotated.length;
}
