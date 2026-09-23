/**
 * Lightweight material / shadow configuration for authored GLB materials.
 * Does not overwrite materials — only gentle renderer-friendly corrections.
 */
export function configureModelMaterials(root, {
    enableShadows = false,
    maxShadowMeshes = 120,
} = {}) {
    let meshCount = 0;
    let triangleEstimate = 0;
    let shadowBudget = 0;

    root.traverse((object) => {
        if (!object.isMesh && !object.isSkinnedMesh) return;

        meshCount += 1;
        const geometry = object.geometry;
        if (geometry?.index) {
            triangleEstimate += geometry.index.count / 3;
        } else if (geometry?.attributes?.position) {
            triangleEstimate += geometry.attributes.position.count / 3;
        }

        object.frustumCulled = true;

        if (enableShadows && shadowBudget < maxShadowMeshes) {
            object.castShadow = true;
            object.receiveShadow = true;
            shadowBudget += 1;
        }

        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.filter(Boolean).forEach((material) => {
            // Preserve authored look; only nudge glass-like materials toward smoked architecture glass.
            const name = `${material.name || ''} ${object.name || ''}`.toLowerCase();
            const looksLikeGlass = material.transparent
                || material.transmission > 0
                || /glass|glazing|window|pane/.test(name);

            if (looksLikeGlass) {
                if (material.opacity === undefined || material.opacity > 0.92) {
                    material.opacity = Math.min(material.opacity ?? 1, 0.78);
                    material.transparent = true;
                }
                if (material.roughness !== undefined && material.roughness < 0.05) {
                    material.roughness = 0.12;
                }
                if (material.metalness !== undefined && material.metalness > 0.9) {
                    material.metalness = 0.35;
                }
                if (material.depthWrite === undefined) {
                    material.depthWrite = false;
                }
            }

            material.needsUpdate = true;
        });
    });

    if (import.meta.env.DEV && triangleEstimate > 300_000) {
        console.warn(
            `[Rosewood 3D] Loaded model is heavy (~${Math.round(triangleEstimate).toLocaleString()} triangles across ${meshCount} meshes). Consider Draco/meshopt and 1K–2K textures.`,
        );
    }

    return { meshCount, triangleEstimate };
}
