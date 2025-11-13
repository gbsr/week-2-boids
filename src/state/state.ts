import type { Themes } from "../geometry/themes"

export type FSMState = 'idle' | 'running' | 'paused' | 'stepping' | 'dragging'
export type MouseMode = 'attract' | 'repel' | 'curious'


export const state = {

  fsm: { state: 'idle' as FSMState },

  params: {

    // simulation
    boidCount: 100,
    perception: 50,
    dtMs: 16,
    seed: 42,

    // weights
    wSeparation: 1.5,
    wAlignment: 1.0,
    wCohesion: 1.0,

    // movement
    maxSpeed: 5,
    maxForce: 0.03,
    maxWanderForce: 0.1,
    turnRate: 0.02,
    wrapEdges: true,
    needsReseed: false,

    // looks
    theme: 'cake' as keyof typeof Themes,
    size: 1,
    trailLength: 0.3,
    trailAlpha: 0.3,
    trailStep: 9,
    shadowSize: 1.35,
    shadowOpacity: 0.1,
    randomBoidColors: false,
    randomTrailColors: false,
    debugSampleStride: 300,
    maxDebugNeighbors: 300,

    // perception viz
    visualizePerception: false,
    perceptionColor: '#00ff00',
    perceptionLineWidth: 1,
    perceptionAlpha: 0.2,

    // cohesion viz
    visualizeCohesionRadius: false,
    visualizeCohesionToNeighbors: false,
    cohesionRadius: 50,
    cohesionRadiusColor: '#0000ff',
    cohesionRadiusLineWidth: 1,
    cohesionRadiusAlpha: 0.2,

    // alignment viz
    visualizeAlignmentRadius: false,
    visualizeAlignmentToNeighbors: false,
    alignmentRadius: 15,
    alignmentRadiusColor: '#ffff00',
    alignmentRadiusLineWidth: 1,
    alignmentRadiusAlpha: 0.2,
    
    // separation viz
    visualizeSeparationRadius: false,
    visualizeSeparationToNeighbors: false,
    separationRadius: 25,
    separationRadiusColor: '#ff0000',
    separationRadiusLineWidth: 1,
    separationRadiusAlpha: 0.2,
  },

  mouse: {
    x: 0,
    y: 0,
    mode: 'attract' as MouseMode,
    radius: 100,
  },
  
  arrays: {
    position: { x: [] as number[], y: [] as number[] },
    velocity: { x: [] as number[], y: [] as number[] },
  },

  viewport: {
    width: 800,
    height: 600,
  },
}