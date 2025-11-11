// What shapes exist (expand later)
export type ShapeKey = 'triangle' | 'circle' | 'diamond' | 'cross' | 'arrow' | 'kite' | 'chevron' | 'leaf' | 'capsule' | 'wedge';

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

  cross: {
    type: 'path',
    anchor: 'center',
    forward: '+x',
    scale: 1,
    points: [
      [-6, -2],
      [-2, -2],
      [-2, -6],
      [2, -6],
      [2, -2],
      [6, -2],
      [6, 2],
      [2, 2],
      [2, 6],
      [-2, 6],
      [-2, 2],
      [-6, 2],
    ],
  },

  arrow: {
    type: 'path',
    anchor: 'tip',
    forward: '+x',
    scale: 1,
    points: [
      [0, 0],     // tip
      [-20, 8],   // lower base
      [-12, 3],    // inner notch
      [-12, -3],   // inner notch
      [-20, -8],  // upper base
    ],
  },

  // Symmetric kite (center-anchored)
  kite: {
    type: 'path',
    anchor: 'center',
    forward: '+x',
    scale: 1,
    points: [
      [10, 0],
      [0, 5],
      [-10, 0],
      [0, -5],
    ],
  },

  // Chevron (tip-anchored), reads like a > shape
  chevron: {
    type: 'path',
    anchor: 'tip',
    forward: '+x',
    scale: 1,
    points: [
      [0, 0],     // tip
      [-8, 6],
      [-6, 6],
      [-2, 2],
      [-2, -2],
      [-6, -6],
      [-8, -6],
    ],
  },

  // Leaf (center-anchored), gentle organic shape
  leaf: {
    type: 'path',
    anchor: 'center',
    forward: '+x',
    scale: 1,
    points: [
      [9, 0],
      [6, 3.5],
      [0, 5],
      [-8, 2],
      [-9, 0],
      [-8, -2],
      [0, -5],
      [6, -3.5],
    ],
  },

  // Capsule (center-anchored) — approximated with a rounded rectangle outline
  capsule: {
    type: 'path',
    anchor: 'center',
    forward: '+x',
    scale: 1,
    points: [
      [8, -3],
      [8, 3],
      [6, 5],
      [-6, 5],
      [-8, 3],
      [-8, -3],
      [-6, -5],
      [6, -5],
    ],
  },

  // Wedge (tip-anchored), broad blunt nose
  wedge: {
    type: 'path',
    anchor: 'tip',
    forward: '+x',
    scale: 1,
    points: [
      [0, 0],     // tip
      [-10, 7],
      [-14, 0],
      [-10, -7],
    ],
  },
};