import { vec2normalize } from "../../utils/helpers"

export default function desiredCohesion(
  index: number,
  arrays: { position:{x:number[];y:number[]}, velocity:{x:number[];y:number[]} },
  radius: number,
  maxSpeed: number
){
  const {x:posX,y:posY} = arrays.position;
  const sx = posX[index], sy = posY[index];
  const r2 = radius*radius;

  let cx=0, cy=0, c=0;
  for (let j=0;j<posX.length;j++){
    if (j===index) continue;
    const dx = posX[j]-sx, dy = posY[j]-sy;
    if (dx*dx+dy*dy <= r2){ cx += posX[j]; cy += posY[j]; c++; }
  }
  if (!c) return {x:0,y:0};
  const toC = vec2normalize({ x: (cx/c)-sx, y: (cy/c)-sy });
  return { x: toC.x * maxSpeed, y: toC.y * maxSpeed };
}