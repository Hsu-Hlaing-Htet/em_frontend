/**
 * Rosewood future-residence cinematic showcase helpers.
 *
 * User-facing priority (ExploreRosewood3D.vue):
 *   1. Professional GLB  → RosewoodBuildingScene
 *   2. Pre-rendered 360   → Rosewood360Viewer
 *   3. Cinematic video    → RosewoodCinematicVideo
 *   4. Cinematic images   → RosewoodCinematicShowcase
 *   5. Premium static poster
 *
 * Procedural createPrototypeBuilding() is DEV-ONLY
 * (localStorage rosewood-procedural=1 or VITE_ROSEWOOD_ALLOW_PROCEDURAL=true).
 */
export { ROSEWOOD_MODEL_URL, ROSEWOOD_MODEL_GUIDELINES } from './modelPath';
export {
    ROSEWOOD_POSTER_URL,
    ROSEWOOD_VIDEO_WEBM,
    ROSEWOOD_VIDEO_MP4,
    ROSEWOOD_360_DIR,
    ROSEWOOD_360_GUIDELINES,
    allowProceduralFallback,
    detectShowcaseMode,
    buildFrameUrl,
} from './showcaseAssets';
export { CINEMATIC_VIEWS, CINEMATIC_EDITORIAL, HERO_BUILDING } from './cinematicViews';
export { loadRosewoodModel, rosewoodModelExists } from './loadRosewoodModel';
export { normalizeModelTransform } from './normalizeModelTransform';
export { fitCameraToModel } from './fitCameraToModel';
export { configureLoadedModel, configureModelMaterials } from './configureLoadedModel';
export { disposeLoadedModel, disposeObject } from './disposeLoadedModel';
export { createPrototypeBuilding } from './createPrototypeBuilding';
export { createSceneEnvironment, createDuskBackgroundTexture } from './createSceneEnvironment';
