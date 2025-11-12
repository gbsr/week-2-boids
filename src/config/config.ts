import type { Themes } from "../geometry/themes"

export const canvasConfig = {
  backgroundColor: '#000000',
  border: '1px solid #333333',
  // boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
}

export const boidConfig = {
  boidCount: 80,
  perceptionRadius: 50,
  separationWeight: 1.5,
  alignmentWeight: 100,
  cohesionWeight: 1.0,
  maxSpeed: 400,
  maxForce: 10000,
  wrapEdges: true,
  size: 1,

  // trails
  trailLength: 0.94,
  trailAlpha: 0,
  trailStep: 9,
  shadowSize: 2.1,
  shadowOpacity: 0.1,
  randomBoidColors: true,
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
  theme: 'triangle' as keyof typeof Themes,
  turnRate: 0.85,

  visualizePerception: false,
  perceptionColor: '#00ff00',
  perceptionLineWidth: 1,
  perceptionAlpha: 0.2,

  visualizeCohesionRadius: false,
  cohesionRadius: 50,
  cohesionRadiusColor: '#0000ff',
  cohesionRadiusLineWidth: 1,
  cohesionRadiusAlpha: 0.2,

  visualizeAlignmentRadius: false,
  visualizeAlignmentToNeighbors: false,
  alignmentRadius: 75,
  // alignmentRadiusColor: '#ffff00',
  alignmentRadiusColor: '7fe29c',
  alignmentRadiusLineWidth: 1,
  alignmentRadiusAlpha: 0.2,
  
  visualizeSeparationRadius: false,
  separationRadius: 25,
  separationRadiusColor: '#ff0000',
  separationRadiusLineWidth: 1,
  separationRadiusAlpha: 0.2,
}

