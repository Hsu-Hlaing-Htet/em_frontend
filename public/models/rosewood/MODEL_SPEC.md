# Rosewood Future Residence — Professional GLB Spec

## Where to put the file

```text
frontend/public/models/rosewood/rosewood-future-residence.glb
```

**Filename (exact):** `rosewood-future-residence.glb`  
**Public URL:** `/models/rosewood/rosewood-future-residence.glb`

Drop the file in place → hard-refresh the Landing Page → the viewer loads it automatically.  
No code change required for a standard replacement.

If the file is missing or fails to load, the Landing Page uses the next available showcase mode (360 → video → premium poster). The procedural prototype is **developer-only**.

---

## Building type

Premium **boutique luxury residential tower** for Rosewood Royale “Coming Soon” presentation.

Illustrative only — not tied to live inventory counts.

Suggested massing language (original design; do not copy a copyrighted building):

- Slender residential tower (~9–14 floors visual)
- Warm ivory / champagne stone facade
- Charcoal / bronze vertical core or fins
- Floor-to-ceiling smoked glass
- Deep balconies with rails + planter edges
- Landscaped podium + entrance
- Rooftop terrace / garden

---

## Required architectural detail

Must read as a **professional architectural model**, not a game prop:

| Element | Expectation |
|---------|-------------|
| Facade | Real depth: recesses, projecting slabs, fins/frames |
| Windows | Framed / mullioned glazing (not flat black planes) |
| Balconies | Believable depth, slab thickness, railings |
| Entrance | Human-scale lobby/canopy detail |
| Podium | Site base, steps/path, planter volumes |
| Roof | Parapet + terrace landscaping |
| Edges | Visible thickness on slabs, rails, frames |

---

## Materials (separate authored materials)

Export with distinct materials (keep names clear if possible):

- Stone / concrete / facade cladding
- Glass (smoked architectural, not chrome mirror)
- Metal / bronze / charcoal frames
- Wood (entrance / soffits — restrained)
- Vegetation (trees, shrubs, planters)
- Optional warm interior emissive / lit glass (subtle)

The viewer **preserves GLB materials**; it does not flatten them.

---

## Performance targets (web)

| Metric | Ideal | Acceptable | Too heavy |
|--------|-------|------------|-----------|
| Triangles | 80k–150k | up to ~300k | >400k without LOD |
| Meshes | < 200 | < 400 | thousands of tiny meshes |
| Textures | 1024px | 2048px max | 4K/8K sets |
| Texture count | as few atlases as practical | — | dozens of unique 2K maps |
| GLB size | 3–8 MB | up to ~15–20 MB | >25 MB mobile risk |

Prefer:

- Draco or meshopt compression when exporting
- KTX2 / Basis textures later (optional; not required for first drop)
- Merged meshes per material where possible
- Remove cameras, lights, empties, helpers before export

---

## Orientation & scale

- **Y-up**
- **Meters** preferred
- Origin near building center or base center
- Building standing upright on the ground plane
- The viewer auto-centers XZ, seats bottom on `y = 0`, and normalizes extreme scales

Still: export at a sane real-world scale so auto-fit looks best.

---

## Blender export notes (recommended)

1. Apply scale/rotation (`Ctrl+A`)
2. Ensure face normals outward
3. Use Principled BSDF materials
4. Glass: transmission/alpha with reasonable roughness (smoked, not mirror)
5. Join objects by material when practical
6. File → Export → glTF 2.0
   - Format: **glTF Binary (.glb)**
   - Geometry → apply modifiers
   - Compression: **Draco** if available (optional)
7. Test in https://gltf-viewer.donmccurdy.com/ before dropping into the repo

SketchUp / 3ds Max / Rhino: export via a reliable glTF exporter; bake/convert materials carefully; avoid oversized textures.

---

## Optional Draco decoder (later)

If the GLB uses Draco:

1. Host decoder files under `frontend/public/draco/`
2. Pass `dracoDecoderPath: '/draco/'` into `loadRosewoodModel` in `RosewoodBuildingScene.vue`

Do not rely on a third-party CDN from the app by default.

---

## What NOT to provide

- Random free “city block” game assets
- Copyrighted building clones without license
- Photoreal 8K texture packs that blow mobile budgets
- Animated characters / cars / clutter that compete with the tower

---

## Viewer behavior after drop-in

1. **GLB exists** → load → normalize → preserve materials → auto-fit camera  
2. **GLB missing/fail** → procedural fallback (temporary)  
3. **No WebGL** → static poster in the section UI  
