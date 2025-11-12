import { vec2distanceSq, vec2normalize, vec2limit } from "../../utils/helpers";

export default function cohesionSteer(
  index: number,
  arrays: {
    position: { x: number[]; y: number[] };
    velocity: { x: number[]; y: number[] };
  },
  params: {
    cohesionRadius: number; // CSS px
    maxSpeed: number;
    maxForce: number;
    wCohesion: number;      // weight for cohesion
  }
): { x: number; y: number } {
  const { x: posX, y: posY } = arrays.position;
  const { x: velX, y: velY } = arrays.velocity;

  const self = { x: posX[index], y: posY[index] };
  const r2 = params.cohesionRadius * params.cohesionRadius;

  // centroid of neighbors within radius
  let sumX = 0, sumY = 0, count = 0;
  for (let j = 0; j < posX.length; j++) {
    if (j === index) continue;
    if (vec2distanceSq(self, { x: posX[j], y: posY[j] }) <= r2) {
      sumX += posX[j];
      sumY += posY[j];
      count++;
    }
  }
  if (count === 0) return { x: 0, y: 0 };

  const cx = sumX / count, cy = sumY / count;

  // desired: head toward centroid at maxSpeed
  const toC = vec2normalize({ x: cx - self.x, y: cy - self.y });
  const desiredX = toC.x * params.maxSpeed;
  const desiredY = toC.y * params.maxSpeed;

  // steering = desired - current vel, limited, weighted
  const steer = vec2limit(
    { x: desiredX - velX[index], y: desiredY - velY[index] },
    params.maxForce
  );

  return { x: steer.x * params.wCohesion, y: steer.y * params.wCohesion };
}