import type { UIControl } from "../../interface/controlTypes";
import createSlider from "./createSlider"
import createDropdown from "./createDropdown"

export function buildUI(controls: UIControl[], container: HTMLElement) {
  // Clear container
  container.innerHTML = "";

  // Group by group-label
  const groups = new Map<string, UIControl[]>();
  for (const c of controls) {
    const g = c.group ?? "Misc";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(c);
  }

  // Build each group as a <section>
  for (const [groupName, groupControls] of groups) {
    const section = document.createElement("section");
    const header  = document.createElement("h3");
    header.textContent = groupName;
    section.appendChild(header);

    for (const control of groupControls) {
      if (control.kind === "slider") {
        section.appendChild(createSlider(control));
      } else if (control.kind === "dropdown") {
        section.appendChild(createDropdown(control));
      }
    }

    container.appendChild(section);
  }
}


