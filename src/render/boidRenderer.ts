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

/* ---------------- color utils ---------------- */
function randomColorHSL(): string {
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.random() * 30; // 60–90%
  const l = 45 + Math.random() * 30; // 45–75%
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/* ---------------- boid drawing ---------------- */
type OutlineOpts = { color: string; alpha?: number; widthMul?: number };
export function drawBoid(
  ctx: CanvasRenderingContext2D,
  pos: Vec2,
  vel: Vec2,
  shapeKey: ShapeKey,
  theme: Theme,
  size = theme.size ?? 1,
  outline?: OutlineOpts,
  fillOverride?: string,
  strokeOverride?: string
) {
  const spec = SHAPES[shapeKey];
  const angle = Math.atan2(vel.y, vel.x) || 0;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(angle);

  const scale = spec.scale * size;
  ctx.scale(scale, scale);

  const baseLW = (theme.lineWidth ?? 0) / scale;

  // lock opacity for draw (avoid bleed from fade passes)
  const prevAlpha = ctx.globalAlpha;
  ctx.globalAlpha = 1;

  // optional dark “shadow outline” first
  if (outline && baseLW > 0) {
    const lw = baseLW * (outline.widthMul ?? 1.6);
    const oa = outline.alpha ?? 0.35;
    const prevStroke = ctx.strokeStyle;
    const prevLW = ctx.lineWidth;
    const prevShadowAlpha = ctx.globalAlpha;

    ctx.globalAlpha = oa;
    ctx.strokeStyle = outline.color;
    ctx.lineWidth   = lw;

    if (spec.type === 'circle') {
      const r = (spec.radius ?? 4);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.stroke();
    } else {
      const path = getPath(spec);
      ctx.stroke(path);
    }

    ctx.strokeStyle = prevStroke;
    ctx.lineWidth   = prevLW;
    ctx.globalAlpha = prevShadowAlpha;
  }

  // main styles (allow overrides)
  ctx.lineWidth   = baseLW;
  ctx.strokeStyle = strokeOverride ?? theme.stroke;
  ctx.fillStyle   = fillOverride   ?? theme.fill;

  // actual shape
  if (spec.type === 'circle') {
    const r = (spec.radius ?? 4);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    if (baseLW > 0) ctx.stroke();
  } else {
    const path = getPath(spec);
    ctx.fill(path);
    if (baseLW > 0) ctx.stroke(path);
  }

  // restore opacity and transform
  ctx.globalAlpha = prevAlpha;
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
const distSinceStamp: number[] = [];
const stampX: number[] = [];
const stampY: number[] = [];
const trailColors: string[] = []; // per-boid stable color
const trailStrokeColors: string[] = []; // optional separate stroke color if you want

function syncLastPositions(count: number, posX: number[], posY: number[]) {
  if (lastX.length !== count) {
    lastX.length = count;
    lastY.length = count;
    distSinceStamp.length = count;
    stampX.length = count;
    stampY.length = count;
    trailColors.length = count;
    trailStrokeColors.length = count;
    for (let i = 0; i < count; i++) {
      lastX[i] = posX[i];
      lastY[i] = posY[i];
      distSinceStamp[i] = 0;
      stampX[i] = posX[i];
      stampY[i] = posY[i];
      // one random hue per boid, reused every frame
      const c = randomColorHSL();
      trailColors[i] = c;
      trailStrokeColors[i] = c; // or make a darker variant if you prefer
    }
  }
}

/* ---------------- renderer: stamped trails with fade + real STEP ---------------- */
export default function renderFrame(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  _drawBoidIgnored: any,
  theme: Theme
) {
  const wCSS = canvas.clientWidth;
  const hCSS = canvas.clientHeight;

  ensureMainCanvas(canvas, wCSS, hCSS);
  ensureOffscreen(wCSS, hCSS);

  const posX = state.arrays.position.x;
  const posY = state.arrays.position.y;
  const velX = state.arrays.velocity.x;
  const velY = state.arrays.velocity.y;
  const count = posX.length;

  syncLastPositions(count, posX, posY);

  const tctx = trailCtx!;
  tctx.setTransform(1, 0, 0, 1, 0, 0);
  tctx.imageSmoothingEnabled = false;

  // params
  const STEP = Math.max(1, state.params.trailStep ?? 6);
  const MAX_BRIDGE = Math.max(wCSS, hCSS) * 0.45;
  const sizeCSS = (theme.size ?? 1) * state.params.size;
  const sizePX  = sizeCSS * dpr;
  const themePX: Theme = { ...theme, lineWidth: (theme.lineWidth ?? 0) * dpr };

  // Fade
  const tl = Math.min(1, Math.max(0, state.params.trailLength ?? 1));
  const erase = Math.pow(1 - tl, 2.2);
  if (erase > 0) {
    tctx.globalCompositeOperation = 'destination-out';
    tctx.fillStyle = `rgba(0,0,0,${erase})`;
    tctx.fillRect(0, 0, pxW, pxH);
    tctx.globalCompositeOperation = 'source-over';
  }

  // Stamp trails (orientation = segment direction)
  for (let i = 0; i < count; i++) {
    const x0 = lastX[i], y0 = lastY[i];
    const x1 = posX[i],  y1 = posY[i];
    const dx = x1 - x0,  dy = y1 - y0;
    const segDist = Math.hypot(dx, dy);

    if (!isFinite(segDist) || segDist > MAX_BRIDGE) {
      lastX[i] = x1; lastY[i] = y1;
      stampX[i] = x1; stampY[i] = y1;
      distSinceStamp[i] = 0;
      continue;
    }

    distSinceStamp[i] += segDist;

    const ux = segDist > 0 ? dx / segDist : 0;
    const uy = segDist > 0 ? dy / segDist : 0;

    while (distSinceStamp[i] >= STEP) {
      stampX[i] += ux * STEP;
      stampY[i] += uy * STEP;
      distSinceStamp[i] -= STEP;

      // use random colors ONLY for trails, never affect heads
  const fillOverride   = state.params.randomTrailColors ? trailColors[i] : themePX.fill;
  const strokeOverride = state.params.randomTrailColors ? trailColors[i] : themePX.stroke;

  drawBoid(
    tctx,
    { x: stampX[i] * dpr, y: stampY[i] * dpr },
    { x: dx, y: dy },
    theme.shape as ShapeKey,
    themePX,
    sizePX,
    { color: '#000', alpha: state.params.shadowOpacity, widthMul: state.params.shadowSize },
    fillOverride,
    strokeOverride
);
    }

    lastX[i] = x1; lastY[i] = y1;
  }

  // Present trails
ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.imageSmoothingEnabled = false;
ctx.globalCompositeOperation = 'source-over';
ctx.globalAlpha = 1;
ctx.drawImage(trailCanvas!, 0, 0);

// Always draw heads ABOVE trails (fully opaque)
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
ctx.globalCompositeOperation = 'source-over';
ctx.globalAlpha = 1;

const headSize = (theme.size ?? 1) * state.params.size;

for (let i = 0; i < count; i++) {
  const headFillOverride   = state.params.randomBoidColors ? trailColors[i]       : undefined;
  const headStrokeOverride = state.params.randomBoidColors ? trailStrokeColors[i] : undefined;

  drawBoid(
    ctx,
    { x: posX[i], y: posY[i] },
    { x: velX[i], y: velY[i] },        // real velocity for orientation
    theme.shape as ShapeKey,
    theme,
    headSize,
    undefined,                         // no shadow outline on heads (keep trails unique)
    headFillOverride,
    headStrokeOverride
  );
}

// Optional overlays on top of heads
if (state.params.visualizeAlignmentRadius || state.params.visualizeAlignmentToNeighbors) {
  const neighbors: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < count; i++) {
    gatherNeighbors(i, { x: posX, y: posY }, state.params.alignmentRadius, neighbors);
    alignmentRule({ x: posX[i], y: posY[i] }, neighbors, ctx);
    neighbors.length = 0;
  }
}
}