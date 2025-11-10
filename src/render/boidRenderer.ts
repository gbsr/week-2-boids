import type { ShapeSpec, ShapeKey } from '../geometry/boidShapes';
import { SHAPES } from '../geometry/boidShapes';

export interface Theme {
  fill: string;
  stroke: string;
  lineWidth: number;
}

export interface Vec2 { x: number; y: number; }

// cache for path shapes so we don’t rebuild each frame
const pathCache = new WeakMap<ShapeSpec, Path2D>();

function getPath(spec: ShapeSpec): Path2D {
  let cached = pathCache.get(spec);
  if (cached) return cached;
  const path = new Path2D();
  const points = spec.points!;
  path.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) path.lineTo(points[i][0], points[i][1]);
  path.closePath();
  pathCache.set(spec, path);
  return path;
}

/**
 * Draws a single boid at `pos`, oriented by `vel`.
 * `shapeKey` picks geometry. `size` is a scalar on top of spec.scale.
 */
export function drawBoid(
  ctx: CanvasRenderingContext2D,
  pos: Vec2,
  vel: Vec2,
  shapeKey: ShapeKey,
  theme: Theme,
  size = 1
) {
  const spec = SHAPES[shapeKey];

  // Heading: nose along +X in model space
  const angle = Math.atan2(vel.y, vel.x) || 0;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(angle);

  // Anchor: place model (0,0) either at tip or center
  if (spec.anchor === 'center' && spec.type === 'path' && spec.points) {
    // Already centered via points above; nothing to do.
  }

  const scale = spec.scale * size;
  ctx.scale(scale, scale);

  ctx.lineWidth = theme.lineWidth / scale; // keep width consistent regardless of scale
  ctx.strokeStyle = theme.stroke;
  ctx.fillStyle = theme.fill;

  if (spec.type === 'circle') {
    const radius = (spec.radius ?? 4);

    // Draw circle at origin
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    if (theme.lineWidth > 0) ctx.stroke();
  } else {
    const path = getPath(spec);
    ctx.fill(path);
    if (theme.lineWidth > 0) ctx.stroke(path);
  }

  ctx.restore();
}


export default function renderFrame(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, drawBoid: any, center: { x: number; y: number }, vel: { x: number; y: number }, theme: { fill: string; stroke: string; lineWidth: number; }) {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  // Try different shapes: 'triangle' | 'circle' | 'diamond'
  drawBoid(ctx, center, vel, 'triangle', theme, 1);
}
