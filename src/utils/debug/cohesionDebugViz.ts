import { state } from "../../state/state"
import { hexToRgba } from "../helpers";

export default function cohesionDebugViz(
  boidPos: { x: number; y: number },
  neighbors: Array<{ x: number; y: number }>,
  ctx: CanvasRenderingContext2D
) {
  if (!state.params.visualizeCohesionRadius && !state.params.visualizeCohesionToNeighbors) return;

  // circle
  if (state.params.visualizeCohesionRadius) {
    ctx.beginPath();
    ctx.arc(boidPos.x, boidPos.y, state.params.cohesionRadius, 0, Math.PI * 2);
    ctx.strokeStyle = hexToRgba(state.params.cohesionRadiusColor, state.params.cohesionRadiusAlpha * 3);
    ctx.fillStyle = hexToRgba(
      state.params.cohesionRadiusColor, state.params.cohesionRadiusAlpha * 0.65);
    ctx.lineWidth = state.params.cohesionRadiusLineWidth;
    ctx.fill();
    ctx.stroke();
  }

  // lines to neighbors
  if (state.params.visualizeCohesionToNeighbors) {
    neighbors.forEach(neighbor => {
      ctx.beginPath();
      ctx.moveTo(boidPos.x, boidPos.y);
      ctx.lineTo(neighbor.x, neighbor.y);
      ctx.strokeStyle = hexToRgba(state.params.cohesionRadiusColor, state.params.cohesionRadiusAlpha * 5);
      ctx.lineWidth = state.params.cohesionRadiusLineWidth;
      ctx.stroke();
    });
  }
}