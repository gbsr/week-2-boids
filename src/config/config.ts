import type { Themes } from "../geometry/themes"

export const canvasConfig = {
  backgroundColor: '#000000',
  border: '1px solid #333333',
  // boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
}

export const boidConfig = {
  // simulation
  boidCount: 450,
  perceptionRadius: 20,
 
  // weights
  separationWeight: 2,
  alignmentWeight: 0.35,
  cohesionWeight: 0.22,

  // movement
  maxSpeed: 140,
  maxForce: 50,
  wrapEdges: true,
  turnRate: 10,
  
  // looks
  size: 1,
  trailLength: 0,
  trailAlpha: 1,
  trailStep: 1,
  shadowSize: 2,
  shadowOpacity: 0,
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
  // 'dot'
  theme: 'dot' as keyof typeof Themes,

  // perception viz
  visualizePerception: false,
  perceptionColor: '#00ff00',
  perceptionLineWidth: 1,
  perceptionAlpha: 0.2,

  // cohesion viz
  visualizeCohesionRadius: false,
  visualizeCohesionToNeighbors: true,
  cohesionRadius: 800,
  cohesionRadiusColor: '#ff00ff',
  cohesionRadiusLineWidth: 0.1,
  cohesionRadiusAlpha: 0.0005,

  // alignment viz
  visualizeAlignmentRadius: false,
  visualizeAlignmentToNeighbors: false,
  alignmentRadius: 20,
  alignmentRadiusColor: '7fe29c',
  alignmentRadiusLineWidth: 0.1,
  alignmentRadiusAlpha: 0.003,
  
  // separation viz
  visualizeSeparationRadius: true,
  visualizeSeparationToNeighbors: false,
  separationRadius: 5,
  separationRadiusColor: '#ff0000',
  separationRadiusLineWidth: 0.1,
  separationRadiusAlpha: 0.1,
}

