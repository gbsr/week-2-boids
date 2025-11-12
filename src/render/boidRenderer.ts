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

/* distance-accumulator state for true STEP control (CSS px) */
const distSinceStamp: number[] = [];
const stampX: number[] = [];
const stampY: number[] = [];

function syncLastPositions(count: number, posX: number[], posY: number[]) {
  if (lastX.length !== count) {
    lastX.length = count;
    lastY.length = count;
    distSinceStamp.length = count;
    stampX.length = count;
    stampY.length = count;
    for (let i = 0; i < count; i++) {
      lastX[i] = posX[i];
      lastY[i] = posY[i];
      distSinceStamp[i] = 0;
      stampX[i] = posX[i];
      stampY[i] = posY[i];
    }
  }
}

/* ---------------- renderer: stamped trails with fade + real STEP ---------------- */
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
  const count = posX.length;

  syncLastPositions(count, posX, posY);

  // TRAIL — discrete stamps directly into pixel-space trail buffer
  const STEP = Math.max(1, state.params.trailStep ?? 6);      // CSS px per stamp
  const MAX_BRIDGE = Math.max(wCSS, hCSS) * 0.45;             // guard long jumps/wraps

  const tctx = trailCtx!;
  tctx.setTransform(1, 0, 0, 1, 0, 0);        // pixel space
  tctx.imageSmoothingEnabled = false;

  // Convert theme/size for pixel-space stamping
  const sizeCSS = (theme.size ?? 1) * state.params.size;
  const sizePX  = sizeCSS * dpr;
  const themePX: Theme = {
    ...theme,
    lineWidth: (theme.lineWidth ?? 0) * dpr
  };

  // Fade: trailLength 0 → instant; 1 → infinite (inverted, smoother)
  const tl = Math.min(1, Math.max(0, state.params.trailLength ?? 1));
  const erase = Math.pow(1 - tl, 2.2);        // perceptual-ish
  if (erase > 0) {
    tctx.globalCompositeOperation = 'destination-out';
    tctx.fillStyle = `rgba(0,0,0,${erase})`;
    tctx.fillRect(0, 0, pxW, pxH);
    tctx.globalCompositeOperation = 'source-over';
  }

  for (let i = 0; i < count; i++) {
    const x0 = lastX[i], y0 = lastY[i];
    const x1 = posX[i],  y1 = posY[i];

    const dx = x1 - x0, dy = y1 - y0;
    const segDist = Math.hypot(dx, dy);

    // Teleport/warp guard: resync stamp anchor
    if (!isFinite(segDist) || segDist > MAX_BRIDGE) {
      lastX[i] = x1; lastY[i] = y1;
      stampX[i] = x1; stampY[i] = y1;
      distSinceStamp[i] = 0;
      continue;
    }

    // accumulate distance travelled this frame
    distSinceStamp[i] += segDist;

    // unit direction along segment (protect zero)
    const ux = segDist > 0 ? dx / segDist : 0;
    const uy = segDist > 0 ? dy / segDist : 0;

    // emit stamps every STEP css px from previous stamp anchor
    while (distSinceStamp[i] >= STEP) {
      stampX[i] += ux * STEP;
      stampY[i] += uy * STEP;
      distSinceStamp[i] -= STEP;

      drawBoid(
        tctx,
        { x: stampX[i] * dpr, y: stampY[i] * dpr },   // pixel coords
        { x: dx, y: dy },
        theme.shape as ShapeKey,
        themePX,
        sizePX
      );
    }

    // advance history
    lastX[i] = x1; lastY[i] = y1;
  }

  // PRESENT — 1:1 blit to the on-screen canvas (pixel space)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(trailCanvas!, 0, 0);          // exact pixels, no scaling

  // OPTIONAL: live heads & debug overlays in CSS space
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

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