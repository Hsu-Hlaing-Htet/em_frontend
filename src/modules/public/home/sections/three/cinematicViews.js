/**
 * Cinematic architectural showcase — hero exterior only.
 *
 * Prefer an original Rosewood residential tower render at:
 *   /media/rosewood/future-residence-poster.webp
 *
 * Until then, use a multi-storey luxury residential exterior
 * (warm stone/glass apartments with balconies) — not office towers,
 * houses, or interiors.
 */

export const HERO_BUILDING = Object.freeze({
    id: 'residence',
    label: 'Residence',
    // Multi-storey residential apartments with balconies (luxury real-estate mood).
    src: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=2000&auto=format&fit=crop',
    localPoster: '/media/rosewood/future-residence-poster.webp',
    localPosterJpg: '/media/rosewood/future-residence-poster.jpg',
});

export const CINEMATIC_VIEWS = Object.freeze([HERO_BUILDING]);

export const CINEMATIC_EDITORIAL = Object.freeze([
    'Refined Architecture',
    'Green Living',
    'Timeless Value',
]);
