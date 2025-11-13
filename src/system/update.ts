import { flockDrift, state, type FSMState } from "../state/state";
import { vec2lerp, vec2normalize } from "../utils/helpers";
import { randomSteer } from "../utils/randomSteer";
import alignmentSteer from "./rules/alignmentSteer";
import cohesionSteer from "./rules/cohesionSteer";
import separationSteer from "./rules/separationSteer";

export default function update(
  dtSec: number,
  appState: FSMState = state.fsm.state,
  canvas: HTMLCanvasElement
) {
  if (appState !== "running") return;

  const {
    wrapEdges,
    maxSpeed,
    turnRate,
    trailStep,
    cohesionRadius,

    speedBoostAtEdges,
    turnBoostAtEdges,
  } = state.params;

  const posX = state.arrays.position.x;
  const posY = state.arrays.position.y;
  const velX = state.arrays.velocity.x;
  const velY = state.arrays.velocity.y;

  const len = posX.length;
  if (len === 0) return;

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

  // flock drift (slowly changing angle)
  flockDrift.angle += (Math.random() - 0.5) * 0.03;

  // compute drift vector
  flockDrift.x = Math.cos(flockDrift.angle);
  flockDrift.y = Math.sin(flockDrift.angle);

  // scaled drift influence
  const DRIFT_STRENGTH = state.params.flockDriftStrength ?? 0.1; 

  // radius used for "edge factor" mapping
  const cohRadius = cohesionRadius ?? Math.min(canvas.clientWidth, canvas.clientHeight) * 0.5;
  const speedBoost = speedBoostAtEdges ?? 0;
  const turnBoost  = turnBoostAtEdges  ?? 0;

  for (let i = 0; i < len; i++) {
    // 1) Steering forces
    const alignment = alignmentSteer(i, state.arrays);
    const cohesion = cohesionSteer(i, state.arrays);
    const separation = separationSteer(i, state.arrays);
    const wander = randomSteer(0.1 * state.params.maxWanderForce);
    const steer = {
    x: alignment.x + cohesion.x + separation.x + wander.x + flockDrift.x * DRIFT_STRENGTH,
    y: alignment.y + cohesion.y + separation.y + wander.y + flockDrift.y * DRIFT_STRENGTH,
    };

      // Compute flock center for edge biasing
    let centerX = 0;
    let centerY = 0;
    for (let i = 0; i < len; i++) {
      centerX += posX[i];
      centerY += posY[i];
    }
    centerX /= len;
    centerY /= len;

    // Edge biasing
    let speedMul = 1;
    let turnMul  = 1;

    if (cohRadius > 0 && (speedBoost !== 0 || turnBoost !== 0)) {
      const dxC = centerX - posX[i];
      const dyC = centerY - posY[i];
      const distToCenter = Math.hypot(dxC, dyC);

      const edgeFactor = Math.min(1, distToCenter / cohRadius); // 0 at center, →1 at edge

      speedMul = 1 + edgeFactor * speedBoost;
      turnMul  = 1 + edgeFactor * turnBoost;
    }

    // 2) New candidate direction (unchanged)
    const dirOld = vec2normalize({ x: velX[i], y: velY[i] });
    const dirNew = vec2normalize({ x: velX[i] + steer.x, y: velY[i] + steer.y });

    // 3) Exponential smoothing of heading (inertia),
    //    with slight extra turn for edge boids
    const turnFactor = Math.min(1, t * turnMul);
    const blended = vec2normalize(vec2lerp(dirOld, dirNew, turnFactor));

    // 4) Set velocity at derived speed, with slight speed boost at edges
    const boidSpeed = derivedMaxSpeed * speedMul;
    velX[i] = blended.x * boidSpeed;
    velY[i] = blended.y * boidSpeed;

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
