/**
 * Dispose geometries, materials, and textures on a Three.js object tree.
 */
export function disposeObject(root) {
    if (!root) return;

    const geometries = new Set();
    const materials = new Set();
    const textures = new Set();

    root.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);

        const list = Array.isArray(object.material) ? object.material : [object.material];
        list.filter(Boolean).forEach((material) => {
            materials.add(material);
            Object.values(material).forEach((value) => {
                if (value?.isTexture) textures.add(value);
            });
        });

        if (object.isInstancedMesh) object.dispose();
    });

    textures.forEach((texture) => texture.dispose());
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());

    root.clear?.();
}
