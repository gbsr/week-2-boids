// config/paramDefs.ts
import type { Themes } from "../geometry/themes";

type ControlKind = "slider" | "checkbox" | "dropdown" | "none";

type ParamDefBase<T> = {
  default: T;
  group: string;
  label?: string;
  control: ControlKind;
};

type SliderMeta = { min: number; max: number; step?: number };
type DropdownMeta<T extends string> = { options: T[] };

export type ParamDef<T = any> =
  | (ParamDefBase<number> & { control: "slider"; slider: SliderMeta })
  | (ParamDefBase<boolean> & { control: "checkbox" })
  | (ParamDefBase<string> & { control: "dropdown"; dropdown: DropdownMeta<string> })
  | (ParamDefBase<T> & { control: "none" }); // for things without UI controls

export const paramDefs = {
  // simulation
  boidCount: {
    default: 650,
    group: "Simulation",
    label: "Boids",
    control: "slider",
    slider: { min: 10, max: 4000, step: 10 },
  },
  perceptionRadius: {
    default: 20,
    group: "Simulation",
    label: "Perception",
    control: "slider",
    slider: { min: 5, max: 200, step: 1 },
  },

  // weights
  separationWeight: {
    default: 2.25,
    group: "Flocking",
    label: "Separation",
    control: "slider",
    slider: { min: 0, max: 3, step: 0.01 },
  },
  alignmentWeight: {
    default: 1.75,
    group: "Flocking",
    label: "Alignment",
    control: "slider",
    slider: { min: 0, max: 3, step: 0.01 },
  },
  cohesionWeight: {
    default: 1.92,
    group: "Flocking",
    label: "Cohesion",
    control: "slider",
    slider: { min: 0, max: 3, step: 0.01 },
  },
  flockDriftStrength: {
    default: 30,
    group: "Flocking",
    label: "Drift strength",
    control: "slider",
    slider: { min: 0, max: 100, step: 1 },
  },

  // movement
  maxSpeed: {
    default: 100,
    group: "Movement",
    label: "Max speed",
    control: "slider",
    slider: { min: 1, max: 400, step: 1 },
  },
  maxForce: {
    default: 900,
    group: "Movement",
    label: "Max force",
    control: "slider",
    slider: { min: 0, max: 2000, step: 10 },
  },
  maxWanderForce: {
    default: 1200,
    group: "Movement",
    label: "Wander force",
    control: "slider",
    slider: { min: 0, max: 2000, step: 10 },
  },
  wrapEdges: {
    default: false,
    group: "Movement",
    label: "Wrap edges",
    control: "checkbox",
  },
  turnRate: {
    default: 2,
    group: "Movement",
    label: "Turn rate",
    control: "slider",
    slider: { min: 0.01, max: 5, step: 0.01 },
  },
  boundaryMargin: {
    default: 200,
    group: "Movement",
    label: "Boundary margin",
    control: "slider",
    slider: { min: 0, max: 400, step: 10 },
  },
  boundaryStrength: {
    default: 15000,
    group: "Movement",
    label: "Boundary strength",
    control: "slider",
    slider: { min: 0, max: 30000, step: 500 },
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
  default: 0.2,
  group: "Debug - Perception",
  label: "Perception alpha",
  control: "slider",
  slider: { min: 0, max: 1, step: 0.01 },
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

cohesionRadius: {
  default: 320,
  group: "Debug - Cohesion",
  label: "Cohesion radius",
  control: "slider",
  slider: { min: 1, max: 1000, step: 1 },
},

cohesionRadiusColor: {
  default: "#ff00ff",
  group: "Debug - Cohesion",
  label: "Cohesion radius color",
  control: "none",
},

cohesionRadiusLineWidth: {
  default: 0.01,
  group: "Debug - Cohesion",
  label: "Cohesion line width",
  control: "slider",
  slider: { min: 0.001, max: 3, step: 0.001 },
},

cohesionRadiusAlpha: {
  default: 0.0003,
  group: "Debug - Cohesion",
  label: "Cohesion alpha",
  control: "slider",
  slider: { min: 0, max: 1, step: 0.0001 },
},

// alignment viz
visualizeAlignmentRadius: {
  default: false,
  group: "Debug - Alignment",
  label: "Show alignment radius",
  control: "checkbox",
},

visualizeAlignmentToNeighbors: {
  default: true,
  group: "Debug - Alignment",
  label: "Show alignment → neighbors",
  control: "checkbox",
},

alignmentRadius: {
  default: 30,
  group: "Debug - Alignment",
  label: "Alignment radius",
  control: "slider",
  slider: { min: 1, max: 300, step: 1 },
},

alignmentRadiusColor: {
  default: "#7fe29c",
  group: "Debug - Alignment",
  label: "Alignment radius color",
  control: "none",
},

alignmentRadiusLineWidth: {
  default: 0.1,
  group: "Debug - Alignment",
  label: "Alignment line width",
  control: "slider",
  slider: { min: 0.001, max: 3, step: 0.01 },
},

alignmentRadiusAlpha: {
  default: 0.01,
  group: "Debug - Alignment",
  label: "Alignment alpha",
  control: "slider",
  slider: { min: 0, max: 1, step: 0.01 },
},

// separation viz
visualizeSeparationRadius: {
  default: false,
  group: "Debug - Separation",
  label: "Show separation radius",
  control: "checkbox",
},

visualizeSeparationToNeighbors: {
  default: true,
  group: "Debug - Separation",
  label: "Show separation → neighbors",
  control: "checkbox",
},

separationRadius: {
  default: 5,
  group: "Debug - Separation",
  label: "Separation radius",
  control: "slider",
  slider: { min: 1, max: 200, step: 1 },
},

separationRadiusColor: {
  default: "#ff0000",
  group: "Debug - Separation",
  label: "Separation radius color",
  control: "none",
},

separationRadiusLineWidth: {
  default: 2,
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
  slider: { min: 0, max: 1, step: 0.01 },
},
} as const;


// runtime helpers
// For each key, take its `default` type
type ParamDefs = typeof paramDefs;

export type Params = {
  // remove read only so we can mutate
  -readonly [K in keyof ParamDefs]: ParamDefs[K]["default"];
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