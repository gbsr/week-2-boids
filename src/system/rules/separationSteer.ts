import { state } from "../../state/state";
import desiredSeparation from "./desiredSeparation";
import steerToDesired from "./steerToDesired";

export default function separationSteer(i: number, arrays: any){
  const d = desiredSeparation(
    i,
    arrays,
    state.params.separationRadius,
    state.params.maxSpeed
  );

  return steerToDesired(
    i,
    d,
    arrays.velocity,
    state.params.maxForce,
    state.params.wSeparation
  );
}