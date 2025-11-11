import './style.css'
import renderFrame, { drawBoid } from './render/boidRenderer';
import { Themes } from './geometry/themes';
import { init } from './system/init'
import update from './system/update'
import { state } from './state/state'
import type { Theme } from './interface/boid'
import syncBoidCount from './system/syncBoidCount'


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
const position = { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 };
const direction = { x: 1, y: 0 };
const theme = Themes.arrow as Theme;

state.fsm.state = 'running';

function animate() {
  requestAnimationFrame(animate);
  syncBoidCount(canvas);
  update(state.fsm.state, canvas, position, direction);
  renderFrame(ctx, canvas, drawBoid, position, direction, theme);
}

init(canvas, ctx);
animate();
