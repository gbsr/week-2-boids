// What shapes exist (expand later)
export type ShapeKey = 'triangle' | 'circle' | 'diamond';

export type Anchor = 'tip' | 'center';

export interface ShapeSpec {
  type: 'path' | 'circle';
  anchor: Anchor;
  forward: '+x';
  scale: number;

  // For path shapes:
  points?: Array<[number, number]>;
  
  // For circles:
  radius?: number;
}

export const SHAPES: Record<ShapeKey, ShapeSpec> = {
  
  triangle: {
    type: 'path',
    anchor: 'tip',
    forward: '+x',
    scale: 1,
    
    points: [
      [0, 0],     // tip
      [-10, 4],   // base lower
      [-10, -4],  // base upper
    ],
  },

  circle: {
    type: 'circle',
    anchor: 'center',
    forward: '+x',
    scale: 1,
    radius: 4,
  },
  
  diamond: {
    type: 'path',
    anchor: 'center',
    forward: '+x',
    scale: 1,
    points: [
      [8, 0],
      [0, 4],
      [-8, 0],
      [0, -4],
    ],
  },
};