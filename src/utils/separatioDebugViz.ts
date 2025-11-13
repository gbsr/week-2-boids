import { state } from "../state/state"
import { hexToRgba } from "./helpers";

export default function separationDebugViz(
  boidPos: { x: number; y: number },
  neighbors: Array<{ x: number; y: number }>,
  ctx: CanvasRenderingContext2D
) {
  if (!state.params.visualizeSeparationRadius && !state.params.visualizeSeparationToNeighbors) return;

  // circle
  if (state.params.visualizeSeparationRadius) {
    ctx.beginPath();
    ctx.arc(boidPos.x, boidPos.y, state.params.separationRadius, 0, Math.PI * 2);
    ctx.strokeStyle = hexToRgba(state.params.separationRadiusColor, state.params.separationRadiusAlpha * 3);
    ctx.fillStyle = hexToRgba(state.params.separationRadiusColor, state.params.separationRadiusAlpha * 0.2);
    ctx.lineWidth = state.params.separationRadiusLineWidth;
    ctx.fill();
    ctx.stroke();
  }

  // lines to neighbors
  if (state.params.visualizeSeparationToNeighbors) {
    neighbors.forEach(neighbor => {
      ctx.beginPath();
      ctx.moveTo(boidPos.x, boidPos.y);
      ctx.lineTo(neighbor.x, neighbor.y);
      ctx.strokeStyle = hexToRgba(state.params.separationRadiusColor, state.params.separationRadiusAlpha * 5);
      ctx.lineWidth = state.params.separationRadiusLineWidth;
      ctx.stroke();
    });
  }
}