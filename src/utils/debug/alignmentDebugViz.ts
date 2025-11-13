// alignmentRule.ts
import { state } from "../../state/state";
import { hexToRgba } from "../helpers";

export default function alignmentDebugViz(
  boidPos: { x: number; y: number },
  neighbors: Array<{ x: number; y: number }>,
  ctx: CanvasRenderingContext2D
) {
  if (!state.params.visualizeAlignmentRadius && !state.params.visualizeAlignmentToNeighbors) return;
  
  // circle
  if (state.params.visualizeAlignmentRadius) {
    ctx.beginPath();
    ctx.arc(boidPos.x, boidPos.y, state.params.alignmentRadius, 0, Math.PI * 2);
    ctx.strokeStyle = hexToRgba(state.params.alignmentRadiusColor, state.params.alignmentRadiusAlpha * 4);
    ctx.fillStyle = hexToRgba(
      state.params.alignmentRadiusColor, state.params.alignmentRadiusAlpha * 1.2);
    ctx.lineWidth = state.params.alignmentRadiusLineWidth;
    ctx.fill()
    ctx.stroke();
  }

  // lines to neighbors
  if (state.params.visualizeAlignmentToNeighbors) {
    neighbors.forEach(neighbor => {
      ctx.beginPath();
      ctx.moveTo(boidPos.x, boidPos.y);
      ctx.lineTo(neighbor.x, neighbor.y);
      ctx.strokeStyle = hexToRgba(state.params.alignmentRadiusColor, state.params.alignmentRadiusAlpha * 4);
      ctx.lineWidth = state.params.alignmentRadiusLineWidth;
      ctx.stroke();
    });
  }
}