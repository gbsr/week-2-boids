import type { Vec2 } from "../interface/boid";

export function randomSteer(maxStrength: number): Vec2 {
  if (maxStrength <= 0) {
    return { x: 0, y: 0 };
  }

  const angle = Math.random() * Math.PI * 2;
  const mag   = Math.random() * maxStrength;

  return {
    x: Math.cos(angle) * mag,
    y: Math.sin(angle) * mag,
  };
}