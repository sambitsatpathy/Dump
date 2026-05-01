import fs from 'fs/promises';
import path from 'path';

export type Gap = {
  gapId:          string;
  ruleId:         string;
  level:          'error' | 'warning' | 'note' | 'none';
  message:        string;
  file:           string;
  objectLabel:    string;
  objectType:     string;
  repoRef:        string;
  suggestion:     string;
  autoResolvable: boolean;
  resolution:     string | null;
};

export async function readSarif(specsDir: string): Promise<Gap[]> {
  const filePath = path.join(specsDir, 'gap-report.sarif');
  const raw  = await fs.readFile(filePath, "utf8");
  const sarif = JSON.parse(raw);
  const results = sarif.runs?.[0]?.results ?? [];

  return results.map((r: any): Gap => ({
    gapId:          r.properties?.gapId ?? "",
    ruleId:         r.ruleId ?? "",
    level:          r.level ?? "none",
    message:        r.message?.text ?? "",
    file:           r.locations?.[0]?.physicalLocation?.artifactLocation?.uri ?? "",
    objectLabel:    r.properties?.objectLabel ?? "",
    objectType:     r.properties?.objectType ?? "",
    repoRef:        r.properties?.repoRef ?? "",
    suggestion:     r.properties?.suggestion ?? "",
    autoResolvable: r.properties?.autoResolvable ?? false,
    resolution:     r.properties?.resolution ?? null,
  }));
}
