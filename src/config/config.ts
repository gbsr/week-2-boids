import type { Themes } from "../geometry/themes"

export const canvasConfig = {
  backgroundColor: '#000000',
  border: '1px solid #333333',
  // boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
}

export const boidConfig = {
  // simulation
  boidCount: 685,
  perceptionRadius: 20,
 
  // weights
  separationWeight: 1.25,
  alignmentWeight: 1,
  cohesionWeight: 0.72,

  // movement
  maxSpeed: 120,
  maxForce: 140,
  maxWanderForce: 1800,
  wrapEdges: true,
  turnRate: 7,
  
  // looks
  size: 0.1,
  trailLength: 0.55,
  trailAlpha: 1,
  trailStep: 0,
  shadowSize: 4,
  shadowOpacity: 1,
  randomBoidColors: false,
  randomTrailColors: false,
  debugSampleStride: 4,
  maxDebugNeighbors: 2000,

  // Visual theme.
  // available themes: 
  // 'triangle', 
  // 'circle', 
  // 'diamond', 
  // 'cross', 
  // 'arrow', 
  // 'kite', 
  // 'chevron', 
  // 'leaf', 
  // 'particle'
  // 'dot'
  theme: 'dot' as keyof typeof Themes,

  // perception viz
  visualizePerception: false,
  perceptionColor: '#00ff00',
  perceptionLineWidth: 1,
  perceptionAlpha: 0.2,

  // cohesion viz
  visualizeCohesionRadius: false,
  visualizeCohesionToNeighbors: false,
  cohesionRadius: 320,
  cohesionRadiusColor: '#ff00ff',
  cohesionRadiusLineWidth: 0.1,
  cohesionRadiusAlpha: 0.0005,

  // alignment viz
  visualizeAlignmentRadius: false,
  visualizeAlignmentToNeighbors: false,
  alignmentRadius: 20,
  alignmentRadiusColor: '7fe29c',
  alignmentRadiusLineWidth: 1,
  alignmentRadiusAlpha: 0.0025,
  
  // separation viz
  visualizeSeparationRadius: false,
  visualizeSeparationToNeighbors: true,
  separationRadius: 7,
  separationRadiusColor: '#ff0000',
  separationRadiusLineWidth: 2,
  separationRadiusAlpha: 0.005,
}

