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

    separationWeight,
    alignmentWeight,
    cohesionWeight,

    separationRadius,
    alignmentRadius,

    maxWanderForce,

    boidCount,
  } = state.params;

  const posX = state.arrays.position.x;
  const posY = state.arrays.position.y;
  const velX = state.arrays.velocity.x;
  const velY = state.arrays.velocity.y;

  // --------------------------------
  // Ensure boid array length matches
  // the desired boidCount param
  // --------------------------------
  let len = posX.length;
  const desiredCount = boidCount ?? len;

  if (desiredCount > len) {
    // Add new boids
    const w = canvas.clientWidth || canvas.width;
    const h = canvas.clientHeight || canvas.height;

    for (let i = len; i < desiredCount; i++) {
      // spawn at random position within canvas
      posX[i] = Math.random() * w;
      posY[i] = Math.random() * h;

      // start with zero velocity; rules + wander will kick in
      velX[i] = 0;
      velY[i] = 0;
    }
  } else if (desiredCount < len) {
    // Remove boids from the end
    posX.length = desiredCount;
    posY.length = desiredCount;
    velX.length = desiredCount;
    velY.length = desiredCount;
  }

  // update len after adjustments
  len = posX.length;
  if (len === 0) return;

  // ================================
  // TURN RATE (per-frame smoothing)
  // ================================
  // turnRate ≈ "how fast we rotate towards new heading per second"
  const t = 1 - Math.exp(-turnRate * dtSec);

  // ================================
  // FLOCK DRIFT (low-frequency noise)
  // ================================
  flockDrift.angle += (Math.random() - 0.5) * 0.2;
  flockDrift.x = Math.cos(flockDrift.angle);
  flockDrift.y = Math.sin(flockDrift.angle);

  const DRIFT_STRENGTH = state.params.flockDriftStrength ?? 0.1;

  // ================================
  // EDGE BOOST — PRECOMPUTED VALUES
  // ================================
  const cohRadius =
    cohesionRadius ??
    Math.min(canvas.clientWidth, canvas.clientHeight) * 0.5;

  const speedBoost = speedBoostAtEdges ?? 0;
  const turnBoost = turnBoostAtEdges ?? 0;

  // ================================
  // RULE RADIUS → [0..1] FACTORS
  // (interpret sliders as 0..380)
  // ================================
  const MAX_RULE_RADIUS = 380; // matches your slider.max

  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

  const sepRadiusFactor = clamp01((separationRadius ?? 0) / MAX_RULE_RADIUS);
  const alignRadiusFactor = clamp01((alignmentRadius ?? 0) / MAX_RULE_RADIUS);
  const cohRadiusFactor = clamp01((cohesionRadius ?? 0) / MAX_RULE_RADIUS);

  // ================================
  // SPEED MAPPING (slider → px/sec)
  // ================================
  const canvasMinDim = Math.min(canvas.clientWidth, canvas.clientHeight);
  const MAX_SPEED_SLIDER = 50;
  const speedNorm = clamp01((maxSpeed / MAX_SPEED_SLIDER) * 0.2);
  // At max slider, baseSpeed ≈ 0.5 * minDim px/sec
  // -> crosses the short side in about 2 seconds.
  const baseSpeed = speedNorm * canvasMinDim * 0.5;

  // ================================
  // WANDER SCALE (0..50 → 0..baseSpeed)
  // ================================
  const WANDER_MAX_SLIDER = 50;
  const wanderFactor = clamp01((maxWanderForce ?? 0) / WANDER_MAX_SLIDER);
  const wanderMagnitude = wanderFactor * baseSpeed;

  // ================================
  // FLOCK CENTER (computed once)
  // ================================
  let centerX = 0;
  let centerY = 0;
  for (let j = 0; j < len; j++) {
    centerX += posX[j];
    centerY += posY[j];
  }
  centerX /= len;
  centerY /= len;

  // ================================
  // BOUNDARY AVOIDANCE
  // ================================
  const boundaryMargin = state.params.boundaryMargin ?? 200;
  const boundaryStrength = state.params.boundaryStrength ?? 15;

  // ================================
  // MAIN PER-BOID LOOP
  // ================================
  for (let i = 0; i < len; i++) {
    // ---------------------------------------
    // 1) Compute steering components
    // ---------------------------------------
    const alignment = alignmentSteer(i, state.arrays);
    const cohesion = cohesionSteer(i, state.arrays);
    const separation = separationSteer(i, state.arrays);
    const wander = randomSteer(wanderMagnitude);

    const steer = {
      x:
        separation.x * separationWeight * sepRadiusFactor +
        alignment.x * alignmentWeight * alignRadiusFactor +
        cohesion.x * cohesionWeight * cohRadiusFactor +
        wander.x +
        flockDrift.x * DRIFT_STRENGTH,
      y:
        separation.y * separationWeight * sepRadiusFactor +
        alignment.y * alignmentWeight * alignRadiusFactor +
        cohesion.y * cohesionWeight * cohRadiusFactor +
        wander.y +
        flockDrift.y * DRIFT_STRENGTH,
    };

    // ---------------------------------------
    // Boundary avoidance
    // ---------------------------------------
    if (!wrapEdges) {
      let bx = 0;
      let by = 0;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      const x = posX[i];
      const y = posY[i];

      if (x < boundaryMargin)
        bx += (boundaryMargin - x) / boundaryMargin;
      else if (x > w - boundaryMargin)
        bx -= (x - (w - boundaryMargin)) / boundaryMargin;

      if (y < boundaryMargin)
        by += (boundaryMargin - y) / boundaryMargin;
      else if (y > h - boundaryMargin)
        by -= (y - (h - boundaryMargin)) / boundaryMargin;

      steer.x += bx * boundaryStrength;
      steer.y += by * boundaryStrength;
    }

    // ---------------------------------------
    // 2) Edge bias (speed + turn multipliers)
    // ---------------------------------------
    let speedMul = 1;
    let turnMul = 1;

    if (cohRadius > 0 && (speedBoost !== 0 || turnBoost !== 0)) {
      const dxC = centerX - posX[i];
      const dyC = centerY - posY[i];
      const distToCenter = Math.hypot(dxC, dyC);
      const edgeFactor = Math.min(1, distToCenter / cohRadius); // 0→center, 1→edge

      speedMul = 1 + edgeFactor * speedBoost;
      turnMul = 1 + edgeFactor * turnBoost;
    }

    // ---------------------------------------
    // 3) Blend old→new heading
    // ---------------------------------------
    const dirOld = vec2normalize({ x: velX[i], y: velY[i] });
    const dirNew = vec2normalize({
      x: velX[i] + steer.x,
      y: velY[i] + steer.y,
    });

    const turnFactor = Math.min(1, t * turnMul);
    const blended = vec2normalize(vec2lerp(dirOld, dirNew, turnFactor));

    // ---------------------------------------
    // 4) Set velocity at chosen speed
    // ---------------------------------------
    const boidSpeed = baseSpeed * speedMul;
    velX[i] = blended.x * boidSpeed;
    velY[i] = blended.y * boidSpeed;

    // ---------------------------------------
    // 5) Integrate position
    // ---------------------------------------
    posX[i] += velX[i] * dtSec;
    posY[i] += velY[i] * dtSec;

    // ---------------------------------------
    // 6) Wrapping or clamping
    // ---------------------------------------
    if (wrapEdges) {
      const w = canvas.clientWidth,
        h = canvas.clientHeight;

      if (posX[i] > w) posX[i] = 0;
      if (posX[i] < 0) posX[i] = w;
      if (posY[i] > h) posY[i] = 0;
      if (posY[i] < 0) posY[i] = h;
    } else {
      const w = canvas.clientWidth,
        h = canvas.clientHeight;

      if (posX[i] < 0) posX[i] = 0;
      if (posX[i] > w) posX[i] = w;
      if (posY[i] < 0) posY[i] = 0;
      if (posY[i] > h) posY[i] = h;
    }
  }
}