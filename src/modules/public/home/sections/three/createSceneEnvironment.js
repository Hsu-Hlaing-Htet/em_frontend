import {
    CanvasTexture,
    CircleGeometry,
    Group,
    LinearFilter,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PlaneGeometry,
    SRGBColorSpace,
} from 'three';

/**
 * Lightweight dusk studio environment for the future-residence preview.
 * Procedural canvas textures only — no downloads, no post-processing.
 */
export function createSceneEnvironment({ reduceDetail = false } = {}) {
    const environment = new Group();
    environment.name = 'rosewood-scene-environment';

    // Soft radial contact shadow — low contrast, no hard edge.
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d');
    const shadowGrad = shadowCtx.createRadialGradient(64, 64, 4, 64, 64, 64);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.38)');
    shadowGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.16)');
    shadowGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0.05)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shadowCtx.fillStyle = shadowGrad;
    shadowCtx.fillRect(0, 0, 128, 128);
    const shadowMap = new CanvasTexture(shadowCanvas);
    shadowMap.colorSpace = SRGBColorSpace;
    shadowMap.magFilter = LinearFilter;
    shadowMap.minFilter = LinearFilter;

    const contactShadow = new Mesh(
        new CircleGeometry(1, reduceDetail ? 24 : 40),
        new MeshBasicMaterial({
            map: shadowMap,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
        }),
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0.08, 0.028, 0.12);
    contactShadow.scale.set(5.8, 4.6, 1);
    contactShadow.renderOrder = 1;
    environment.add(contactShadow);

    // Extended matte ground that fades into the viewer.
    const ground = new Mesh(
        new CircleGeometry(1, reduceDetail ? 32 : 48),
        new MeshStandardMaterial({
            color: '#15161a',
            roughness: 0.98,
            metalness: 0.02,
        }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.008;
    ground.scale.set(20, 20, 1);
    ground.receiveShadow = true;
    environment.add(ground);

    // Soft near-podium tone (subtle, not a stage).
    const groundNear = new Mesh(
        new CircleGeometry(1, reduceDetail ? 24 : 36),
        new MeshStandardMaterial({
            color: '#1a1c21',
            roughness: 0.97,
            metalness: 0.02,
        }),
    );
    groundNear.rotation.x = -Math.PI / 2;
    groundNear.position.y = 0.014;
    groundNear.scale.set(8.8, 7.4, 1);
    groundNear.receiveShadow = true;
    environment.add(groundNear);

    // Soft horizon glow behind the tower.
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 256;
    glowCanvas.height = 128;
    const glowCtx = glowCanvas.getContext('2d');
    const glowGrad = glowCtx.createRadialGradient(128, 98, 8, 128, 92, 118);
    glowGrad.addColorStop(0, 'rgba(220, 200, 168, 0.28)');
    glowGrad.addColorStop(0.4, 'rgba(140, 148, 168, 0.11)');
    glowGrad.addColorStop(0.75, 'rgba(70, 78, 98, 0.04)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    glowCtx.fillStyle = glowGrad;
    glowCtx.fillRect(0, 0, 256, 128);
    const glowMap = new CanvasTexture(glowCanvas);
    glowMap.colorSpace = SRGBColorSpace;
    glowMap.magFilter = LinearFilter;
    glowMap.minFilter = LinearFilter;

    const horizonGlow = new Mesh(
        new PlaneGeometry(1, 1),
        new MeshBasicMaterial({
            map: glowMap,
            transparent: true,
            opacity: reduceDetail ? 0.5 : 0.62,
            depthWrite: false,
        }),
    );
    horizonGlow.position.set(-1.2, 5.8, -14);
    horizonGlow.scale.set(28, 16, 1);
    horizonGlow.renderOrder = -1;
    environment.add(horizonGlow);

    // No distant skyline — keeps the presentation architectural, not game-like.

    return environment;
}

/** Vertical dusk gradient used as scene.background (no sky photo). */
export function createDuskBackgroundTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 4;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#0f1219');
    gradient.addColorStop(0.4, '#1b1f2a');
    gradient.addColorStop(0.72, '#151820');
    gradient.addColorStop(1, '#0c0d11');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 4, 256);

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.magFilter = LinearFilter;
    texture.minFilter = LinearFilter;
    return texture;
}
