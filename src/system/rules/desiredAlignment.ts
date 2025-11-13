import { vec2normalize } from "../../utils/helpers"

export default function desiredAlignment(
  index: number,
  arrays: { position:{x:number[];y:number[]}, velocity:{x:number[];y:number[]} },
  radius: number,
  maxSpeed: number
){
  const {x:posX,y:posY} = arrays.position;
  const {x:velX,y:velY} = arrays.velocity;
  const sx = posX[index], sy = posY[index];
  const r2 = radius*radius;

  let ax=0, ay=0, c=0;
  for (let j=0;j<posX.length;j++){
    if (j===index) continue;
    const dx = posX[j]-sx, dy = posY[j]-sy;
    if (dx*dx+dy*dy <= r2){ ax += velX[j]; ay += velY[j]; c++; }
  }
  if (!c) return {x:velX[index], y:velY[index]}; // no neighbors → keep heading
  const avg = vec2normalize({ x: ax/c, y: ay/c });
  return { x: avg.x * maxSpeed, y: avg.y * maxSpeed };
}