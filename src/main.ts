import './style.css'
import renderFrame, { drawBoid } from './render/boidRenderer';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="main-content">
    <div class="aside">
      <h1>Boids Simulation</h1>
      <div class="controls"></div>
    </div>
      <div class="canvasWrapper">
        <canvas id="boidsCanvas"></canvas>
      </div>
    </div>
`

const canvas = document.getElementById('boidsCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Adjust canvas size to fit its displayed size
function fitCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

fitCanvas();
window.addEventListener('resize', () => {
  fitCanvas();
  renderFrame(ctx, canvas, drawBoid, center, vel, theme);
});

// One static boid at center, pointing right
const center = { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 };
const vel = { x: 1, y: 0 }; // heading along +X

const theme = {
  fill: '#f5f5f7',
  stroke: '#5ec8ff',
  lineWidth: 5,
};

function update() {
  center.x += vel.x;
  center.y += vel.y;

  // Wrap around edges
  if (center.x > canvas.clientWidth) center.x = 0;
  if (center.x < 0) center.x = canvas.clientWidth;
  if (center.y > canvas.clientHeight) center.y = 0;
  if (center.y < 0) center.y = canvas.clientHeight;
}

function animate() {
  requestAnimationFrame(animate);
  update();
  renderFrame(ctx, canvas, drawBoid, center, vel, theme);
}

animate();