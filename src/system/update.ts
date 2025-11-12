import { state, type FSMState } from "../state/state";
import { vec2lerp, vec2normalize } from "../utils/helpers";
import alignmentSteer from "./rules/alignmentSteer";
import cohesionSteer from "./rules/cohesionSteer"

export default function update(
  dtSec: number,
  appState: FSMState = state.fsm.state,
  canvas: HTMLCanvasElement
) {
  if (appState !== "running") return;

  const { wrapEdges, maxSpeed, turnRate, trailStep } = state.params;
  const posX = state.arrays.position.x;
  const posY = state.arrays.position.y;
  const velX = state.arrays.velocity.x;
  const velY = state.arrays.velocity.y;

  // -----------------------------------------
  // Auto-adjust maxSpeed relative to trailStep
  // -----------------------------------------
  // Define your baseline once (constant reference)
  const BASE_STEP = 2;
  const BASE_SPEED = maxSpeed;

  // Compute derived maxSpeed so speed/step ratio stays stable
  const step = Math.max(1, trailStep ?? BASE_STEP);
  const derivedMaxSpeed = BASE_SPEED - (step / BASE_STEP);

  // Convert “turn rate per second” into a per-frame blend [0..1]
  const t = 1 - Math.exp(-turnRate * dtSec);

  const len = posX.length;
  for (let i = 0; i < len; i++) {
    // 1) Steering forces
    const alignment = alignmentSteer(i, state.arrays, state.params);
    const cohesion = cohesionSteer(i, state.arrays, state.params);

    const steer = {
      x: alignment.x + cohesion.x,
      y: alignment.y + cohesion.y,
    };

    // 2) New candidate direction
    const dirOld = vec2normalize({ x: velX[i], y: velY[i] });
    const dirNew = vec2normalize({ x: velX[i] + steer.x, y: velY[i] + steer.y });

    // 3) Exponential smoothing of heading (inertia)
    const blended = vec2normalize(vec2lerp(dirOld, dirNew, t));

    // 4) Set velocity at derived speed (px/s)
    velX[i] = blended.x * derivedMaxSpeed;
    velY[i] = blended.y * derivedMaxSpeed;

    // 5) Integrate position with dt (px = (px/s) * s)
    posX[i] += velX[i] * dtSec;
    posY[i] += velY[i] * dtSec;

    // 6) Wrap edges
    if (wrapEdges) {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (posX[i] > w) posX[i] = 0; if (posX[i] < 0) posX[i] = w;
      if (posY[i] > h) posY[i] = 0; if (posY[i] < 0) posY[i] = h;
    }
  }
}