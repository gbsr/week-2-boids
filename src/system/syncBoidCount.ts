import { state } from "../state/state"

export default function syncBoidCount(canvas: HTMLCanvasElement) {
  if (!state.params.needsReseed) return;

  const target = state.params.boidCount;
  const posX = state.arrays.position.x;
  const posY = state.arrays.position.y;
  const velX = state.arrays.velocity.x;
  const velY = state.arrays.velocity.y;

  const curr = posX.length;

  if (target < curr) {
    // Truncate
    posX.length = target; posY.length = target;
    velX.length = target; velY.length = target;
  } else if (target > curr) {
    // Append new boids
    const w = canvas.clientWidth, h = canvas.clientHeight;
    for (let i = curr; i < target; i++) {
      // position: anywhere in view
      posX.push(Math.random() * w);
      posY.push(Math.random() * h);

      // velocity: random unit direction (speed handled in update)
      const a = Math.random() * Math.PI * 2;
      velX.push(Math.cos(a));
      velY.push(Math.sin(a));
    }
  }

  state.params.needsReseed = false;
}