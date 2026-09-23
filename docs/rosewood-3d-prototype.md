# Rosewood 3D prototype

This experiment adds one section between the Rent / Sale gateway and Selected
from Live Inventory. No backend, AI service, routes, or shared styles changed.

## Start here

1. Run `npm run dev` from `frontend`, if the development server is not already running.
2. Open `http://localhost:5173/` and scroll below the Rent / Sale cards.
3. Drag the building, use the mouse wheel, and select the four information buttons.
4. On touch screens, drag sideways to rotate; swipe vertically to scroll the page.

## Files and responsibilities

- `src/modules/public/home/Home.vue`: passes data from its existing requests;
  inserts the new section. It contains no Three.js code.
- `src/modules/public/home/sections/ExploreRosewood3D.vue`: HTML layout, information
  buttons, real-data copy, poster, visibility observer, and lazy scene import.
- `src/modules/public/home/sections/RosewoodBuildingScene.vue`: scene, camera,
  renderer, lights, OrbitControls, resize, animation loop, error handling, cleanup.
- `src/modules/public/home/sections/three/createPrototypeBuilding.js`: only the
  illustrative geometry. It has no property data or API access.

Only `three` was added (0.186.0 at implementation time). OrbitControls ships with
Three.js; it is not another dependency. No local GLB, GLTF, OBJ or FBX was found.

## How the scene works

A **scene** holds the objects and lights. A **perspective camera** is the viewpoint.
The **renderer** draws that view onto a canvas. **OrbitControls** moves the camera
around a fixed target, making the building appear to rotate.

The temporary model uses boxes for two masses, slabs, a podium, roof, planters and
a burgundy entrance canopy. Repeated windows use instancing (many copies drawn
efficiently). These are illustrative shapes, not real floors, units or amenities.
There are two lights, no texture downloads, no real-time shadows and no effects.

Mouse drag rotates with damping. Mouse wheel zoom has a low speed and distance
limits of 14–28 scene units. Panning is disabled. Idle rotation is very slow
(`autoRotateSpeed = 0.25`), stops while dragging, and can resume after five seconds.
The explicit pause button remains paused until the visitor resumes it. Focus on
information buttons also pauses rotation while the visitor is using them.

The four hotspots are ordinary HTML buttons overlaid along the viewer's bottom
edge. They do not represent specific floors or units. They work with keyboard,
touch, mouse, and without WebGL. Their selected information is HTML outside the
canvas and announced through a polite live region. Raycasting is unnecessary.

## Real data and its limitations

No extra API requests are made. `Home.vue` passes:

- Available Units: `statsRes.data.data.available`. The Laravel implementation
  defines this as **available rental residences**, so the panel says that explicitly.
- For Rent: `rentWide.data.meta.total` from the existing rental request.
- For Sale: `saleWide.data.meta.total` from the existing sale request.
- Building Info: the first loaded featured/live property with an ID and name,
  followed by inventory as a fallback; its real name and location are displayed.

Counts describe public inventory across buildings. They are not the count of
windows in this model or the availability in the associated residence's building.
Pagination totals are used instead of the loaded page lengths (48 per purpose).
Missing values show neutral navigation copy, not invented counts or a false zero.

The public API currently exposes `property_name` as **building name + room number**,
not a separate building object/ID/name. We preserve that complete name and label
it as a residence from live inventory; we do not try to split or guess a building
name. Its link uses the existing `property-detail` route with the real ID and
purpose. Rental and available-rental links use `/rent`; sale links use `/buy`.

## Loading, fallback, performance and accessibility

The section's content and poster are visible by default, with no reveal classes.
The existing hero photograph is reused as a decorative poster. A fixed responsive
viewer height reserves space before the scene loads. An IntersectionObserver
starts the dynamic import within 200px of the section. This import also defers
Three.js. The canvas replaces the poster only after a successful first render.

Import failure, WebGL initialization failure, rendering errors and context loss
return to the poster. If the photograph itself fails, a styled text fallback is
shown. Information and navigation remain usable in every fallback state.

Pixel ratio is capped at 1.5 and rendering is limited to about 30fps. The animation
loop stops when the section leaves its observer margin or the tab is hidden.
ResizeObserver updates the canvas size, camera aspect ratio and projection.

On mobile the copy stacks above the viewer (380–420px tall). `touch-action: pan-y`
lets normal vertical scrolling continue while horizontal dragging rotates. Coarse
pointer devices have scene zoom disabled; two-finger scene gestures are disabled.
With reduced motion, automatic rotation and damping are disabled, the initial
view is static, and manual interaction still works. Preference changes are live.

On unmount, the code stops animation, disconnects observers, removes listeners,
disposes controls, shared geometries/materials/textures and instancing resources,
disposes the renderer, releases its WebGL context, and removes the canvas. A
pending module import checks whether its parent was unmounted before attaching.

## Replace the prototype with a real GLB later

Place the approved asset here:

`frontend/public/models/rosewood-building.glb`

Its browser URL will be `/models/rosewood-building.glb` (omit `public` from the URL).

Change **RosewoodBuildingScene.vue**, specifically the area marked
`// Building prototype` and this line:

```js
scene.add(createPrototypeBuilding());
```

Use Three.js's included loader:

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
```

Make initialization asynchronous, load with
`await new GLTFLoader().loadAsync('/models/rosewood-building.glb')`, and add the
returned `gltf.scene` in place of the factory's group. Keep the import/load inside
the current lazy scene lifecycle and error handler; show the poster until the
model has loaded and its first frame has rendered.

Before adding the GLB, use `Box3` to measure it, scale it uniformly to fit roughly
7.4 units wide × 7.8 high × 5.8 deep, center X/Z around zero, and place its base at
Y=0. This keeps the current camera target and distance limits useful. Validate
framing at the minimum and maximum zoom, especially on mobile.

Because loading is asynchronous, check `stopped` after the load resolves. If the
component has already unmounted, dispose the loaded model instead of adding it.
Extract/reuse the existing disposal traversal for that case, including textures.
Animated/skinned models may also require skeleton disposal. Keep the asset simple
and optimized for this prototype; loaders for compression formats are not added.

Remove the factory import when it is no longer used. The section, live-data props,
HTML hotspots, routing, fallback and observer architecture can remain unchanged.
Only remove/change the illustrative-model caption when the approved asset is
verified to match the residence/building represented by the real data.

Reference: https://threejs.org/docs/pages/OrbitControls.html
