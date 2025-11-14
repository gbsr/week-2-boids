import type { SliderControl } from "../../interface/controlTypes";
import { onParamChanged } from "../../state/onParamChanged"
import { state } from "../../state/state";

export default function createSlider(ctrl: SliderControl): HTMLElement {
  const wrapper = document.createElement("div");

  const label = document.createElement("label");
  label.textContent = ctrl.label;
  label.htmlFor = ctrl.paramId;
  wrapper.appendChild(label);

  const input = document.createElement("input");
  input.type = "range";
  input.id = ctrl.paramId;
  input.min = String(ctrl.min);
  input.max = String(ctrl.max);
  if (ctrl.step != null) input.step = String(ctrl.step);

  // Read current value from state.params, but only trust it if it's a number
  const raw = (state.params as any)[ctrl.paramId];
  const initial =
    (typeof raw === "number" ? raw : undefined) ??
    ctrl.defaultValue ??
    ctrl.min;

  input.value = String(initial);

  // Write back into state.params as a number
  input.addEventListener("input", () => {
    (state.params as any)[ctrl.paramId] = Number(input.value);
    onParamChanged(ctrl.paramId);
  });

  wrapper.appendChild(input);
  return wrapper;
}