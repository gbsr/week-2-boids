// state/onParamChanged.ts
import { state } from "./state";
import { paramDefs } from "../config/paramDefaults";

export function onParamChanged(paramId: string) {
  const def = (paramDefs as Record<string, any>)[paramId];
  if (!def || !def.affects) return;

  switch (def.affects) {
    case "boid-structure":
      state.needsBoidReinit = true;
      break;
    case "render-cache":
      state.needsTrailReset = true;
      break;
  }
}