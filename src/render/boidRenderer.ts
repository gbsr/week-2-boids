// render/boidRenderer.ts
import type { ShapeSpec, ShapeKey } from '../geometry/boidShapes';
import { SHAPES } from '../geometry/boidShapes';
import type { Theme, Vec2 } from '../interface/boid';
import { state } from '../state/state';
import alignmentRule from '../utils/alignmentDebugViz';
import { gatherNeighbors } from '../utils/neighbor';

/* ---------------- path cache ---------------- */
const pathCache = new WeakMap<ShapeSpec, Path2D>();
function getPath(spec: ShapeSpec): Path2D {
  const cached = pathCache.get(spec);
  if (cached) return cached;
  const p = new Path2D();
  const pts = spec.points!;
  p.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]);
  p.closePath();
  pathCache.set(spec, p);
  return p;
}

/* ---------------- boid drawing (unchanged) ---------------- */
export function drawBoid(
  ctx: CanvasRenderingContext2D,
  pos: Vec2,
  vel: Vec2,
  shapeKey: ShapeKey,
  theme: Theme,
  size = theme.size ?? 1,
) {
  const spec = SHAPES[shapeKey];
  const angle = Math.atan2(vel.y, vel.x) || 0;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(angle);

  const scale = spec.scale * size;
  ctx.scale(scale, scale);

  ctx.lineWidth = (theme.lineWidth ?? 0) / scale;
  ctx.strokeStyle = theme.stroke;
  ctx.fillStyle   = theme.fill;

  if (spec.type === 'circle') {
    const r = spec.radius ?? 4;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    if ((theme.lineWidth ?? 0) > 0) ctx.stroke();
  } else {
    const path = getPath(spec);
    ctx.fill(path);
    if ((theme.lineWidth ?? 0) > 0) ctx.stroke(path);
  }
  ctx.restore();
}

/* ---------------- offscreens for stamped trails ---------------- */
let trailCanvas: HTMLCanvasElement | null = null;
let trailCtx: CanvasRenderingContext2D | null = null;

let dpr = 1, pxW = 0, pxH = 0;

function ensureMainCanvas(canvas: HTMLCanvasElement, wCSS: number, hCSS: number) {
  const next = Math.max(1, window.devicePixelRatio || 1);
  const needW = Math.max(1, Math.floor(wCSS * next));
  const needH = Math.max(1, Math.floor(hCSS * next));
  if (canvas.width !== needW || canvas.height !== needH) {
    canvas.width = needW;
    canvas.height = needH;
  }
  dpr = next;
}

function ensureOffscreen(wCSS: number, hCSS: number) {
  const needW = Math.max(1, Math.floor(wCSS * dpr));
  const needH = Math.max(1, Math.floor(hCSS * dpr));
  if (!trailCanvas) {
    trailCanvas = document.createElement('canvas');
    trailCtx = trailCanvas.getContext('2d')!;
  }
  if (pxW !== needW || pxH !== needH) {
    pxW = needW; pxH = needH;
    trailCanvas!.width  = pxW;
    trailCanvas!.height = pxH;
  }
}

/* ---------------- last positions (CSS space) ---------------- */
const lastX: number[] = [];
const lastY: number[] = [];
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

/* ---------------- renderer: stamped trails (no fade) ---------------- */
export default function renderFrame(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  _drawBoidIgnored: any, // kept to match your call sites
  theme: Theme
) {
  const wCSS = canvas.clientWidth;
  const hCSS = canvas.clientHeight;

  // Keep scaling EXACTLY as-is
  ensureMainCanvas(canvas, wCSS, hCSS);
  ensureOffscreen(wCSS, hCSS);

  const posX = state.arrays.position.x;
  const posY = state.arrays.position.y;
  const velX = state.arrays.velocity.x;
  const velY = state.arrays.velocity.y;
  const count = posX.length;

  syncLastPositions(count, posX, posY);

  // HEAD (optional): if you want live heads, draw them later on the main ctx in CSS space.

  // TRAIL — stamp DISCRETE clones directly into the pixel-space trail buffer
  const STEP = 6;                             // CSS px between stamps
  const MAX_BRIDGE = Math.max(wCSS, hCSS)*0.45; // guard long jumps/wraps

  const tctx = trailCtx!;
  tctx.setTransform(1, 0, 0, 1, 0, 0);        // pixel space
  tctx.imageSmoothingEnabled = false;

  // Convert theme/size for pixel-space stamping
  const sizeCSS = (theme.size ?? 1) * state.params.size; // same visual “size” as before
  const sizePX  = sizeCSS * dpr;
  const themePX: Theme = {
    ...theme,
    lineWidth: (theme.lineWidth ?? 0) * dpr
  };

  for (let i = 0; i < count; i++) {
    const x0 = lastX[i], y0 = lastY[i];     // CSS units
    const x1 = posX[i],  y1 = posY[i];

    const dx = x1 - x0, dy = y1 - y0;
    const dist = Math.hypot(dx, dy);

    // Skip ridiculous jumps (wraps/teleports) and just resync
    if (!isFinite(dist) || dist > MAX_BRIDGE) {
      lastX[i] = x1; lastY[i] = y1;
      continue;
    }

    const steps = Math.max(1, Math.floor(dist / STEP));
    const inv = 1 / steps;

    for (let s = 1; s <= steps; s++) {
      const t = s * inv;
      const sx = (x0 + dx * t) * dpr;       // pixel coords
      const sy = (y0 + dy * t) * dpr;
      // orientation from motion (CSS vector is fine)
      drawBoid(
        tctx,
        { x: sx, y: sy },
        { x: dx, y: dy },
        theme.shape as ShapeKey,
        themePX,
        sizePX
      );
    }

    lastX[i] = x1; lastY[i] = y1;           // advance history
  }

  // PRESENT — 1:1 blit to the on-screen canvas (pixel space)
  ctx.setTransform(1, 0, 0, 1, 0, 0);       // pixel space
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(trailCanvas!, 0, 0);        // exact pixels, no scaling

  // OPTIONAL: live heads & debug overlays in CSS space
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);   // switch to CSS coords

  if (state.params.visualizeAlignmentRadius || state.params.visualizeAlignmentToNeighbors) {
    const neighbors: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < count; i++) {
      if (state.params.visualizeAlignmentToNeighbors) {
        gatherNeighbors(i, { x: posX, y: posY }, state.params.alignmentRadius, neighbors);
      } else {
        neighbors.length = 0;
      }
      alignmentRule({ x: posX[i], y: posY[i] }, neighbors, ctx);
      neighbors.length = 0;
    }
  }
}