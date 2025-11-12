import type { ShapeSpec, ShapeKey } from '../geometry/boidShapes';
import { SHAPES } from '../geometry/boidShapes';
import type { Theme, Vec2 } from '../interface/boid';
import { state } from '../state/state';
import alignmentRule from '../utils/alignmentDebugViz';
import { gatherNeighbors } from '../utils/neighbor';

// ---------- path cache ----------
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

// ---------- boid drawing (unchanged) ----------
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

  ctx.lineWidth = theme.lineWidth / scale;
  ctx.strokeStyle = theme.stroke;
  ctx.fillStyle = theme.fill;

  if (spec.type === 'circle') {
    const r = spec.radius ?? 4;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
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

// ---------- offscreens for stamped trails ----------
let headCanvas: HTMLCanvasElement | null = null;
let headCtx: CanvasRenderingContext2D | null = null;

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

function ensureOffscreens(wCSS: number, hCSS: number) {
  const needW = Math.max(1, Math.floor(wCSS * dpr));
  const needH = Math.max(1, Math.floor(hCSS * dpr));

  if (!headCanvas) {
    headCanvas = document.createElement('canvas');
    headCtx = headCanvas.getContext('2d')!;
  }
  if (!trailCanvas) {
    trailCanvas = document.createElement('canvas');
    trailCtx = trailCanvas.getContext('2d')!;
  }

  if (pxW !== needW || pxH !== needH) {
    pxW = needW; pxH = needH;
    headCanvas!.width = trailCanvas!.width = pxW;
    headCanvas!.height = trailCanvas!.height = pxH;
  }
}

// ---------- renderer: stamped (infinite) trails, DPR-correct ----------
export default function renderFrame(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  drawBoidFn: any,           // kept for your signature
  theme: Theme
) {
  const wCSS = canvas.clientWidth;
  const hCSS = canvas.clientHeight;

  // 1) ensure main canvas bitmap matches CSS×DPR, and offscreens too
  ensureMainCanvas(canvas, wCSS, hCSS);
  ensureOffscreens(wCSS, hCSS);

  const posX = state.arrays.position.x;
  const posY = state.arrays.position.y;
  const velX = state.arrays.velocity.x;
  const velY = state.arrays.velocity.y;
  const count = posX.length;

  // 2) HEADS: clear head buffer (per frame), draw current boids in CSS space
  const hctx = headCtx!;
  hctx.setTransform(dpr, 0, 0, dpr, 0, 0);        // CSS coords on headCanvas
  hctx.clearRect(0, 0, wCSS, hCSS);
  hctx.imageSmoothingEnabled = false;

  const sizeCSS = (theme.size ?? 1) * state.params.size;

  for (let i = 0; i < count; i++) {
    drawBoid(
      hctx,
      { x: posX[i], y: posY[i] },
      { x: velX[i], y: velY[i] },
      theme.shape as ShapeKey,
      theme,
      sizeCSS
    );
  }

  // 3) TRAILS: accumulate this frame's heads into the persistent trail buffer (no fade)
  const tctx = trailCtx!;
  tctx.setTransform(1, 0, 0, 1, 0, 0);            // pixel coords on trailCanvas
  tctx.globalCompositeOperation = 'source-over';
  tctx.drawImage(headCanvas!, 0, 0);              // 1:1 pixel copy

  // 4) PRESENT: blit trail buffer to the onscreen canvas (pixel space, 1:1)
  ctx.setTransform(1, 0, 0, 1, 0, 0);             // pixel coords
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(trailCanvas!, 0, 0);              // exact pixels, no scaling

  // 5) Overlays / live heads on top (CSS space), optional
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);         // switch to CSS coords

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