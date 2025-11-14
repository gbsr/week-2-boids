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
    slider: { min: 10, max: 4000, step: 10 },
    affects: "boid-structure",
  },
  perceptionRadius: {
    default: 20,
    group: "Simulation",
    label: "Perception",
    control: "slider",
    slider: { min: 5, max: 200, step: 1 },
  },
  // interaction
  attractMouse: {
    default: false,
    group: "Interaction",
    label: "Attract Mouse",
    control: "checkbox",
  },
  repelMouse: {
    default: false,
    group: "Interaction",
    label: "Repel Mouse",
    control: "checkbox",
  },
  spacer_mouseCheckBoxes: {
    default: 0,
    control: "spacer",
    group: "Interaction",
  },
  mouseRadius: {
    default: 10,
    group: "Interaction",
    label: "Mouse Radius",
    control: "slider",
    slider: { min: 1, max: 500, step: 1 },
  },
  spacer_mouseRadius: {
    default: 0,
    control: "spacer",
    group: "Interaction",
  },
  mouseAttractionWeight: {
    default: 5,
    group: "Interaction",
    label: "Mouse Attraction",
    control: "slider",
    slider: { min: 0, max: 500, step: 0.1 },
  },

  
  mouseRepelWeight: {
    default: 25,
    group: "Interaction",
    label: "Mouse Repel",
    control: "slider",
    slider: { min: 0, max: 500, step: 0.1 },
  },

  // flocking
  separationWeight: {
    default: 0.75,
    group: "Flocking",
    label: "Separation",
    control: "slider",
    slider: { min: 0, max: 5, step: 0.01 },
  },
  separationRadius: {
    default: 5,
    group: "Flocking",
    label: "Radius",
    control: "slider",
    slider: { min: 0, max: 380, step: 1 },
},
  spacer_separation: {
    default: 0,
    control: "spacer",
    group: "Flocking",
  },

  alignmentWeight: {
    default: 0.05,
    group: "Flocking",
    label: "Alignment",
    control: "slider",
    slider: { min: 0, max: 5, step: 0.01 },
  },

  alignmentRadius: {
    default: 30,
    group: "Flocking",
    label: "Radius",
    control: "slider",
    slider: { min: 0, max: 380, step: 1 },
  },
  spacer_alignment: {
    default: 0,
    control: "spacer",
    group: "Flocking",
  },

  cohesionWeight: {
    default: 0.92,
    group: "Flocking",
    label: "Cohesion",
    control: "slider",
    slider: { min: 0, max: 5, step: 0.01 },
  },
  cohesionRadius: {
    default: 320,
    group: "Flocking",
    label: "Radius",
    control: "slider",
    slider: { min: 0, max: 380, step: 1 },
  },
  spacer_cohesion: {
    default: 0,
    control: "spacer",
    group: "Flocking",
  },
  spacer_ruleWeights: {
    default: 0,
    control: "spacer",
    group: "Flocking",
  },
  maxForce: {
    default: 900,
    group: "Flocking",
    label: "Max force",
    control: "slider",
    slider: { min: 0, max: 8000, step: 1 },
  },
  spacer_MaxForce: {
    default: 0,
    control: "spacer",
    group: "Flocking",
  },
  flockDriftStrength: {
    default: 30,
    group: "Flocking",
    label: "Drift strength",
    control: "slider",
    slider: { min: 0, max: 100, step: 1 },
  },

  spacer: {
    default: 0,
    control: "spacer",
    group: "Flocking",
  },

  speedBoostAtEdges: {
    default: 0.3,
    group: "Flocking",
    label: "Acceleration-force when far from flock",
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
    default: 100,
    group: "Movement",
    label: "Max speed",
    control: "slider",
    slider: { min: 1, max: 400, step: 1 },
  },
  turnRate: {
    default: 2,
    group: "Movement",
    label: "Turn rate",
    control: "slider",
    slider: { min: 0.01, max: 5, step: 0.01 },
  },
  
  maxWanderForce: {
    default: 1200,
    group: "Movement",
    label: "Wander force",
    control: "slider",
    slider: { min: 0, max: 2000, step: 10 },
  },
  spacer_wander: {
    default: 0,
    control: "spacer",
    group: "Movement",
  },
  wrapEdges: {
    default: false,
    group: "Movement",
    label: "Wrap edges",
    control: "checkbox",
  },

  spacer_wrapEdges: {
    default: 0,
    control: "spacer",
    group: "Edge",
  },
  
  boundaryMargin: {
    default: 200,
    group: "Edge",
    label: "Margin",
    control: "slider",
    slider: { min: 0, max: 400, step: 10 },
  },
  boundaryStrength: {
    default: 15000,
    group: "Edge",
    label: "Repel Edge",
    control: "slider",
    slider: { min: 0, max: 30000, step: 250 },
  },
  
  // looks
  size: {
    default: 0.1,
    group: "Render",
    label: "Size",
    control: "slider",
    slider: { min: 0.01, max: 2, step: 0.01 },
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
    control: "slider",
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
    default: "dot" as keyof typeof Themes,
    group: "Render",
    label: "Theme",
    control: "dropdown",
    dropdown: { options: ["triangle","circle","diamond","cross","cake","kite","chevron","leaf","particle","dot"] },
    affects: "render-cache",
  },

// debug
  // perception viz
visualizePerception: {
  default: false,
  group: "Debug - Perception",
  label: "Show perception radius",
  control: "checkbox",
},

perceptionColor: {
  default: "#00ff00",
  group: "Debug - Perception",
  label: "Perception color",
  control: "none"
},

perceptionLineWidth: {
  default: 1,
  group: "Debug - Perception",
  label: "Perception line width",
  control: "slider",
  slider: { min: 0.1, max: 5, step: 0.1 },
},

perceptionAlpha: {
  default: 0.3,
  group: "Debug - Perception",
  label: "Perception alpha",
  control: "slider",
  slider: { min: 0, max: 0.5, step: 0.0001 },
},

// cohesion viz
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

// alignment viz
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
  control: "none",
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

// separation viz
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
  control: "none",
},

separationRadiusLineWidth: {
  default: 4,
  group: "Debug - Separation",
  label: "Separation line width",
  control: "slider",
  slider: { min: 0.1, max: 10, step: 0.1 },
},

separationRadiusAlpha: {
  default: 0.03,
  group: "Debug - Separation",
  label: "Separation alpha",
  control: "slider",
  slider: { min: 0, max: 0.5, step: 0.0001 },
},

debugSampleStride: {
  default: 4,
  group: "Debug",
  label: "Debug sample stride",
  control: "slider",
  slider: { min: 1, max: 10, step: 1 },
},

maxDebugNeighbors: {
  default: 200,
  group: "Debug",
  label: "Max debug neighbors",
  control: "slider",
  slider: { min: 1, max: 50, step: 1 },
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