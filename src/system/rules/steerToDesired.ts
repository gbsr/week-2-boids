import { vec2limit } from "../../utils/helpers"

export default function steerToDesired(
  index: number,
  desired: {x:number;y:number},
  vel: {x:number[]; y:number[]},
  maxForce: number,
  weight: number
){
  const steerX = desired.x - vel.x[index];
  const steerY = desired.y - vel.y[index];
  const limited = vec2limit({ x: steerX, y: steerY }, maxForce);
  return { x: limited.x * weight, y: limited.y * weight };
}