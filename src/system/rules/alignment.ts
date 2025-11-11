import { state } from "../../state/state";
import { hexToRgba } from "../../utils/helpers";

export default function alignmentRule(
  boid: { position: { x: number; y: number } },
  neighbors: Array<{ position: { x: number; y: number } }>,
  ctx: CanvasRenderingContext2D
) {
  const param = state.params;
  if (!param.visualizeAlignmentRadius) return;

  const fillColor = hexToRgba(param.alignmentRadiusColor, param.alignmentRadiusAlpha);

  ctx.save();
  ctx.globalAlpha = param.alignmentRadiusAlpha;
  ctx.strokeStyle = param.alignmentRadiusColor;
  ctx.fillStyle = fillColor;
  ctx.lineWidth = param.alignmentRadiusLineWidth;
  ctx.beginPath();
  ctx.arc(boid.position.x, boid.position.y, param.alignmentRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
  ctx.restore();

  // optional neighbor lines
  for (const n of neighbors) {
    ctx.save();
    ctx.globalAlpha = param.alignmentRadiusAlpha * 0.5;
    ctx.strokeStyle = param.alignmentRadiusColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(boid.position.x, boid.position.y);
    ctx.lineTo(n.position.x, n.position.y);
    ctx.stroke();
    ctx.restore();
  }
}