export type ControlKind = "slider" | "dropdown" | "checkbox" | "spacer";

interface BaseControl<K extends ControlKind> {
  kind: K;

  // "maxSpeed", "alignmentWeight", "trailLength" etc etc
  paramId: string;
  label: string;
  help?: string;
  group?: string;
  spacer?: any;
}

export interface SliderControl extends BaseControl<"slider"> {
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  softMin?: number;
  softMax?: number;
}

export interface DropdownOption<T = string> {
  value: T;
  label: string;
}

export interface DropdownControl<T = string> extends BaseControl<"dropdown"> {
  options: DropdownOption<T>[];
  defaultValue?: T;
}

export interface SpacerControl extends BaseControl<"spacer"> {
 // probably style this
}

export interface CheckboxControl extends BaseControl<"checkbox"> {
  defaultValue?: boolean;
}

export type UIControl = SliderControl | DropdownControl | CheckboxControl | SpacerControl;