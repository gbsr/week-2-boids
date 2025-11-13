import { paramDefs } from "./paramDefaults"
export type ParamDefs = typeof paramDefs

export const canvasConfig = {
  backgroundColor: '#000000',
  border: '1px solid #333333',
  // boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
}

// config/boidConfig.ts
export type BoidConfig = {
  [K in keyof ParamDefs]: ParamDefs[K]["default"];
};

export const boidConfig: BoidConfig = Object.fromEntries(
  Object.entries(paramDefs).map(([key, def]) => [key, (def as any).default])
) as BoidConfig;

