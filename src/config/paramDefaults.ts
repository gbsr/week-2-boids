// config/paramDefs.ts
import type { Themes } from "../geometry/themes";
import type { SpacerControl } from "../interface/controlTypes"

type ControlKind = "slider" | "checkbox" | "dropdown" | "none";

type Affects =
  | "none"
  | "boid-structure"   // needs boid array reinit (e.g. boidCount)
  | "render-cache";  

type ParamDefBase<T> = {
  default: T;
  group: string;
  label?: string;
  control: ControlKind;
  spacer: SpacerControl;
  affects?: Affects;
};

type SliderMeta = { min: number; max: number; step?: number };
type DropdownMeta<T extends string> = { options: T[] };

export type ParamDef<T = any> =
  | (ParamDefBase<number> & { control: "slider"; slider: SliderMeta })
  | (ParamDefBase<boolean> & { control: "checkbox" })
  | (ParamDefBase<string> & { control: "dropdown"; dropdown: DropdownMeta<string> })
  | (ParamDefBase<any> & { control: "spacer"; spacer: SpacerControl })
  | (ParamDefBase<T> & { control: "none" }); // for things without UI controls

export const paramDefs = {
// simulation
  boidCount: {
    default: 650,
    group: "Simulation",
    label: "Number of Boids",
    control: "slider",
    slider: { min: 1, max: 4000, step: 1 },
    affects: "boid-structure",
  },
  perceptionRadius: {
    default: 20,
    group: "Simulation",
    label: "Perception",
    control: "none", // hide for now, not implemented yet
    slider: { min: 5, max: 200, step: 1 },
  },

// interaction
  attractMouse: {
    default: false,
    group: "Interaction",
    label: "Attract Mouse",
    // control: "checkbox",
    control: "none", // hide for now, not implemented yet
  },
  repelMouse: {
    default: false,
    group: "Interaction",
    label: "Repel Mouse",
    // control: "checkbox",
    control: "none", // hide for now, not implemented yet
  },
  spacer_mouseCheckBoxes: {
    default: 0,
    group: "Interaction",
    control: "none", // hide for now, not implemented yet
    // control: "spacer",
  },
  mouseRadius: {
    default: 10,
    group: "Interaction",
    label: "Mouse Radius",
    // control: "slider",
    control: "none", // hide for now, not implemented yet
    slider: { min: 1, max: 500, step: 1 },
  },
  spacer_mouseRadius: {
    default: 0,
    // control: "spacer",
    control: "none", // hide for now, not implemented yet
    group: "Interaction",
  },
  mouseAttractionWeight: {
    default: 5,
    group: "Interaction",
    label: "Mouse Attraction",
    // control: "slider",
    control: "none", // hide for now, not implemented yet
    slider: { min: 0, max: 500, step: 0.1 },
  },
  mouseRepelWeight: {
    default: 25,
    group: "Interaction",
    label: "Mouse Repel",
    // control: "slider",
    control: "none", // hide for now, not implemented yet
    slider: { min: 0, max: 500, step: 0.1 },
  },

  // flocking
  separationWeight: {
    default: 0.75,
    group: "Flocking",
    label: "Separation",
    control: "slider",
    slider: { min: 0, max: 3, step: 0.001 },
  },
  separationRadius: {
    default: 5,
    group: "Flocking",
    label: "Radius",
    control: "slider",
    slider: { min: 0, max: 380, step: 0.5 },
  },
  spacer_separation: {
    default: 0,
    group: "Flocking",
    control: "spacer",
  },
  alignmentWeight: {
    default: 0.05,
    group: "Flocking",
    label: "Alignment",
    control: "slider",
    slider: { min: 0, max: 3, step: 0.001 },
  },
  alignmentRadius: {
    default: 30,
    group: "Flocking",
    label: "Radius",
    control: "slider",
    slider: { min: 0, max: 380, step: 0.5 },
  },
  spacer_alignment: {
    default: 0,
    group: "Flocking",
    control: "spacer",
  },
  cohesionWeight: {
    default: 0.92,
    group: "Flocking",
    label: "Cohesion",
    control: "slider",
    slider: { min: 0, max: 3, step: 0.001 },
  },
  cohesionRadius: {
    default: 320,
    group: "Flocking",
    label: "Radius",
    control: "slider",
    slider: { min: 0, max: 380, step: 0.5 },
  },
  spacer_cohesion: {
    default: 0,
    group: "Flocking",
    control: "spacer",
  },
  maxForce: {
    default: 10,
    group: "Flocking",
    label: "Max force",
    control: "slider",
    slider: { min: 0, max: 50, step: 0.001 },
  },
  spacer_MaxForce: {
    default: 0,
    group: "Flocking",
    control: "spacer",
  },

  flockDriftStrength: {
    default: 3,
    group: "Flocking",
    label: "Flock Drift",
    control: "slider",
    slider: { min: 0, max: 10, step: 0.001 },
  },
  spacer: {
    default: 0,
    group: "Flocking",
    control: "spacer",
  },
  speedBoostAtEdges: {
    default: 0.3,
    group: "Flocking",
    label: "Accelerate when far from flock",
    control: "slider",
    slider: { min: 0, max: 1, step: 0.001 },
  },
  turnBoostAtEdges: {
    default: 1,
    group: "Flocking",
    label: "Turn boost when far from flock",
    control: "slider",
    slider: { min: 0, max: 2, step: 0.001 },
  },

  // movement
  maxSpeed: {
    default: 20,
    group: "Movement",
    label: "Max speed",
    control: "slider",
    slider: { min: 1, max: 250, step: 0.001 },
  },
  turnRate: {
    default: 10,
    group: "Movement",
    label: "Turn rate",
    control: "slider",
    slider: { min: 0.01, max: 50, step: 0.1 },
  },
  maxWanderForce: {
    default: 20,
    group: "Movement",
    label: "Wander force",
    control: "slider",
    slider: { min: 0, max: 50, step: 0.001 },
  },
  spacer_wander: {
    default: 0,
    group: "Movement",
    control: "spacer",
  },

  // edge / bounds
  spacer_wrapEdges: {
    default: 0,
    group: "Edge",
    control: "spacer",
  },
  boundaryMargin: {
    default: 200,
    group: "Edge",
    label: "Margin",
    control: "slider",
    slider: { min: 0, max: 400, step: 10 },
  },
  boundaryStrength: {
    default: 15,
    group: "Edge",
    label: "Repel Edge",
    control: "slider",
    slider: { min: 0, max: 300, step: 0.1 },
  },
  
// render
  size: {
    default: 1,
    group: "Render",
    label: "Size",
    control: "slider",
    slider: { min: 0.01, max: 10, step: 0.01 },
  },
  trailLength: {
    default: 0.15,
    group: "Render",
    label: "Trail length",
    control: "slider",
    slider: { min: 0, max: 1, step: 0.01 },
  },
  trailAlpha: {
    default: 1,
    group: "Render",
    label: "Trail alpha",
    // control: "slider",
    control: "none", // hide for now, not implemented yet
    slider: { min: 0, max: 1, step: 0.01 },
  },
  trailStep: {
    default: 0,
    group: "Render",
    label: "Trail step",
    control: "slider",
    slider: { min: 0, max: 30, step: 1 },
  },
  shadowSize: {
    default: 4,
    group: "Render",
    label: "Shadow size",
    control: "slider",
    slider: { min: 0, max: 10, step: 0.1 },
  },
  shadowOpacity: {
    default: 1,
    group: "Render",
    label: "Shadow opacity",
    control: "slider",
    slider: { min: 0, max: 1, step: 0.01 },
  },
  randomBoidColors: {
    default: false,
    group: "Render",
    label: "Random boid colors",
    control: "checkbox",
  },
  randomTrailColors: {
    default: false,
    group: "Render",
    label: "Random trail colors",
    control: "checkbox",
  },
  theme: {
    default: "cross" as keyof typeof Themes,
    group: "Render",
    label: "Theme",
    control: "dropdown",
    dropdown: {
      options: [
        "triangle",
        "circle",
        "diamond",
        "cross",
        "cake",
        "kite",
        "chevron",
        "leaf",
        "particle",
        "dot",
      ],
    },
    affects: "render-cache",
  },

// debug - perception
  visualizePerception: {
    default: false,
    group: "Debug - Perception",
    label: "Show perception radius",
    // control: "checkbox",
    control: "none", // not implemented yet
  },
  perceptionColor: {
    default: "#00ff00",
    group: "Debug - Perception",
    label: "Perception color",
    control: "none", // not implemented yet
  },
  perceptionLineWidth: {
    default: 1,
    group: "Debug - Perception",
    label: "Perception line width",
    // control: "slider",
    control: "none", // hide for now, not implemented yet
    slider: { min: 0.1, max: 5, step: 0.1 },
  },
  perceptionAlpha: {
    default: 0.3,
    group: "Debug - Perception",
    label: "Perception alpha",
    // control: "slider",
    control: "none", // hide for now, not implemented yet
    slider: { min: 0, max: 0.5, step: 0.0001 },
  },

// debug - cohesion
  visualizeCohesionRadius: {
    default: false,
    group: "Debug - Cohesion",
    label: "Show cohesion radius",
    control: "checkbox",
  },
  visualizeCohesionToNeighbors: {
    default: false,
    group: "Debug - Cohesion",
    label: "Show cohesion → neighbors",
    control: "checkbox",
  },
  cohesionRadiusColor: {
    default: "#ff00ff",
    group: "Debug - Cohesion",
    label: "Cohesion radius color",
    control: "none",
  },
  cohesionRadiusLineWidth: {
    default: 4,
    group: "Debug - Cohesion",
    label: "Cohesion line width",
    control: "slider",
    slider: { min: 0.001, max: 3, step: 0.001 },
  },
  cohesionRadiusAlpha: {
    default: 0.03,
    group: "Debug - Cohesion",
    label: "Cohesion alpha",
    control: "slider",
    slider: { min: 0, max: 0.05, step: 0.0001 },
  },

// debug - alignment
  visualizeAlignmentRadius: {
    default: false,
    group: "Debug - Alignment",
    label: "Show alignment radius",
    control: "checkbox",
  },
  visualizeAlignmentToNeighbors: {
    default: false,
    group: "Debug - Alignment",
    label: "Show alignment → neighbors",
    control: "checkbox",
  },
  alignmentRadiusColor: {
    default: "#7fe29c",
    group: "Debug - Alignment",
    label: "Alignment radius color",
    control: "none", // expose later?
  },
  alignmentRadiusLineWidth: {
    default: 1,
    group: "Debug - Alignment",
    label: "Alignment line width",
    control: "slider",
    slider: { min: 0.001, max: 3, step: 0.01 },
  },
  alignmentRadiusAlpha: {
    default: 0.03,
    group: "Debug - Alignment",
    label: "Alignment alpha",
    control: "slider",
    slider: { min: 0, max: 0.05, step: 0.0001 },
  },

// debug - separation
  visualizeSeparationRadius: {
    default: false,
    group: "Debug - Separation",
    label: "Show separation radius",
    control: "checkbox",
  },
  visualizeSeparationToNeighbors: {
    default: false,
    group: "Debug - Separation",
    label: "Show separation → neighbors",
    control: "checkbox",
  },
  separationRadiusColor: {
    default: "#ff0000",
    group: "Debug - Separation",
    label: "Separation radius color",
    control: "none", // expose later?
  },
  separationRadiusLineWidth: {
    default: 4,
    group: "Debug - Separation",
    label: "Separation line width",
    control: "slider",
    slider: { min: 0.01, max: 3, step: 0.01 },
  },
  separationRadiusAlpha: {
    default: 0.03,
    group: "Debug - Separation",
    label: "Separation alpha",
    control: "slider",
    slider: { min: 0, max: 0.05, step: 0.0001 },
  },

// debug - misc
  debugSampleStride: {
    default: 4,
    group: "Debug",
    label: "Debug sample stride",
    // control: "slider",
    control: "none", // hide for now, not interesting for user
    slider: { min: 1, max: 10, step: 1 },
  },
  maxDebugNeighbors: {
    default: 200,
    group: "Debug",
    label: "Max debug neighbors",
    // control: "slider",
    control: "none", // hide for now, not interesting for user
    slider: { min: 1, max: 450, step: 1 },
  },
} as const;
// runtime helpers
// For each key, take its `default` type
type ParamDefs = typeof paramDefs;

export type Params = {
  // remove read only so we can mutate
  // -readonly [K in keyof ParamDefs]: ParamDefs[K]["default"];
};

export function createDefaultParams(): Params {
  const result = {} as Params;
  (Object.keys(paramDefs) as (keyof ParamDefs)[]).forEach((key) => {
    // TypeScript cannot reliably infer the specific property type when indexing with a dynamic key,
    // so use a safe cast to avoid the "type '... is not assignable to type 'never''" error.
    (result as any)[key] = paramDefs[key].default;
  });
  return result;
}