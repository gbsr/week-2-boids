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