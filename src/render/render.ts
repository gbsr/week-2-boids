
export default function render(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, drawBoid: any, center: { x: number; y: number }, vel: { x: number; y: number }, theme: { fill: string; stroke: string; lineWidth: number; }) {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  // Try different shapes: 'triangle' | 'circle' | 'diamond'
  drawBoid(ctx, center, vel, 'triangle', theme, 1);
}
