import { Box3, MathUtils, Vector3 } from 'three';

/**
 * Fit an elevated three-quarter architectural camera to a model bounding volume.
 * Works for both GLB and procedural fallback roots.
 */
export function fitCameraToModel(camera, controls, object, {
    fov = 35,
    padding = 1.38,
    azimuthDeg = 42,
    elevationDeg = 28,
} = {}) {
    object.updateMatrixWorld(true);

    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    const vFov = MathUtils.degToRad(fov);
    const aspect = Math.max(camera.aspect || 1, 0.5);
    const fitHeight = size.y > 0 ? (size.y * 0.55) / Math.tan(vFov / 2) : 12;
    const fitWidth = size.x > 0 ? (size.x * 0.55) / Math.tan(vFov / 2) / aspect : 12;
    const distance = Math.max(fitHeight, fitWidth, Math.max(size.x, size.y, size.z) * 1.05) * padding;

    const azimuth = MathUtils.degToRad(azimuthDeg);
    const elevation = MathUtils.degToRad(elevationDeg);

    camera.fov = fov;
    camera.near = Math.max(0.05, distance / 100);
    camera.far = Math.max(200, distance * 20);
    camera.position.set(
        center.x + distance * Math.cos(elevation) * Math.sin(azimuth),
        center.y + distance * Math.sin(elevation) + size.y * 0.08,
        center.z + distance * Math.cos(elevation) * Math.cos(azimuth),
    );
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    controls.minDistance = distance * 0.62;
    controls.maxDistance = distance * 2.35;
    controls.minPolarAngle = Math.PI / 5.5;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.update();

    return { center, size, distance };
}
