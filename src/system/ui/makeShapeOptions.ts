import { SHAPES } from "../../geometry/boidShapes";
import type { DropdownOption } from "../../interface/controlTypes";

export function makeShapeOptions(): DropdownOption<string>[] {
  return (Object.keys(SHAPES) as string[]).map((key) => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));
}