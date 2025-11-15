import { paramDefs } from "../../config/paramDefaults";
import type {
  SliderControl,
  DropdownControl,
  CheckboxControl,
  SpacerControl,
} from "../../interface/controlTypes";

import createSlider from "./createSlider";
import createDropdown from "./createDropdown";
import createCheckbox from "./createCheckbox";
import createSpacer from "./createSpacer";

export function buildUI(container: HTMLElement) {
  container.innerHTML = "";

  // Map group name -> { section, content }
  const groupSections = new Map<
    string,
    { section: HTMLElement; content: HTMLElement }
  >();

  function getSection(groupName: string): HTMLElement {
    let entry = groupSections.get(groupName);

    if (!entry) {
      const section = document.createElement("section");
      section.classList.add("param-group");

      // clickable header with chevron + title
      const header = document.createElement("button");
      header.type = "button";
      header.classList.add("param-group-header");

      const chevron = document.createElement("span");
      chevron.classList.add("param-group-chevron");
      chevron.textContent = "▾";

      const title = document.createElement("span");
      title.classList.add("param-group-title");
      title.textContent = groupName;

      header.appendChild(chevron);
      header.appendChild(title);
      section.appendChild(header);

      // content wrapper for controls
      const content = document.createElement("div");
      content.classList.add("param-group-content");
      section.appendChild(content);

      // toggle collapse on click
      header.addEventListener("click", () => {
        const collapsed = section.classList.toggle("collapsed");
        chevron.textContent = collapsed ? "▸" : "▾";
      });

      entry = { section, content };
      groupSections.set(groupName, entry);
      container.appendChild(section);
    }

    // we always append controls into the content div
    return entry.content;
  }

  for (const [paramId, def] of Object.entries(paramDefs)) {
    if (def.control === "none") continue; // no UI for this param

    const group = def.group ?? "Misc";
    const section = getSection(group);
    const label = "label" in def ? def.label ?? paramId : paramId;

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
    } else if (def.control === "spacer") {
      const ctrl: SpacerControl = {
        kind: "spacer",
        group,
        paramId,
        label,
      };
      section.appendChild(createSpacer());
    }
  }
}