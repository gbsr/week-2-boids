import type { Themes } from "../geometry/themes"

export const canvasConfig = {
  backgroundColor: '#000000',
  border: '1px solid #333333',
  // boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
}

export const boidConfig = {
  // simulation
  boidCount: 20,
  perceptionRadius: 20,
 
  // weights
  separationWeight: 1.5,
  alignmentWeight: 0.5,
  cohesionWeight: 0.8,

  // movement
  maxSpeed: 100,
  maxForce: 10000,
  wrapEdges: true,
  turnRate: 2.85,
  
  // looks
  size: 1,
  trailLength: 0.4,
  trailAlpha: 0,
  trailStep: 1,
  shadowSize: 2.1,
  shadowOpacity: 0.1,
  randomBoidColors: false,
  randomTrailColors: false,

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
  theme: 'cross' as keyof typeof Themes,

  // perception viz
  visualizePerception: false,
  perceptionColor: '#00ff00',
  perceptionLineWidth: 1,
  perceptionAlpha: 0.2,

  // cohesion viz
  visualizeCohesionRadius: true,
  visualizeCohesionToNeighbors: false,
  cohesionRadius: 150,
  cohesionRadiusColor: '#ff00ff',
  cohesionRadiusLineWidth: 1,
  cohesionRadiusAlpha: 0.05,

  // alignment viz
  visualizeAlignmentRadius: false,
  visualizeAlignmentToNeighbors: false,
  alignmentRadius: 90,
  alignmentRadiusColor: '7fe29c',
  alignmentRadiusLineWidth: 1,
  alignmentRadiusAlpha: 0.05,
  
  // separation viz
  visualizeSeparationRadius: false,
  separationRadius: 25,
  separationRadiusColor: '#ff0000',
  separationRadiusLineWidth: 1,
  separationRadiusAlpha: 0.2,
}

