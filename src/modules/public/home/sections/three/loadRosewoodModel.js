import { ROSEWOOD_MODEL_URL } from './modelPath';
import { normalizeModelTransform } from './normalizeModelTransform';
import { configureModelMaterials } from './configureModelMaterials';

/**
 * Load the Rosewood future-residence GLB (PRIMARY visual path).
 * Throws if missing/invalid — RosewoodBuildingScene falls back to createPrototypeBuilding().
 *
 * Optional Draco: pass `dracoDecoderPath` (e.g. '/draco/') once decoder wasm is hosted locally.
 */
export async function loadRosewoodModel({
    url = ROSEWOOD_MODEL_URL,
    reduceDetail = false,
    enableShadows = !reduceDetail,
    dracoDecoderPath = null,
} = {}) {
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    const loader = new GLTFLoader();

    let dracoLoader = null;
    if (dracoDecoderPath) {
        const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js');
        dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(dracoDecoderPath);
        loader.setDRACOLoader(dracoLoader);
    }

    try {
        const gltf = await loader.loadAsync(url);
        const root = gltf.scene || gltf.scenes?.[0];

        if (!root) {
            throw new Error('GLB contained no scene');
        }

        root.name = 'rosewood-glb-residence';
        const bounds = normalizeModelTransform(root);
        const stats = configureModelMaterials(root, { enableShadows });

        return {
            root,
            source: 'glb',
            url,
            bounds,
            stats,
            animations: gltf.animations || [],
        };
    } finally {
        dracoLoader?.dispose?.();
    }
}

/**
 * Probe whether the GLB exists before paying for a full parse.
 * Returns false for 404 / network errors.
 */
export async function rosewoodModelExists(url = ROSEWOOD_MODEL_URL) {
    try {
        const response = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
        if (response.ok) return true;
        // Some static hosts disallow HEAD — try a ranged GET.
        if (response.status === 405 || response.status === 501) {
            const get = await fetch(url, {
                method: 'GET',
                headers: { Range: 'bytes=0-0' },
                cache: 'no-cache',
            });
            return get.ok || get.status === 206;
        }
        return false;
    } catch {
        return false;
    }
}
