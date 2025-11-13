import { state } from "../../state/state"
import desiredCohesion from "./desiredCohesion"
import steerToDesired from "./steerToDesired"
  
export default function cohesionSteer(i: number, arrays: any){
  const desired = desiredCohesion(i, arrays, state.params.cohesionRadius, state.params.maxSpeed);
  return steerToDesired(i, desired, arrays.velocity, state.params.maxForce, state.params.wCohesion);
}