// alignmentRule.ts
import { state } from "../../state/state";
import { hexToRgba } from "../../utils/helpers";

export default function alignmentRule(
  boidPos: { x: number; y: number },
  neighbors: Array<{ x: number; y: number }>,
  ctx: CanvasRenderingContext2D
) {
  const param = state.params;
  if (!param.visualizeAlignmentRadius && !param.visualizeAlignmentToNeighbors) return;

  // circle
  if (param.visualizeAlignmentRadius) {
    // todo: should probably just make a helper for this insteafd eh
    ctx.save();
    ctx.strokeStyle = hexToRgba(param.alignmentRadiusColor, param.alignmentRadiusAlpha);
    ctx.lineWidth = param.alignmentRadiusLineWidth;
    ctx.beginPath();
    ctx.arc(boidPos.x, boidPos.y, param.alignmentRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = hexToRgba(param.alignmentRadiusColor, param.alignmentRadiusAlpha * 0.25);
    ctx.fill();
    ctx.restore();
  }

  // draw lines to neighbors
  if (param.visualizeAlignmentToNeighbors) {
    ctx.save();
    ctx.strokeStyle = hexToRgba(param.alignmentRadiusColor, param.alignmentRadiusAlpha * 0.85);
    ctx.lineWidth = 0.35;
    for (const n of neighbors) {
  const dx = n.x - boidPos.x;
  const dy = n.y - boidPos.y;
  const dist = Math.hypot(dx, dy) || 1;

  // scale direction to match radius length
  const scale = Math.min(1, param.alignmentRadius / dist);
  const endX = boidPos.x + dx * scale;
  const endY = boidPos.y + dy * scale;

  ctx.beginPath();
  ctx.moveTo(boidPos.x, boidPos.y);
  ctx.lineTo(endX, endY);
  ctx.stroke();
    }
  }
}