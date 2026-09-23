<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
    ACESFilmicToneMapping,
    DirectionalLight,
    HemisphereLight,
    PCFSoftShadowMap,
    PerspectiveCamera,
    Scene,
    SRGBColorSpace,
    WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { disposeLoadedModel } from './three/disposeLoadedModel';
import { fitCameraToModel } from './three/fitCameraToModel';
import { loadRosewoodModel, rosewoodModelExists } from './three/loadRosewoodModel';
import { createPrototypeBuilding } from './three/createPrototypeBuilding';
import { createDuskBackgroundTexture, createSceneEnvironment } from './three/createSceneEnvironment';
import { ROSEWOOD_MODEL_URL } from './three/modelPath';
import { allowProceduralFallback } from './three/showcaseAssets';

const props = defineProps({
    active: Boolean,
    rotating: Boolean,
    paused: Boolean,
});
const emit = defineEmits(['ready', 'error']);
const host = ref(null);
let scene, camera, renderer, controls, resizeObserver;
let motionQuery, touchQuery;
let residenceRoot = null;
let frame = 0;
let previousTime = 0;
let resumeAt = 0;
let interacting = false;
let stopped = false;
let baseFov = 35;

function stopLoop() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
}

function fail(error) {
    if (stopped) return;
    stopped = true;
    stopLoop();
    if (import.meta.env.DEV) console.warn('Residence preview unavailable:', error);
    emit('error');
}

function onContextLost(event) {
    event.preventDefault();
    fail(new Error('WebGL context lost'));
}

function onStart() {
    interacting = true;
    controls.autoRotate = false;
    controls.enableDamping = !motionQuery.matches;
}

function onEnd() {
    interacting = false;
    resumeAt = performance.now() + 5000;
    if (props.paused || !props.rotating) {
        haltResidualMotion();
    }
}

function haltResidualMotion() {
    if (!controls) return;
    controls.autoRotate = false;
    // One undamped update clears residual OrbitControls motion so pause is a true stop.
    controls.enableDamping = false;
    controls.update();
}

function updateInputPreferences() {
    if (!controls) return;
    if (!(props.paused || !props.rotating)) {
        controls.enableDamping = !motionQuery.matches;
    }
    controls.enableZoom = !touchQuery.matches;
    controls.touches.TWO = null;
    // Horizontal touch dragging rotates; vertical gestures scroll the page normally.
    renderer.domElement.style.touchAction = 'pan-y';
    if (motionQuery.matches) controls.autoRotate = false;
}

function resize() {
    if (!renderer || stopped) return;
    try {
        const { width, height } = host.value.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, reduceDetailActive ? 1.25 : 1.5));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.fov = width < height ? Math.min(baseFov + 7, 44) : baseFov;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    } catch (error) {
        fail(error);
    }
}

let reduceDetailActive = false;

function animate(time) {
    frame = 0;
    if (stopped || !props.active || document.hidden) return;
    if (previousTime && time - previousTime < 1000 / 30) {
        frame = requestAnimationFrame(animate);
        return;
    }
    try {
        const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.1) : 1 / 30;
        previousTime = time;
        const shouldRotate = props.rotating && !props.paused && !motionQuery.matches
            && !interacting && time >= resumeAt;
        controls.autoRotate = shouldRotate;
        controls.update(delta);
        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
    } catch (error) {
        fail(error);
    }
}

function updateLoop() {
    stopLoop();
    if (renderer && !stopped && props.active && !document.hidden) {
        frame = requestAnimationFrame(animate);
    }
}

function applyProceduralFallback(reduceDetail) {
    residenceRoot = createPrototypeBuilding({ reduceDetail });
    scene.add(residenceRoot);
    baseFov = 35;
    camera.fov = baseFov;
    camera.position.set(13.35, 10.15, 17.2);
    controls.target.set(0, 5.45, 0);
    controls.minDistance = 15.5;
    controls.maxDistance = 31;
    controls.minPolarAngle = Math.PI / 5.2;
    controls.maxPolarAngle = Math.PI / 2.15;
    camera.updateProjectionMatrix();
    controls.update();
    return 'procedural';
}

async function mountResidence(reduceDetail) {
    const enableShadows = !reduceDetail;

    if (await rosewoodModelExists()) {
        try {
            const loaded = await loadRosewoodModel({
                reduceDetail,
                enableShadows,
                // Optional later: dracoDecoderPath: '/draco/',
            });
            if (stopped) {
                disposeLoadedModel(loaded.root);
                return null;
            }
            residenceRoot = loaded.root;
            scene.add(residenceRoot);
            baseFov = 35;
            fitCameraToModel(camera, controls, residenceRoot, { fov: baseFov });
            return 'glb';
        } catch (error) {
            if (import.meta.env.DEV) {
                console.info('Rosewood GLB failed to load.', error);
            }
        }
    }

    // Procedural BoxGeometry is DEV-ONLY. Normal users fall back to cinematic images.
    if (allowProceduralFallback()) {
        if (import.meta.env.DEV) {
            console.info(
                `Rosewood GLB missing at ${ROSEWOOD_MODEL_URL} — developer procedural prototype active.`,
            );
        }
        return applyProceduralFallback(reduceDetail);
    }

    // Expected when this scene is mounted without a GLB — silent, clean fallback.
    emit('error');
    stopped = true;
    return null;
}

watch(() => props.active, updateLoop);
watch(
    () => [props.paused, props.rotating],
    ([paused, rotating]) => {
        if (!controls) return;
        if (paused || !rotating) {
            haltResidualMotion();
        } else {
            resumeAt = performance.now() + 5000;
            controls.enableDamping = !motionQuery.matches;
        }
    },
);

onMounted(async () => {
    try {
        scene = new Scene();
        scene.background = createDuskBackgroundTexture();

        camera = new PerspectiveCamera(35, 1, 0.1, 200);
        camera.position.set(13.35, 10.15, 17.2);

        reduceDetailActive = window.matchMedia('(pointer: coarse)').matches
            || Math.min(window.innerWidth, window.innerHeight) < 700;

        renderer = new WebGLRenderer({ antialias: !reduceDetailActive, powerPreference: 'low-power' });
        renderer.outputColorSpace = SRGBColorSpace;
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.18;
        renderer.domElement.setAttribute('aria-hidden', 'true');
        renderer.domElement.addEventListener('webglcontextlost', onContextLost);
        host.value.appendChild(renderer.domElement);

        if (!reduceDetailActive) {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = PCFSoftShadowMap;
        }

        // Warmer presentation lighting so champagne facade and amber windows read clearly.
        scene.add(new HemisphereLight('#fff4e6', '#32363f', 1.35));
        const keyLight = new DirectionalLight('#ffe2b8', 2.95);
        keyLight.position.set(-7.5, 14, 8);
        if (!reduceDetailActive) {
            keyLight.castShadow = true;
            keyLight.shadow.mapSize.set(1024, 1024);
            keyLight.shadow.camera.near = 1;
            keyLight.shadow.camera.far = 60;
            keyLight.shadow.camera.left = -18;
            keyLight.shadow.camera.right = 18;
            keyLight.shadow.camera.top = 18;
            keyLight.shadow.camera.bottom = -18;
            keyLight.shadow.bias = -0.00025;
        }
        scene.add(keyLight);
        const fillLight = new DirectionalLight('#d7e0ec', 0.55);
        fillLight.position.set(7.5, 5, -4.5);
        scene.add(fillLight);
        const rimLight = new DirectionalLight('#f0d8b0', 0.52);
        rimLight.position.set(2, 6, -8);
        scene.add(rimLight);
        const bounceLight = new DirectionalLight('#f5e6cf', 0.28);
        bounceLight.position.set(0, -2, 6);
        scene.add(bounceLight);

        scene.add(createSceneEnvironment({ reduceDetail: reduceDetailActive }));

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.065;
        controls.rotateSpeed = 0.42;
        controls.zoomSpeed = 0.4;
        controls.autoRotateSpeed = 0.18;
        controls.addEventListener('start', onStart);
        controls.addEventListener('end', onEnd);

        motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        touchQuery = window.matchMedia('(pointer: coarse)');
        motionQuery.addEventListener('change', updateInputPreferences);
        touchQuery.addEventListener('change', updateInputPreferences);
        updateInputPreferences();

        await mountResidence(reduceDetailActive);
        if (stopped) return;

        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host.value);
        document.addEventListener('visibilitychange', updateLoop);
        emit('ready');
        updateLoop();
    } catch (error) {
        fail(error);
    }
});

onBeforeUnmount(() => {
    stopped = true;
    stopLoop();
    resizeObserver?.disconnect();
    document.removeEventListener('visibilitychange', updateLoop);
    motionQuery?.removeEventListener('change', updateInputPreferences);
    touchQuery?.removeEventListener('change', updateInputPreferences);
    controls?.removeEventListener('start', onStart);
    controls?.removeEventListener('end', onEnd);
    controls?.dispose();
    if (scene?.background?.isTexture) {
        scene.background.dispose();
    }
    disposeLoadedModel(scene);
    residenceRoot = null;
    if (renderer) {
        renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
    }
});
</script>

<template>
    <div ref="host" class="building-scene" />
</template>

<style scoped>
.building-scene { position: absolute; inset: 0; }
.building-scene :deep(canvas) { display: block; width: 100%; height: 100%; cursor: grab; }
.building-scene :deep(canvas:active) { cursor: grabbing; }
</style>
