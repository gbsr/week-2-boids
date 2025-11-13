import type { DropdownControl } from "../../interface/controlTypes"
import { state } from "../../state/state"

export default function createDropdown(ctrl: DropdownControl): HTMLElement {
  const wrapper = document.createElement("div");

  const label = document.createElement("label");
  label.textContent = ctrl.label;
  label.htmlFor = ctrl.paramId;
  wrapper.appendChild(label);

  const select = document.createElement("select");
  select.id = ctrl.paramId;

  for (const opt of ctrl.options) {
    const o = document.createElement("option");
    o.value = String(opt.value);
    o.textContent = opt.label;
    select.appendChild(o);
  }

  // current state value (if any)
  const raw = (state.params as any)[ctrl.paramId];

  // state param → defaultValue → first option
  const initial =
    (raw != null ? raw : undefined) ??
    ctrl.defaultValue ??
    ctrl.options[0].value;

  select.value = String(initial);

  // Write into state.params
  select.addEventListener("change", () => {
    (state.params as any)[ctrl.paramId] = select.value;
  });

  wrapper.appendChild(select);
  return wrapper;
}