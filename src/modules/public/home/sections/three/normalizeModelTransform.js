import { Box3, Vector3 } from 'three';

/**
 * Center the model on XZ and seat it on y = 0.
 * If height is far outside a residence-like range, normalize toward targetHeight.
 */
export function normalizeModelTransform(root, { targetHeight = 11, minHeight = 2.5, maxHeight = 60 } = {}) {
    root.updateMatrixWorld(true);

    let box = new Box3().setFromObject(root);
    let size = box.getSize(new Vector3());
    let center = box.getCenter(new Vector3());

    root.position.x -= center.x;
    root.position.z -= center.z;
    root.position.y -= box.min.y;
    root.updateMatrixWorld(true);

    box = new Box3().setFromObject(root);
    size = box.getSize(new Vector3());

    if (size.y > 0 && (size.y < minHeight || size.y > maxHeight)) {
        const scale = targetHeight / size.y;
        root.scale.multiplyScalar(scale);
        root.updateMatrixWorld(true);
        box = new Box3().setFromObject(root);
        size = box.getSize(new Vector3());
        root.position.y -= box.min.y;
        root.updateMatrixWorld(true);
        box = new Box3().setFromObject(root);
    }

    return {
        box,
        size: box.getSize(new Vector3()),
        center: box.getCenter(new Vector3()),
    };
}
