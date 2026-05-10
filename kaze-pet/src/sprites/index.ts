import type { SpriteFrame } from './renderer.js';

// ─────────────────────────────────────────────────────────
//  KAZE — 10px wide × 20px tall  (renders as 10 chars × 10 lines)
//
//  Design notes:
//  - Left eye is 3px tall, right eye is 2px tall → subtle asymmetry = personality
//  - Crystal ear tufts (H = highlight tip, B = body base)
//  - Body narrows from head → torso → flowing tail
//  - Palette key: B=body, b=shadow, H=highlight, E=eye-white, p=pupil,
//                 A=amber, T=tail, t=tail-shadow, G=glow, W=deep-outline
// ─────────────────────────────────────────────────────────

// ── IDLE (2-frame gentle float) ──────────────────────────

const IDLE_A: SpriteFrame = [
  '..HB..BH..',   //  0  crystal ear tips
  '..BB..BB..',   //  1  ear bases
  '.WBBBBBBW.',   //  2  head top with depth outline
  '.BBbBBBbBB',   //  3  head — subtle shadow pockets
  '.BBEEBBEbb',   //  4  eyes: left 2px wide, right 1px — asymmetric start
  '.BBEpBBpBb',   //  5  pupils: left centered, right slightly high
  '.BBEEBBbBb',   //  6  left eye has bottom glow row, right closes off
  '.BBbBBBbBB',   //  7  cheek line
  '..BBBBBBB.',   //  8  chin / neck narrows
  '..BBHBBb..',   //  9  upper body — H highlight left-of-center
  '..bBBBBb..',   // 10  body mid
  '...BBBBB..',   // 11  lower body — getting thinner
  '...tTTTt..',   // 12  tail bloom
  '....TTTt..',   // 13  tail body
  '.....TTt..',   // 14  tail taper
  '......Tt..',   // 15  tail tip
  '..........',   // 16  clear
  '..........',   // 17
  '..........',   // 18
  '..........',   // 19
];

const IDLE_B: SpriteFrame = [
  '..........',   //  0  shifted down 1px — bob effect
  '..HB..BH..',   //  1
  '..BB..BB..',   //  2
  '.WBBBBBBW.',   //  3
  '.BBbBBBbBB',   //  4
  '.BBEEBBEbb',   //  5
  '.BBEpBBpBb',   //  6
  '.BBEEBBbBb',   //  7
  '.BBbBBBbBB',   //  8
  '..BBBBBBB.',   //  9
  '..BBHBBb..',   // 10
  '..bBBBBb..',   // 11
  '...BBBBB..',   // 12
  '...tTTTt..',   // 13
  '....TTTt..',   // 14
  '.....TTt..',   // 15
  '......Tt..',   // 16
  '..........',   // 17
  '..........',   // 18
  '..........',   // 19
];

// ── WORKING (focused — eyes narrow to slits, body leans slightly) ─

const WORK_A: SpriteFrame = [
  '..HB..BH..',   //  0
  '..BB..BB..',   //  1
  '.WBBBBBBW.',   //  2
  '.BBbBBBbBB',   //  3
  '.BBBbBBBbb',   //  4  eye-white gone → focused
  '.BBABBBABb',   //  5  A=amber slit eyes — narrow glowing lines
  '.BBBbBBBbb',   //  6  closed off again
  '.BBbBBBbBB',   //  7
  '..BBBBBBB.',   //  8
  '..BBHBBb..',   //  9
  '..bBBBBb..',   // 10
  '...BBBBB..',   // 11
  '...tTTTt..',   // 12
  '....TTTt..',   // 13  tail swings right slightly
  '.....TTTt.',   // 14  tail end shifts right vs idle
  '......tTt.',   // 15
  '..........',   // 16
  '..........',   // 17
  '..........',   // 18
  '..........',   // 19
];

const WORK_B: SpriteFrame = [
  '..HB..BH..',   //  0
  '..BB..BB..',   //  1
  '.WBBBBBBW.',   //  2
  '.BBbBBBbBB',   //  3
  '.BBBbBBBbb',   //  4
  '.BBABBBABb',   //  5
  '.BBBbBBBbb',   //  6
  '.BBbBBBbBB',   //  7
  '..BBBBBBB.',   //  8
  '..BBHBBb..',   //  9
  '..bBBBBb..',   // 10
  '...BBBBB..',   // 11
  '...tTTTt..',   // 12
  '...tTTTt..',   // 13  tail swings left (back toward center)
  '....TTTt..',   // 14
  '.....TTt..',   // 15
  '..........',   // 16
  '..........',   // 17
  '..........',   // 18
  '..........',   // 19
];

// ── SLEEPING (drooping, eyes closed, sinks 2px lower) ────

const SLEEP_A: SpriteFrame = [
  '..........',   //  0  sunk down — 2px lower overall
  '..........',   //  1
  '..HB..BH..',   //  2
  '..BB..BB..',   //  3
  '.WBBBBBBW.',   //  4
  '.BBbBBBbBB',   //  5
  '.BBBBBBBbb',   //  6  eyes closed — all body color
  '.BBWbBWBBb',   //  7  closed-eye marks (W = dark thin line = eyelids)
  '.BBBBBBBbb',   //  8
  '.BBbBBBbBB',   //  9
  '..bBBBBBb.',   // 10  body slumped (wider = relaxed)
  '..bBBBBBb.',   // 11
  '..bBBBBb..',   // 12
  '...tTTTt..',   // 13
  '...tTTt...',   // 14  tail droops lower
  '....tTt...',   // 15
  '.....t....',   // 16
  '..........',   // 17
  '..........',   // 18
  '..........',   // 19
];

const SLEEP_B: SpriteFrame = [
  '..........',   //  0
  '..........',   //  1
  '..HB..BH..',   //  2
  '..BB..BB..',   //  3
  '.WBBBBBBW.',   //  4
  '.BBbBBBbBB',   //  5
  '.BBBBBBBbb',   //  6
  '.BBWbBWBBb',   //  7
  '.BBBBBBBbb',   //  8
  '.BBbBBBbBB',   //  9
  '..bBBBBBb.',   // 10  breathe out — body slightly wider
  '..BBBBBBb.',   // 11
  '..bBBBBb..',   // 12
  '...tTTTt..',   // 13
  '...tTTt...',   // 14
  '....tTt...',   // 15
  '.....t....',   // 16
  '..........',   // 17
  '..........',   // 18
  '..........',   // 19
];

// ── CELEBRATING (jump + eyes become stars + sparkles) ────

const PARTY_A: SpriteFrame = [
  '.C.......C',   //  0  sparkles burst at corners
  '..HB..BH..',   //  1  jumped up 1px
  '..BB..BB..',   //  2
  '.WBBBBBBW.',   //  3
  '.BBbBBBbBB',   //  4
  '.BBSSBBSSb',   //  5  S=gold star eyes!
  '.BBSsBBsSb',   //  6  star center glow
  '.BBSSBBSSb',   //  7
  '.BBbBBBbBB',   //  8
  '..BBBBBBB.',   //  9
  '..BBHBBb..',   // 10
  '..bBBBBb..',   // 11
  '...BBBBB..',   // 12
  '...sTTTs..',   // 13  tail energized — gold-touched
  '....sTs...',   // 14
  '.....s....',   // 15
  '.C.......C',   // 16  sparkles at bottom corners
  '..........',   // 17
  '..........',   // 18
  '..........',   // 19
];

const PARTY_B: SpriteFrame = [
  '...C...C..',   //  0  sparkles shift position
  '..........',   //  1
  '..HB..BH..',   //  2  landed back
  '..BB..BB..',   //  3
  '.WBBBBBBW.',   //  4
  '.BBbBBBbBB',   //  5
  '.BBSSBBSSb',   //  6
  '.BBSsBBsSb',   //  7
  '.BBSSBBSSb',   //  8
  '.BBbBBBbBB',   //  9
  '..BBBBBBB.',   // 10
  '..BBHBBb..',   // 11
  '..bBBBBb..',   // 12
  '...BBBBB..',   // 13
  '...sTTTs..',   // 14
  '....sTs...',   // 15
  '.....s....',   // 16
  '...C...C..',   // 17
  '..........',   // 18
  '..........',   // 19
];

// ── ERROR / PANICKING (eyes go wide & red, body flushes R) ──

const ERROR_A: SpriteFrame = [
  '..HB..BH..',   //  0
  '..BB..BB..',   //  1
  '.WBBBBBBW.',   //  2
  '.rBRBBBRBr',   //  3  R=red flush on head edges
  '.rBEEBBEEr',   //  4  eyes wide (E = eye white, no change yet)
  '.rBEpBBpEr',   //  5  pupils — wide open panic
  '.rBEEBBEEr',   //  6
  '.rBRBBBRBr',   //  7  red cheek flush
  '..RBBBBR..',   //  8  body flushes red on sides
  '..BRHBRb..',   //  9
  '..bRBBRb..',   // 10
  '...BBBBB..',   // 11
  '...rRRRr..',   // 12  tail panics red
  '....RRr...',   // 13
  '.....Rr...',   // 14
  '..........',   // 15
  '..........',   // 16
  '..........',   // 17
  '..........',   // 18
  '..........',   // 19
];

const ERROR_B: SpriteFrame = [    // shake: shift 1px right
  '..........',   //  0
  '..HB..BH..',   //  1  shifted down for shake
  '..BB..BB..',   //  2
  '.WBBBBBBW.',   //  3
  '.rBRBBBRBr',   //  4
  '.rBEEBBEEr',   //  5
  '.rBEpBBpEr',   //  6
  '.rBEEBBEEr',   //  7
  '.rBRBBBRBr',   //  8
  '..RBBBBR..',   //  9
  '..BRHBRb..',   // 10
  '..bRBBRb..',   // 11
  '...BBBBB..',   // 12
  '...rRRRr..',   // 13
  '....RRr...',   // 14
  '.....Rr...',   // 15
  '..........',   // 16
  '..........',   // 17
  '..........',   // 18
  '..........',   // 19
];

// ── COMMIT (quick flash of green then back to idle) ───────

const COMMIT_A: SpriteFrame = [
  '..HB..BH..',   //  0
  '..BB..BB..',   //  1
  '.WBBBBBBW.',   //  2
  '.BBbBBBbBB',   //  3
  '.BBgGBBGgb',   //  4  g=green tint on eyes (success!)
  '.BBgGBBGgb',   //  5
  '.BBgGBBGgb',   //  6
  '.BBbBBBbBB',   //  7
  '..gBBBBBg.',   //  8  green body tinge
  '..BgHBgb..',   //  9
  '..bBgBgb..',   // 10
  '...BBBBB..',   // 11
  '...gTTTg..',   // 12  tail goes green
  '....gTg...',   // 13
  '.....g....',   // 14
  '..........',   // 15
  '..........',   // 16
  '..........',   // 17
  '..........',   // 18
  '..........',   // 19
];

// ── EXPORTED ANIMATION SETS ───────────────────────────────

export type PetState = 'idle' | 'working' | 'sleeping' | 'celebrating' | 'error' | 'commit';

export interface AnimationDef {
  frames: SpriteFrame[];
  intervalMs: number;   // ms per frame
}

export const ANIMATIONS: Record<PetState, AnimationDef> = {
  idle: {
    frames: [IDLE_A, IDLE_B],
    intervalMs: 700,
  },
  working: {
    frames: [WORK_A, WORK_B],
    intervalMs: 300,
  },
  sleeping: {
    frames: [SLEEP_A, SLEEP_B],
    intervalMs: 900,
  },
  celebrating: {
    frames: [PARTY_A, PARTY_B, PARTY_A, PARTY_B],
    intervalMs: 150,
  },
  error: {
    frames: [ERROR_A, ERROR_B, ERROR_A, ERROR_B],
    intervalMs: 120,
  },
  commit: {
    frames: [COMMIT_A, IDLE_A],
    intervalMs: 400,
  },
};
