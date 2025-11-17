import { paramDefs } from "../../config/paramDefaults";
import { state } from "../../state/state";
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

type PresetMap = Record<string, Record<string, any>>;

function loadPresetsFromStorage(): PresetMap {
  try {
    const raw = localStorage.getItem("boidPresets");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as PresetMap;
    }
    return {};
  } catch {
    return {};
  }
}

function savePresetsToStorage(presets: PresetMap) {
  try {
    localStorage.setItem("boidPresets", JSON.stringify(presets));
  } catch {
    // ignore quota or parse errors for now
  }
}

export function buildUI(container: HTMLElement) {
  container.innerHTML = "";

  // registry: paramId -> form control for syncing on preset load
  const controlsByParam = new Map<string, HTMLInputElement | HTMLSelectElement>();

  // ---------- PRESET UI ----------
  const presetWrapper = document.createElement("div");
  presetWrapper.classList.add("preset-bar");

  const presetTitle = document.createElement("div");
  presetTitle.classList.add("preset-title");
  presetTitle.textContent = "Presets";

  const presetRow1 = document.createElement("div");
  presetRow1.classList.add("preset-row");

  const presetSelect = document.createElement("select");
  presetSelect.classList.add("preset-select");

  const loadButton = document.createElement("button");
  loadButton.type = "button";
  loadButton.classList.add("preset-btn");
  loadButton.textContent = "Load";

  presetRow1.appendChild(presetSelect);
  presetRow1.appendChild(loadButton);

  const presetRow2 = document.createElement("div");
  presetRow2.classList.add("preset-row");

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.classList.add("preset-name");
  nameInput.placeholder = "Preset name";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.classList.add("preset-btn");
  saveButton.textContent = "Save";

  const presetRow3 = document.createElement("div");
  presetRow3.classList.add("preset-row");

  const exportButton = document.createElement("button");
  exportButton.type = "button";
  exportButton.classList.add("preset-btn");
  exportButton.textContent = "Export";

  const importButton = document.createElement("button");
  importButton.type = "button";
  importButton.classList.add("preset-btn");
  importButton.textContent = "Import";

  const importFileInput = document.createElement("input");
  importFileInput.type = "file";
  importFileInput.accept = "application/json";
  importFileInput.style.display = "none";

  presetRow2.appendChild(nameInput);
  presetRow2.appendChild(saveButton);
  presetRow2.appendChild(exportButton);
  presetRow2.appendChild(importButton);

  presetWrapper.appendChild(presetTitle);
  presetWrapper.appendChild(presetRow1);
  presetWrapper.appendChild(presetRow2);
  presetWrapper.appendChild(importFileInput);

  container.appendChild(presetWrapper);

  // helpers for presets
  let presets: PresetMap = loadPresetsFromStorage();

  function buildSnapshotFromState(): Record<string, any> {
    const snapshot: Record<string, any> = {};
    for (const key of Object.keys(paramDefs)) {
      snapshot[key] = (state.params as any)[key];
    }
    return snapshot;
  }

  function refreshPresetSelect() {
    const current = presetSelect.value;
    presetSelect.innerHTML = "";

    const names = Object.keys(presets);
    if (!names.includes("default")) {
      // virtual default if not stored yet
      names.unshift("default");
    }

    for (const name of names) {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      presetSelect.appendChild(opt);
    }

    if (current && names.includes(current)) {
      presetSelect.value = current;
    } else {
      presetSelect.value = "default";
    }
  }

  function applyPreset(name: string) {
  let data = presets[name];
  if (!data && name === "default") data = buildSnapshotFromState();
  if (!data) return;

  for (const [paramId, value] of Object.entries(data)) {
    (state.params as any)[paramId] = value;
    const ctl = controlsByParam.get(paramId);
    if (!ctl) continue;

    if (ctl instanceof HTMLSelectElement) {
      ctl.value = String(value);
      ctl.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (ctl instanceof HTMLInputElement) {
      if (ctl.type === "checkbox") {
        ctl.checked = Boolean(value);
        ctl.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        ctl.value = String(value);
        ctl.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  }

    // Reset canvas & trails on preset load
    state.needsFullCanvasReset = true;
    state.needsTrailReset = true;
}

  function savePreset(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const snapshot = buildSnapshotFromState();
    presets[trimmed] = snapshot;
    savePresetsToStorage(presets);
    refreshPresetSelect();
    presetSelect.value = trimmed;
  }

  refreshPresetSelect();

  loadButton.addEventListener("click", () => {
    const name = presetSelect.value || "default";
    applyPreset(name);
  });

  saveButton.addEventListener("click", () => {
    const name =
      nameInput.value.trim() || presetSelect.value.trim() || "default";
    savePreset(name);
  });

  exportButton.addEventListener("click", () => {
    const name =
      nameInput.value.trim() || presetSelect.value.trim() || "preset";
    const snapshot = buildSnapshotFromState();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  importButton.addEventListener("click", () => {
    importFileInput.click();
  });

  importFileInput.addEventListener("change", () => {
    const file = importFileInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data || typeof data !== "object") return;
        // infer name from file, fallback to "imported"
        const base = file.name.replace(/\.json$/i, "");
        const name = base || "imported";
        presets[name] = data as Record<string, any>;
        savePresetsToStorage(presets);
        refreshPresetSelect();
        presetSelect.value = name;
        applyPreset(name);
      } catch {
        // ignore parse error for now
      }
    };
    reader.readAsText(file);
    // reset so we can re-import same file later
    importFileInput.value = "";
  });

  // -------------------------------------------
  // Map group name -> { section, content }
  // -------------------------------------------
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

      //start collapsed
      section.classList.add("collapsed");

      // toggle collapse on click
      header.addEventListener("click", () => {
        const collapsed = section.classList.toggle("collapsed");
        chevron.textContent = collapsed ? "▸" : "▾";
      });

      entry = { section, content };
      groupSections.set(groupName, entry);
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
      const el = createSlider(ctrl);
      section.appendChild(el);

      const input = el.querySelector("input[type='range']") as HTMLInputElement | null;
      if (input) controlsByParam.set(paramId, input);
    } else if (def.control === "checkbox") {
      const ctrl: CheckboxControl = {
        kind: "checkbox",
        group,
        paramId,
        label,
        defaultValue: def.default as boolean,
      };
      const el = createCheckbox(ctrl);
      section.appendChild(el);

      const input = el.querySelector("input[type='checkbox']") as HTMLInputElement | null;
      if (input) controlsByParam.set(paramId, input);
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
      const el = createDropdown(ctrl);
      section.appendChild(el);

      const selectEl = el.querySelector("select") as HTMLSelectElement | null;
      if (selectEl) controlsByParam.set(paramId, selectEl);
    } else if (def.control === "spacer") {
      const ctrl: SpacerControl = {
        kind: "spacer",
        group,
        paramId,
        label,
      };
      const el = createSpacer();
      section.appendChild(el);
      // no control to track
    }
  }

    // After all controls are created:
  // only append groups that actually contain controls.
  for (const { section, content } of groupSections.values()) {
    if (content.children.length > 0) {
      container.appendChild(section);
    }
  }

  // 🔹 auto-load "default" preset on startup if it exists
  if (presets["default"]) {
    presetSelect.value = "default";
    applyPreset("default");
  }
}