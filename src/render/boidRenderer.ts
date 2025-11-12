import type { ShapeSpec, ShapeKey } from '../geometry/boidShapes';
import { SHAPES } from '../geometry/boidShapes';
import type { Theme, Vec2 } from '../interface/boid'
import { state } from '../state/state'
import alignmentRule from '../utils/alignmentDebugViz'
import { gatherNeighbors } from '../utils/neighbor'

// off canvas trails
let trailCanvas: HTMLCanvasElement | null = null;
let trailCtx: CanvasRenderingContext2D | null = null;
let pxW = 0, pxH = 0, dpr = 1;

// per-boid last positions in CSS pixels
const lastX: number[] = [];
const lastY: number[] = [];

function ensureTrailBuffer(wCSS: number, hCSS: number) {
  const nextDpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  const w = Math.max(1, Math.floor(wCSS * nextDpr));
  const h = Math.max(1, Math.floor(hCSS * nextDpr));
  if (!trailCanvas) {
    trailCanvas = document.createElement('canvas');
    trailCtx = trailCanvas.getContext('2d')!;
  }
  if (w !== pxW || h !== pxH || nextDpr !== dpr) {
    dpr = nextDpr; pxW = w; pxH = h;
    trailCanvas!.width = pxW;
    trailCanvas!.height = pxH;
  }
}

function syncLastPositions(count: number, posX: number[], posY: number[]) {
  if (lastX.length !== count) {
    lastX.length = count;
    lastY.length = count;
    for (let i = 0; i < count; i++) {
      lastX[i] = posX[i];
      lastY[i] = posY[i];
    }
  }
}


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
  size = theme.size ?? 1,
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


export default function renderFrame(ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  drawBoid: any, 
  theme: Theme) 
  {
  const wCSS = canvas.clientWidth;
  const hCSS = canvas.clientHeight;

  ensureTrailBuffer(wCSS, hCSS);

  const posX = state.arrays.position.x;
  const posY = state.arrays.position.y;
  const velX = state.arrays.velocity.x;
  const velY = state.arrays.velocity.y;
  const count = posX.length;

  // make sure last positions exist and match count
  syncLastPositions(count, posX, posY);

  // stamp spacing (CSS px between clones)
  const STEP = 6;             // steps between stamps
  const MAX_BRIDGE = Math.max(wCSS, hCSS) * 0.45; // guard against teleports/wraps

  // stamp into persistent trail buffer in CSS space
  const tctx = trailCtx!;
  tctx.setTransform(dpr, 0, 0, dpr, 0, 0); // positions are CSS px
  tctx.imageSmoothingEnabled = false;      // keep stamps crisp

  const size = (theme.size ?? 1) * state.params.size;

  for (let i = 0; i < count; i++) {
    const x0 = lastX[i], y0 = lastY[i];
    const x1 = posX[i],  y1 = posY[i];

    // detect teleports / wraps; if too far, resync without bridging
    const dx = x1 - x0, dy = y1 - y0;
    const dist = Math.hypot(dx, dy);
    if (!isFinite(dist) || dist > MAX_BRIDGE) {
      lastX[i] = x1; lastY[i] = y1;
      continue;
    }

    const steps = Math.max(1, Math.floor(dist / STEP));
    const inv = 1 / steps;

    // stamp one clone at each discrete step (including end)
    for (let s = 1; s <= steps; s++) {
      const t = s * inv;
      const sx = x0 + dx * t;
      const sy = y0 + dy * t;
      // derive a direction from segment to orient the boid
      const vx = dx, vy = dy;

      drawBoid(
        tctx,
        { x: sx, y: sy },
        { x: vx, y: vy },
        theme.shape,
        theme,
        size
      );
    }

    // update last position after stamping
    lastX[i] = x1; lastY[i] = y1;
  }

  // present: clear screen, then blit the persistent trail buffer
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, wCSS, hCSS);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(trailCanvas!, 0, 0, pxW, pxH, 0, 0, wCSS, hCSS);

  // optional: draw *live* heads on top (comment out if you want ONLY the trail)
  const neighbors: Array<{ x: number; y: number }> = [];

  for (let i = 0; i < count; i++) {
    drawBoid(
      ctx, 
      { x: posX[i], y: posY[i] }, 
      { x: velX[i], y: velY[i] }, 
      theme.shape, 
      theme, 
      size
    );
  
    // overlays (circle and/or lines), if neighbor is inside alignment radius
    if (state.params.visualizeAlignmentRadius || state.params.visualizeAlignmentToNeighbors) {
      const radius = state.params.alignmentRadius;

      gatherNeighbors(i, { x: posX, y: posY }, 2 * radius, neighbors);
      alignmentRule({ x: posX[i], y: posY[i] }, neighbors, ctx);
    }
    neighbors.length = 0; // reset for next boid
  }
}
