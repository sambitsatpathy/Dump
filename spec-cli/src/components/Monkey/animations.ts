import { AnimationName } from './types';

// Each frame is an array of strings (one per line).
// All frames within an animation must have the same line count and line width.

export const ANIMATIONS: Record<AnimationName, string[][]> = {
  idle: [
    [
      ' (o o) ',
      '( Y   )',
      '  m m  ',
    ],
    [
      ' (o o) ',
      '(  Y  )',
      '  m m  ',
    ],
    [
      ' (o o) ',
      '( Y   )',
      '  m m  ',
    ],
    [
      ' (o o) ',
      '(   Y )',
      '  m m  ',
    ],
  ],

  walk: [
    [
      '  (o o)  ',
      ' (  Y  ) ',
      '   /\\    ',
      '         ',
    ],
    [
      '  (o o)  ',
      '/(  Y  ) ',
      '   | \\   ',
      '         ',
    ],
    [
      '  (o o)  ',
      ' (  Y  )\\',
      '   /|    ',
      '         ',
    ],
    [
      '  (o o)  ',
      ' (  Y  ) ',
      '   \\|    ',
      '         ',
    ],
  ],

  think: [
    [
      '         ',
      '  (o o)  ',
      ' ( Y   ) ',
      '   m m   ',
    ],
    [
      '  ? .    ',
      '  (o o)/ ',
      ' ( Y   ) ',
      '   m m   ',
    ],
    [
      '  ? . .  ',
      '  (o o)/ ',
      ' ( Y   ) ',
      '   m m   ',
    ],
  ],

  celebrate: [
    [
      ' \\(o o)/ ',
      '  ( Y )  ',
      '   ^ ^   ',
    ],
    [
      '  (o o)  ',
      ' \\( Y )/ ',
      '   ^ ^   ',
    ],
    [
      ' \\(o o)/ ',
      '  ( Y )  ',
      '   ^ ^   ',
    ],
  ],

  sleep: [
    [
      '         ',
      '  (-_-)  ',
      ' ( Y   ) ',
      '   m m   ',
    ],
    [
      '   z     ',
      '  (-_-)  ',
      ' ( Y   ) ',
      '   m m   ',
    ],
    [
      '   z Z   ',
      '  (-_-)  ',
      ' ( Y   ) ',
      '   m m   ',
    ],
  ],
};
