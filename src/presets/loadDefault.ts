//@ts-nocheck
// types are correct, because dynamically built from paramDefs
export function loadDefaultPresetIntoState() {
  try {
    const raw = localStorage.getItem("factoryPresets");
    if (!raw) return;
    const presets = JSON.parse(raw);
    if (!presets.default) return;

    const saved = presets.default;
    for (const key of Object.keys(saved)) {
      (state.params as any)[key] = saved[key];
    }

    // reset trails, boid arrays may need reseed
    state.needsTrailReset = true;
    state.needsBoidReinit = true;
  } catch (err) {
    console.error("Failed to load default preset:", err);
  }
}