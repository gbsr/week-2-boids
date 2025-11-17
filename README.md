
# About

[](https://github.com/gbsr/week-1-marching-ants-selection-tool/blob/main/README.md#about)

I’m  **Anders Hofsten** , a junior frontend devoloper building 1 coding thing per week for 52 weeks.

This is  **Week 2** .

# Boids Simulation

*Week 2 — 52 Weeks of Code Challenge*

This week focused more on **architecture**: building a scalable simulation core, a dynamic parameter/UI system, preset management, and a clean render/update separation. A large part of the work was intentionally systems-level, reinforcing how to design maintainable creative-tooling foundations. I co-developed several architectural decisions with AI to simulate working inside a senior codebase and keep the learning honest.

Yes, I do not understand all the math but I do understand how this works, why it works and I can extend it (and I plan to do so most likely, but I digress). The math will come.

## Demo

**Live:** https://gbsr.github.io/week-2-boids/

---

# Features

### Core Simulation

- Basic flocking behavior (separation, alignment, cohesion)
- Configurable movement parameters (speed, force, wander)
- Edge wrapping
- Trail rendering via offscreen canvas
- Cached Path2D geometry for boid shapes

### Dynamic UI System

- Auto-generated parameter controls from a `paramDefs` schema
- Categories (Simulation / Interaction / Visuals) created programmatically
- Zero manual DOM repetition

### Preset System

- Factory presets stored in JSON
- LocalStorage seeding on first load
- Auto-populated preset dropdown list
- Load / Save / Export / Import
- Applying a preset triggers controlled reinit flags (boids, trails)

### Architecture Focus

- Single source of truth for state
- Clear separation between state, update, render, UI, and presets
- Intentional mutation through explicit flags
- Predictable initialization and reinitialization sequence

---

# Why I built this

Week 2 of my **[52 Weeks of Code](https://github.com/gbsr/52-weeks-of-code)** challenge.

Goals:

- Scalable architecture for creative tools
- Dynamic UI generation from definitions
- Working with state-driven systems
- Preset pipelines and hydration
- Disciplined ordering of initialization
- Maintaining clarity across multiple modules

The simulation was the vehicle, albeit WAY to much fun and stole WAY too much time *cough*
The real focus was **systems engineering**, **structure**, and **maintainability**.

I also intentionally co-developed with AI this week, not as a shortcut, but to mirror a pair-programming workflow inside a larger conceptual codebase. The point was to practice architectural reasoning, not to avoid work.

---

# Tech Stack

- TypeScript
- Vite
- HTML Canvas
- Offscreen canvas for trails
- GitHub Pages (deployment)

---

# Post-Mortem (Week 2)

## Key Concepts Practiced

### Architecture & Systems

- Parameter definition → UI → state pipeline
- Automatic UI creation
- State flags
- Controlled mutation and predictable flow
- Modular separation of state, UI, render, simulation
  (Bonus: Creative coding effects :) )

### Rendering & Simulation

- Decoupled update and render steps
- Path2D caching for performance* (note to self)
- Explicit force calculations (clear, readable math)
- Reducing per-frame allocation

    ***Path2D caching**

    Boid shapes never change per frame, so rebuilding the Path2d geometry (moveto/lineto) for every boid on every render is wasted resources.
	I cache each shape's Path2d once in a WeakMap and reuse it every frame. The render loop only applies transforms (translate/rotate/scale)
	and draws the cached path, which avoids thousands of per-frame allocations and keeps the simulation fairly fast even at high boid counts.

### Integration & Bootstrapping

- Hydration from JSON presets
- LocalStorage seeding on first run
- Strict ordering: state → presets → boids → render

---

## What worked

- Dynamic UI builder simplifies adding parameters
- Preset handling ended up clean and extensible
- Architecture is ready to scale with new behaviors
- Render loop remained stable at high boid counts
- Separation of concerns stayed intact

## What hurt

- Timing/order issues during early init
- Config tuning required frequent resets
- Trails required careful handling and was also way too much to play with
- Neighbor lookup debugging took time
- Math. I suck at math. No, I really do
- globalComposites. Some of them literally halted my entire computer to a full stop

## Lessons Learned

- Rapid prototyping is a thing, but takes time to 'fix' later
- Stop going on tangents (spent hours implementing clone stamping because I wanted a specific look, which was NOT the task at all haha!)
- Keep state mutation explicit and controlled
- Semantic bugs is a thing
- Build architecture before layering complexity

---

# Run Locally

```
npm install
npm run dev
```


## **Next Steps / Stretch Ideas**

* Implement perception radius in order to introduce predators and other things to avoid
* Severall different theme particles rendered at the same time
* Pause, slow motion, for taking screenshots/analyzing simulation
* Touch interaction support for  mobile
* Play with composite render modes
* Play with typical video render techniques from VJ software ^^
* Scene-manager for launching different  presets on keypress?

## **Contact / Follow**

* **Portfolio** : [https://andershofsten.com](https://github.com/gbsr/week-1-marching-ants-selection-tool/blob/main)
* **Threads** : [https://www.threads.com/@ruido_outpost](https://github.com/gbsr/week-1-marching-ants-selection-tool/blob/main)
* **LinkedIn** : [https://www.linkedin.com/in/ahofsten/](https://github.com/gbsr/week-1-marching-ants-selection-tool/blob/main)
* **X** : [https://x.com/soundsbyhofsten](https://github.com/gbsr/week-1-marching-ants-selection-tool/blob/main)

Feel free to DM — I’m always open to feedback or discussion.
