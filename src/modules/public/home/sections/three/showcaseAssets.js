/**
 * Cinematic architectural showcase asset paths.
 *
 * Priority for normal users:
 *   1. GLB interactive model
 *   2. Pre-rendered 360 frame sequence
 *   3. Cinematic video loop
 *   4. Cinematic multi-view image showcase (parallax)
 *   5. Static poster / typographic mark
 *
 * Procedural BoxGeometry prototype is DEV-ONLY (see allowProceduralFallback).
 */

export const ROSEWOOD_MODEL_URL = '/models/rosewood/rosewood-future-residence.glb';

export const ROSEWOOD_POSTER_URL = '/media/rosewood/future-residence-poster.webp';
export const ROSEWOOD_POSTER_FALLBACK_URL = '/media/rosewood/future-residence-poster.jpg';

export const ROSEWOOD_VIDEO_WEBM = '/media/rosewood/future-residence-showcase.webm';
export const ROSEWOOD_VIDEO_MP4 = '/media/rosewood/future-residence-showcase.mp4';

export const ROSEWOOD_360_DIR = '/media/rosewood/future-residence-360';
export const ROSEWOOD_360_MANIFEST = `${ROSEWOOD_360_DIR}/manifest.json`;

/** Recommended 360 sequence guidelines for asset creators. */
export const ROSEWOOD_360_GUIDELINES = Object.freeze({
    directory: 'frontend/public/media/rosewood/future-residence-360/',
    manifest: 'manifest.json',
    framePattern: 'frame-{index}.webp',
    preferredFrameCount: 72,
    minFrameCount: 48,
    maxFrameCount: 96,
    preferredWidth: 1600,
    preferredHeight: 1200,
    mobileWidth: 1280,
    format: 'WebP (AVIF optional as alternate)',
    webpQuality: '75–85',
});

export function allowProceduralFallback() {
    if (!import.meta.env.DEV) return false;
    try {
        return localStorage.getItem('rosewood-procedural') === '1'
            || import.meta.env.VITE_ROSEWOOD_ALLOW_PROCEDURAL === 'true';
    } catch {
        return import.meta.env.VITE_ROSEWOOD_ALLOW_PROCEDURAL === 'true';
    }
}

async function probe(url, { method = 'HEAD' } = {}) {
    try {
        const response = await fetch(url, { method, cache: 'no-cache' });
        if (response.ok || response.status === 206) return true;
        if (method === 'HEAD' && (response.status === 405 || response.status === 501)) {
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

/**
 * Resolve which showcase mode to use based on assets present on disk/CDN.
 * @returns {Promise<{ mode: 'glb'|'spin360'|'video'|'cinematic', meta?: object }>}
 */
export async function detectShowcaseMode() {
    if (await probe(ROSEWOOD_MODEL_URL)) {
        return { mode: 'glb' };
    }

    if (await probe(ROSEWOOD_360_MANIFEST, { method: 'GET' })) {
        try {
            const response = await fetch(ROSEWOOD_360_MANIFEST, { cache: 'no-cache' });
            if (response.ok) {
                const manifest = await response.json();
                if (manifest?.frameCount >= 2 && manifest?.pattern) {
                    const firstFrame = buildFrameUrl(manifest, 1);
                    if (await probe(firstFrame)) {
                        return { mode: 'spin360', meta: { manifest } };
                    }
                }
            }
        } catch {
            /* fall through */
        }
    }

    if (await probe(ROSEWOOD_VIDEO_WEBM) || await probe(ROSEWOOD_VIDEO_MP4)) {
        return {
            mode: 'video',
            meta: {
                webm: await probe(ROSEWOOD_VIDEO_WEBM),
                mp4: await probe(ROSEWOOD_VIDEO_MP4),
            },
        };
    }

    // No professional 3D/media asset — cinematic image showcase (not procedural).
    return { mode: 'cinematic' };
}

export function buildFrameUrl(manifest, index1Based) {
    const pad = Number(manifest.pad ?? 3);
    const token = String(index1Based).padStart(pad, '0');
    const file = String(manifest.pattern).replace('{index}', token);
    const base = manifest.baseUrl || ROSEWOOD_360_DIR;
    return `${base.replace(/\/$/, '')}/${file.replace(/^\//, '')}`;
}
