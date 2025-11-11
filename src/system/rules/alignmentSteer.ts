// system/alignmentSteer.ts
import { vec2distanceSq, vec2normalize, vec2limit } from "../../utils/helpers";

export default function alignmentSteer(
  index: number,
  arrays: {
    position: { x: number[]; y: number[] },
    velocity: { x: number[]; y: number[] }
  },
  params: {
    alignmentRadius: number;
    maxSpeed: number;
    maxForce: number;
    wAlignment: number;
  }
): { x: number; y: number } {

  const { x: posX, y: posY } = arrays.position;
  const { x: velX, y: velY } = arrays.velocity;

  const self = { x: posX[index], y: posY[index] };
  const radiusSq = params.alignmentRadius * params.alignmentRadius;

  let sumVX = 0;
  let sumVY = 0;
  let count = 0;

  // Average neighbor velocity within radius
  for (let other = 0; other < posX.length; other++) {
    if (other === index) continue; // skip self

    if (vec2distanceSq(self, { x: posX[other], y: posY[other] }) <= radiusSq) {
      sumVX += velX[other];
      sumVY += velY[other];
      count++;
    }
  }

  if (count === 0) return { x: 0, y: 0 };

  // desired = normalized average * maxSpeed
  const avg = vec2normalize({ x: sumVX / count, y: sumVY / count });
  const desiredX = avg.x * params.maxSpeed;
  const desiredY = avg.y * params.maxSpeed;

  // steering = desired - current, limited to maxForce
  const limited = vec2limit(
    { x: desiredX - velX[index], y: desiredY - velY[index] },
    params.maxForce
  );

  // weight
  return { x: limited.x * params.wAlignment, y: limited.y * params.wAlignment };
}