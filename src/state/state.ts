import type { Themes } from "../geometry/themes"

export type FSMState = 'idle' | 'running' | 'paused' | 'stepping' | 'dragging'
export type MouseMode = 'attract' | 'repel' | 'curious'


export const state = {

  fsm: { state: 'idle' as FSMState },

  params: {
    boidCount: 100,
    perception: 50,
    wSeparation: 1.5,
    wAlignment: 1.0,
    wCohesion: 1.0,
    maxSpeed: 5,
    maxForce: 0.03,
    wrapEdges: true,
    dtMs: 16,
    seed: 42,
    needsReseed: false,
    theme: 'cake' as keyof typeof Themes,
    turnRate: 0.02,
    size: 1,
    trailLength: 0.3,
    trailAlpha: 0.3,
    trailStep: 9,
    shadowSize: 1.35,
    shadowOpacity: 0.1,
    randomBoidColors: false,
    randomTrailColors: false,

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
    alignmentRadiusColor: '#ffff00',
    alignmentRadiusLineWidth: 1,
    alignmentRadiusAlpha: 0.2,
    
    visualizeSeparationRadius: false,
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