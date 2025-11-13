import { vec2normalize } from "../../utils/helpers";

export default function desiredSeparation(
  index: number,
  arrays: { position:{x:number[];y:number[]} },
  radius: number,
  maxSpeed: number
){
  const posX = arrays.position.x;
  const posY = arrays.position.y;
  const sx = posX[index], sy = posY[index];
  const r2 = radius * radius;

  let sumX = 0, sumY = 0, c = 0;

  for (let j = 0; j < posX.length; j++){
    if (j === index) continue;

    const dx = sx - posX[j];
    const dy = sy - posY[j];
    const d2 = dx*dx + dy*dy;

    if (d2 <= r2){
      const dist = Math.sqrt(d2) || 1;
      // inverse distance weighting
      sumX += dx / dist;
      sumY += dy / dist;
      c++;
    }
  }

  if (!c) return { x:0, y:0 };

  const dir = vec2normalize({ x: sumX, y: sumY });
  return {
    x: dir.x * maxSpeed,
    y: dir.y * maxSpeed
  };
}