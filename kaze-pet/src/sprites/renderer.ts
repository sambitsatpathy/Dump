import chalk from 'chalk';

// null = transparent (use terminal background)
export type Pixel = string | null;
export type SpriteFrame = readonly string[];

// Color palette for KAZE
export const PALETTE: Record<string, Pixel> = {
  '.': null,         // transparent
  'B': '#5865F2',    // indigo body (main)
  'b': '#3B47CC',    // body shadow/depth
  'H': '#8892FF',    // highlight (light indigo)
  'E': '#DCE0FF',    // eye white (soft blue-white)
  'p': '#0D0820',    // pupil (near-black)
  'A': '#F59E0B',    // amber — eye center, energy
  'T': '#4338CA',    // tail primary
  't': '#2D26A0',    // tail shadow
  'G': '#C4B5FD',    // lavender glow
  'R': '#EF4444',    // red (error)
  'r': '#7F1D1D',    // dark red (error shadow)
  'S': '#FDE68A',    // star/gold (celebration)
  's': '#F59E0B',    // star mid-tone
  'Z': '#6B7280',    // grey (sleep Z's)
  'W': '#1E1B4B',    // very dark indigo (outline/depth)
  'C': '#67E8F9',    // cyan sparkle
  'g': '#34D399',    // green (success)
};

// Decode a SpriteFrame row string into an array of Pixel colors
function decodeRow(row: string): Pixel[] {
  return row.split('').map(ch => {
    if (ch in PALETTE) return PALETTE[ch];
    return null;
  });
}

/**
 * Renders a SpriteFrame into an array of chalk-colored strings (one per printed line).
 * Uses the half-block ▀ technique: each character cell covers 2 vertical pixels.
 * foreground = top pixel color, background = bottom pixel color.
 */
export function renderFrame(frame: SpriteFrame): string[] {
  const lines: string[] = [];
  const height = frame.length;

  for (let y = 0; y < height; y += 2) {
    const topRow = decodeRow(frame[y] ?? '');
    const botRow = decodeRow(frame[y + 1] ?? new Array(topRow.length).fill('.').join(''));
    const width = Math.max(topRow.length, botRow.length);
    let line = '';

    for (let x = 0; x < width; x++) {
      const top = topRow[x] ?? null;
      const bot = botRow[x] ?? null;

      if (top === null && bot === null) {
        line += ' ';
      } else if (top !== null && bot === null) {
        // only top pixel — use foreground ▀
        line += chalk.hex(top)('▀');
      } else if (top === null && bot !== null) {
        // only bottom pixel — use foreground ▄
        line += chalk.hex(bot)('▄');
      } else {
        // both pixels — ▀ with bg=bot, fg=top
        line += chalk.bgHex(bot!).hex(top!)('▀');
      }
    }
    lines.push(line);
  }
  return lines;
}

/**
 * Pads a frame with empty rows at top (for bob-down frames) or at bottom.
 */
export function padFrame(frame: SpriteFrame, topPad: number): SpriteFrame {
  const width = frame[0]?.length ?? 10;
  const emptyRow = '.'.repeat(width);
  return [
    ...Array(topPad).fill(emptyRow),
    ...frame,
  ] as unknown as SpriteFrame;
}
