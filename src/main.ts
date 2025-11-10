import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div class="main-content">
      <div class="canvasWrapper">
        <div class="controls"></div>
        <canvas id="boidsCanvas"></canvas>
      </div>
    </div>
  </div>
`

