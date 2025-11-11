import { state, type FSMState } from "../state/state";

export default function update(
  appState: FSMState = state.fsm.state,
  canvas: HTMLCanvasElement,
  position: { x: number; y: number },
  direction: { x: number; y: number }) {

  if (appState !== "running") return;

  const { maxSpeed, wrapEdges } = state.params;
  const posX = state.arrays.position.x;
  const posY = state.arrays.position.y;
  const velX = state.arrays.velocity.x;
  const velY = state.arrays.velocity.y;

  const len = posX.length;
  for (let i = 0; i < len; i++) {
    const magnitude = Math.hypot(velX[i], velY[i]) || 1;
    posX[i] += maxSpeed * (velX[i] / magnitude);
    posY[i] += maxSpeed * (velY[i] / magnitude);

    if (wrapEdges) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (posX[i] > w) posX[i] = 0;
      if (posX[i] < 0) posX[i] = w;
      if (posY[i] > h) posY[i] = 0;
      if (posY[i] < 0) posY[i] = h;
    }
  }
}