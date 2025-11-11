import type { ShapeKey } from "../geometry/boidShapes"


export interface Boid {
  position: Vec2
  velocity: Vec2
  acceleration: Vec2
  mass: number
}
export interface Theme {
  fill: string;
  stroke: string;
  lineWidth: number;
  shape: ShapeKey;
  size?: number;
}

export interface Vec2 { x: number; y: number; }

