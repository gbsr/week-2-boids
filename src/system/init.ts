import { state } from '../state/state';
import { boidConfig, canvasConfig } from '../config/config';

export function init(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {

  // Apply canvas visual config
  Object.assign(canvas.style, {
    backgroundColor: canvasConfig.backgroundColor,
    border: canvasConfig.border,
    // boxShadow: canvasConfig.boxShadow,
  });

  // Init state.params from boidConfig
  const param = state.params;
  param.boidCount    = boidConfig.boidCount;
  param.perception   = boidConfig.perceptionRadius;
  param.wSeparation  = boidConfig.separationWeight;
  param.wAlignment   = boidConfig.alignmentWeight;
  param.wCohesion    = boidConfig.cohesionWeight;
  param.maxSpeed     = boidConfig.maxSpeed;
  param.maxForce     = boidConfig.maxForce;
  param.wrapEdges    = boidConfig.wrapEdges;
  param.needsReseed  = true;  // force reseed at startup
  param.theme        = boidConfig.theme;
  param.turnRate    = boidConfig.turnRate;
  param.size        = boidConfig.size;

  param.visualizePerception = boidConfig.visualizePerception;
  param.perceptionColor = boidConfig.perceptionColor;
  param.perceptionLineWidth = boidConfig.perceptionLineWidth;
  param.perceptionAlpha = boidConfig.perceptionAlpha;
  
  param.visualizeCohesionRadius = boidConfig.visualizeCohesionRadius;
  param.cohesionRadius = boidConfig.cohesionRadius;
  param.cohesionRadiusColor = boidConfig.cohesionRadiusColor;
  param.cohesionRadiusLineWidth = boidConfig.cohesionRadiusLineWidth;
  param.cohesionRadiusAlpha = boidConfig.cohesionRadiusAlpha;

  param.visualizeAlignmentRadius = boidConfig.visualizeAlignmentRadius;
  param.alignmentRadius = boidConfig.alignmentRadius;
  param.alignmentRadiusColor = boidConfig.alignmentRadiusColor;
  param.alignmentRadiusLineWidth = boidConfig.alignmentRadiusLineWidth;
  param.alignmentRadiusAlpha = boidConfig.alignmentRadiusAlpha;

  param.visualizeSeparationRadius = boidConfig.visualizeSeparationRadius;
  param.separationRadius = boidConfig.separationRadius;
  param.separationRadiusColor = boidConfig.separationRadiusColor;
  param.separationRadiusLineWidth = boidConfig.separationRadiusLineWidth;
  param.separationRadiusAlpha = boidConfig.separationRadiusAlpha;

 function fitCanvas() {
   const dpr = window.devicePixelRatio || 1;
   const rect = canvas.getBoundingClientRect();
   canvas.width = Math.max(1, Math.floor(rect.width * dpr));
   canvas.height = Math.max(1, Math.floor(rect.height * dpr));
   ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
 }
 
 window.addEventListener('resize', () => {
   fitCanvas();
 });
 
  // Initial canvas fit
  fitCanvas();

}