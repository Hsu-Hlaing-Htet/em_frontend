# Rosewood future-residence model folder

## Drop the GLB here

```text
rosewood-future-residence.glb
```

Full path:

```text
frontend/public/models/rosewood/rosewood-future-residence.glb
```

See **MODEL_SPEC.md** for full architectural / performance requirements.

## Showcase priority (Landing Page)

1. This GLB (Mode A — interactive architectural viewer)
2. Pre-rendered 360 sequence at `frontend/public/media/rosewood/future-residence-360/`
3. Cinematic video at `frontend/public/media/rosewood/future-residence-showcase.webm` (or `.mp4`)
4. Premium static poster at `frontend/public/media/rosewood/future-residence-poster.webp`

Procedural `createPrototypeBuilding` is **developer-only** (`localStorage rosewood-procedural=1`).

## Optional Draco

Host decoder wasm under `frontend/public/draco/` and enable `dracoDecoderPath` in the loader when ready.
