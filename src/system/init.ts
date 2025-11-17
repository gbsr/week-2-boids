// @ts-nocheck
// types are correct, because dynamically built from paramDefs

import { state } from '../state/state';
import { boidConfig, canvasConfig } from '../config/config';
import { getMousePos } from '../utils/helpers';

export function init(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {

  // Apply canvas visual config
  Object.assign(canvas.style, {
    backgroundColor: canvasConfig.backgroundColor,
    border: canvasConfig.border,
    // boxShadow: canvasConfig.boxShadow,
  });

  // -------------------------------------------
  // Init state.params from paramDefaults + boidConfig
  // -------------------------------------------
  const param = state.params;

  // 1) Apply boidConfig only for keys that exist in params
  for (const key of Object.keys(boidConfig) as (keyof typeof boidConfig)[]) {
    if (key in param) {
      (param as any)[key] = boidConfig[key];
    }
  }

  // 2) Backwards-compat aliases (if any old code still reads these)
  //    (Won't hurt if they’re unused.)
  (param as any).perception    ??= (param as any).perceptionRadius;
  (param as any).wSeparation   ??= (param as any).separationWeight;
  (param as any).wAlignment    ??= (param as any).alignmentWeight;
  (param as any).wCohesion     ??= (param as any).cohesionWeight;

  // 3) Force reseed / trail reset for new params
  param.needsReseed = true;
  state.needsBoidReinit = true;
  state.needsTrailReset = true;

  function fitCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  const newW = Math.max(1, Math.floor(rect.width * dpr));
  const newH = Math.max(1, Math.floor(rect.height * dpr));

  const oldW = state.viewport.width;
  const oldH = state.viewport.height;

  // resize actual canvas
  canvas.width = newW;
  canvas.height = newH;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // scale positions to new canvas size
  const sx = newW / oldW;
  const sy = newH / oldH;

  const posX = state.arrays.position.x;
  const posY = state.arrays.position.y;

  for (let i = 0; i < posX.length; i++) {
    posX[i] *= sx;
    posY[i] *= sy;
  }

  // save new viewport size
  state.viewport.width = newW;
  state.viewport.height = newH;

  // required: trail reset (otherwise artifacts)
  state.needsTrailReset = true;
}

  window.addEventListener('resize', () => {
    fitCanvas();
  });

  function attachMouseHandlers(canvas: HTMLCanvasElement) {
    canvas.addEventListener("pointermove", (evt) => {
      const { x, y } = getMousePos(canvas, evt);
      state.mouse.x = x;
      state.mouse.y = y;
      state.mouse.inside = true;
    });

    canvas.addEventListener("pointerenter", (evt) => {
      const { x, y } = getMousePos(canvas, evt);
      state.mouse.x = x;
      state.mouse.y = y;
      state.mouse.inside = true;
    });

    canvas.addEventListener("pointerleave", () => {
      state.mouse.inside = false;
    });
  }

  // Initial canvas fit + mouse handlers
  fitCanvas();
  attachMouseHandlers(canvas);
}