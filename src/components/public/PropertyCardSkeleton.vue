<template>
    <article
        class="property-card-skeleton"
        aria-hidden="true"
    >
        <div class="property-card-skeleton-image" />
        <div class="property-card-skeleton-body">
            <div class="property-card-skeleton-line property-card-skeleton-line-lg" />
            <div class="property-card-skeleton-line property-card-skeleton-line-md" />
            <div class="property-card-skeleton-grid">
                <div class="property-card-skeleton-line property-card-skeleton-line-sm" />
                <div class="property-card-skeleton-line property-card-skeleton-line-sm" />
                <div class="property-card-skeleton-line property-card-skeleton-line-sm" />
            </div>
            <div class="property-card-skeleton-line property-card-skeleton-line-btn" />
        </div>
    </article>
</template>

<style scoped>
.property-card-skeleton {
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #17181b;
}

.property-card-skeleton-image {
    aspect-ratio: 4 / 3;
    background: #202226;
    animation: rw-skeleton-pulse 1.6s ease-in-out infinite;
}

.property-card-skeleton-body {
    display: grid;
    gap: 0.7rem;
    padding: 1rem 1.05rem 1.1rem;
}

.property-card-skeleton-line {
    height: 11px;
    border-radius: 6px;
    background: #202226;
    animation: rw-skeleton-pulse 1.6s ease-in-out infinite;
}

.property-card-skeleton-line-lg { width: 76%; height: 16px; }
.property-card-skeleton-line-md { width: 48%; }
.property-card-skeleton-line-sm { width: 100%; }
.property-card-skeleton-line-btn { width: 38%; height: 14px; margin-top: 0.2rem; }

.property-card-skeleton-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.55rem;
}

@keyframes rw-skeleton-pulse {
    0%,
    100% { opacity: 0.55; }
    50% { opacity: 0.9; }
}

@media (prefers-reduced-motion: reduce) {
    .property-card-skeleton-image,
    .property-card-skeleton-line {
        animation: none;
    }
}
</style>
