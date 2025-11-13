import type { UIControl } from "../../interface/controlTypes";
import { makeShapeOptions } from "./makeShapeOptions"

export const controls: UIControl[] = [
  {
    kind: "slider",
    group: "Flocking",
    paramId: "alignmentWeight",
    label: "Alignment",
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    kind: "slider",
    group: "Flocking",
    paramId: "cohesionWeight",
    label: "Cohesion",
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    kind: "slider",
    group: "Flocking",
    paramId: "separationWeight",
    label: "Separation",
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    kind: "slider",
    group: "Movement",
    paramId: "maxSpeed",
    label: "Max speed",
    min: 10,
    max: 400,
    step: 1,
  },
  {
    kind: "dropdown",
    group: "Render",
    paramId: "shape",
    label: "Shape",
    options: makeShapeOptions(),
  },

  {
    kind: "checkbox",
    group: "Movement",
    paramId: "wrapEdges",
    label: "Wrap edges",
    defaultValue: true,
  },
  {
    kind: "checkbox",
    group: "Debug",
    paramId: "visualizeAlignmentRadius",
    label: "Show alignment radius",
  },
  {
    kind: "checkbox",
    group: "Debug",
    paramId: "visualizeCohesionRadius",
    label: "Show cohesion radius",
  },
];