import './style.css'

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

