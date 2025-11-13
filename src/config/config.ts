import type { Themes } from "../geometry/themes"

export const canvasConfig = {
  backgroundColor: '#000000',
  border: '1px solid #333333',
  // boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
}

export const boidConfig = {
  // simulation
  boidCount: 650,
  perceptionRadius: 20,
 
  // weights
  separationWeight: 2.25,
  alignmentWeight: 1.15,
  cohesionWeight: 1.62,
  flockDriftStrength: 30,

  // movement
  maxSpeed: 100,
  maxForce: 900,
  maxWanderForce: 1200,
  wrapEdges: true,
  turnRate: 2,

  // boost at edges
  speedBoostAtEdges: 0.43,
  turnBoostAtEdges: 2,
  
  // looks
  size: 0.1,
  trailLength: 0.15,
  trailAlpha: 1,
  trailStep: 0,
  shadowSize: 4,
  shadowOpacity: 1,
  randomBoidColors: false,
  randomTrailColors: false,
  debugSampleStride: 8,
  maxDebugNeighbors: 200,

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
  cohesionRadiusLineWidth: 0.01,
  cohesionRadiusAlpha: 0.0003,

  // alignment viz
  visualizeAlignmentRadius: false,
  visualizeAlignmentToNeighbors: true,
  alignmentRadius: 30,
  alignmentRadiusColor: '7fe29c',
  alignmentRadiusLineWidth: 0.1,
  alignmentRadiusAlpha: 0.01,
  
  // separation viz
  visualizeSeparationRadius: false,
  visualizeSeparationToNeighbors: true,
  separationRadius: 5,
  separationRadiusColor: '#ff0000',
  separationRadiusLineWidth: 2,
  separationRadiusAlpha: 0.03,
}

