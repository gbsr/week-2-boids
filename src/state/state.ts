// state/state.ts
import { createDefaultParams } from "../config/paramDefaults"

export type FSMState = 'idle' | 'running' | 'paused' | 'stepping' | 'dragging'
export type MouseMode = 'attract' | 'repel' | 'curious'

export const state = {

  fsm: { state: 'idle' as FSMState },
   needsBoidReinit: false,
    needsTrailReset: false,

  params: createDefaultParams(),

   mouse: {
    x: 0,
    y: 0,
    inside: false,
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

export const flockDrift = {
  x: 0,
  y: 0,
  angle: Math.random() * Math.PI * 2,
};