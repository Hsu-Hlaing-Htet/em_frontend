/**
 * Public URL for the Rosewood future-residence architectural model.
 *
 * Place the optimized file at:
 *   frontend/public/models/rosewood/rosewood-future-residence.glb
 *
 * Until that file exists, ExploreRosewood3D shows the premium poster.
 * Procedural createPrototypeBuilding() is DEV-ONLY — do not polish it further.
 */
export const ROSEWOOD_MODEL_URL = '/models/rosewood/rosewood-future-residence.glb';

/**
 * Recommended GLB optimization targets for this viewer.
 * See also: public/models/rosewood/MODEL_SPEC.md
 */
export const ROSEWOOD_MODEL_GUIDELINES = Object.freeze({
    filename: 'rosewood-future-residence.glb',
    publicPath: '/models/rosewood/rosewood-future-residence.glb',
    diskPath: 'frontend/public/models/rosewood/rosewood-future-residence.glb',
    format: 'GLB (binary glTF 2.0)',
    upAxis: 'Y-up',
    units: 'meters (preferred)',
    preferredTriangles: 150_000,
    maxRecommendedTriangles: 300_000,
    preferredTextureSize: 1024,
    maxTextureSize: 2048,
    preferredFileSizeMb: 8,
    maxFileSizeMb: 20,
});
