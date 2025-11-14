import './style.css'
import renderFrame, { drawBoid } from './render/boidRenderer';
import { init } from './system/init'
import update from './system/update'
import { state } from './state/state'
import syncBoidCount from './system/syncBoidCount'
import { Themes } from './geometry/themes'
import { buildUI } from './system/ui/domBuilder'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="main-content">
    <div class="aside">
      <h1>Boids Simulation</h1>
      <div class="controls" id="ui-panel"></div>
    </div>
    <div class="canvasWrapper">
      <canvas id="boidsCanvas"></canvas>
    </div>
  </div>
`;

const canvas = document.getElementById('boidsCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

state.fsm.state = 'running';

// actually init on the first frame lol
init(canvas, ctx);

window.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("ui-panel");
  if (!panel) {
    console.error("UI panel not found");
    return;
  }

  buildUI(panel);
});

let lastTs = performance.now();
function animate(ts: number) {
  const dtSec = Math.max(0, Math.min(0.05, (ts - lastTs) / 1000));
  lastTs = ts;

  syncBoidCount(canvas);
  update(dtSec, state.fsm.state, canvas);

  const theme = Themes[state.params.theme as keyof typeof Themes];
  renderFrame(ctx, canvas, drawBoid, theme);

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);