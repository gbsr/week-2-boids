// @ts-nocheck
import { state } from "../state/state";
import factoryPresets from "./factoryPresets.json";

export function loadDefaultPresetIntoState() {
  try {
    const STORAGE_KEY = "boidPresets";

    let presets: any;
    const fromStorage = localStorage.getItem(STORAGE_KEY);

    if (fromStorage) {
      // use whatever is already there
      presets = JSON.parse(fromStorage);
    } else {
      // first run: seed localStorage with factory presets
      presets = factoryPresets;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(factoryPresets));
    }

    if (!presets || !presets.default) return;

    // apply the "default" preset to state
    const saved = presets.default;
    for (const key of Object.keys(saved)) {
      (state.params as any)[key] = saved[key];
    }

    state.needsTrailReset = true;
    state.needsBoidReinit = true;
  } catch (err) {
    console.error("Failed to load default preset:", err);
  }
}