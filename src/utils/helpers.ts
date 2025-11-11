// Number utilities

export default function probability(percent: number): boolean {
  return Math.random() < percent / 100;
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + t * (end - start);
}

// 2D vector utilities

  // Construction / randomization
export function vec2randomDirection() {
  const a = Math.random() * Math.PI * 2;
  return { x: Math.cos(a), y: Math.sin(a) };
}

  // Arithmetic
export function vec2add(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function vec2sub(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function vec2scale(v: { x: number; y: number }, s: number) {
  return { x: v.x * s, y: v.y * s };
}

  // Magnitude / normalization
export function vec2length(v: { x: number; y: number }) {
  return Math.hypot(v.x, v.y);
}

export function vec2normalize(v: { x: number; y: number }) {
  const m = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / m, y: v.y / m };
}

export function vec2limit(v: { x: number; y: number }, max: number) {
  const m = Math.hypot(v.x, v.y);
  if (m > max) {
    const s = max / m;
    return { x: v.x * s, y: v.y * s };
  }
  return v;
}

  // Distance / interpolation
export function vec2distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function vec2distanceSq(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export function vec2lerp(a: { x: number; y: number }, b: { x: number; y: number }, t: number) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}