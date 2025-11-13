import { state } from "../../state/state"
import desiredAlignment from "./desiredAlignment"
import steerToDesired from "./steerToDesired"


export default function alignmentSteer(i: number, arrays: any){
  const desired = desiredAlignment(i, arrays, state.params.alignmentRadius, state.params.maxSpeed);
  return steerToDesired(i, desired, arrays.velocity, state.params.maxForce, state.params.wAlignment);
}
