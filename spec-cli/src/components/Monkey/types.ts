export type AnimationName = 'idle' | 'walk' | 'think' | 'celebrate' | 'sleep';

export interface MonkeyProps {
  animation?: AnimationName;
  fps?: number;
  color?: string;
  loop?: boolean;
  onDone?: () => void;
}
