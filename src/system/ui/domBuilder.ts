import { paramDefs } from "../../config/paramDefaults";
import type {
  SliderControl,
  DropdownControl,
  CheckboxControl,
} from "../../interface/controlTypes";

import createSlider from "./createSlider";
import createDropdown from "./createDropdown";
import createCheckbox from "./createCheckbox";

export function buildUI(container: HTMLElement) {
  container.innerHTML = "";

  // Map group name -> <section>
  const groupSections = new Map<string, HTMLElement>();

  function getSection(groupName: string): HTMLElement {
    let section = groupSections.get(groupName);
    if (!section) {
      section = document.createElement("section");

      const header = document.createElement("h3");
      header.textContent = groupName;
      section.appendChild(header);

      groupSections.set(groupName, section);
      container.appendChild(section);
    }
    return section;
  }

  for (const [paramId, def] of Object.entries(paramDefs)) {
    if (def.control === "none") continue; // no UI for this param

    const group = def.group ?? "Misc";
    const section = getSection(group);
    const label = def.label ?? paramId;

    if (def.control === "slider") {
      const ctrl: SliderControl = {
        kind: "slider",
        group,
        paramId,
        label,
        min: def.slider.min,
        max: def.slider.max,
        step: def.slider.step,
        defaultValue: def.default as number,
      };
      section.appendChild(createSlider(ctrl));
    } else if (def.control === "checkbox") {
      const ctrl: CheckboxControl = {
        kind: "checkbox",
        group,
        paramId,
        label,
        defaultValue: def.default as boolean,
      };
      section.appendChild(createCheckbox(ctrl));
    } else if (def.control === "dropdown") {
      const ctrl: DropdownControl<string> = {
        kind: "dropdown",
        group,
        paramId,
        label,
        options: def.dropdown.options.map((value) => ({
          value,
          label: value,
        })),
        defaultValue: def.default as string,
      };
      section.appendChild(createDropdown(ctrl));
    }
  }
}