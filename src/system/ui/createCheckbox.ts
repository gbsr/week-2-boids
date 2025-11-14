import type { CheckboxControl } from "../../interface/controlTypes";
import { onParamChanged } from "../../state/onParamChanged"
import { state } from "../../state/state";

export default function createCheckbox(ctrl: CheckboxControl): HTMLElement {
  const wrapper = document.createElement("div");

  const label = document.createElement("label");
  label.textContent = ctrl.label;
  label.htmlFor = ctrl.paramId;
  wrapper.appendChild(label);
  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = ctrl.paramId;

  // Read current value from state.params, but only trust it if it's a boolean
  const raw = (state.params as any)[ctrl.paramId];
  const initial =
    (typeof raw === "boolean" ? raw : undefined) ??
    ctrl.defaultValue ??
    false;

  input.checked = initial;

  // Write back into state.params as a boolean
  input.addEventListener("input", () => {
    (state.params as any)[ctrl.paramId] = input.checked;
    onParamChanged(ctrl.paramId);
  });

  wrapper.appendChild(input);
  return wrapper;
}