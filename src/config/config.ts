export const canvasConfig = {
  backgroundColor: '#000000',
  border: '1px solid #333333',
  // boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
}

export const boidConfig = {
  boidCount: 100,
  perceptionRadius: 50,
  separationWeight: 1.5,
  alignmentWeight: 1.0,
  cohesionWeight: 1.0,
  maxSpeed: 0.35,
  maxForce: 0.1,
  wrapEdges: false,

  visualizePerception: false,
  perceptionColor: '#00ff00',
  perceptionLineWidth: 1,
  perceptionAlpha: 0.2,

  visualizeCohesionRadius: false,
  cohesionRadiusColor: '#0000ff',
  cohesionRadiusLineWidth: 1,
  cohesionRadiusAlpha: 0.2,

  visualizeAlignmentRadius: false,
  alignmentRadiusColor: '#ffff00',
  alignmentRadiusLineWidth: 1,
  alignmentRadiusAlpha: 0.2,
  
  visualizeSeparationRadius: false,
  separationRadiusColor: '#ff0000',
  separationRadiusLineWidth: 1,
  separationRadiusAlpha: 0.2,
}

