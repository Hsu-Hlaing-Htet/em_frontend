<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import PropertyCard from '@/components/public/PropertyCard.vue';
import PropertyCardSkeleton from '@/components/public/PropertyCardSkeleton.vue';
import PropertyFilters from '@/components/public/PropertyFilters.vue';
import PropertySearch from '@/components/public/PropertySearch.vue';
import RwEmptyState from '@/components/global/RwEmptyState.vue';
import { usePropertyListing } from '@/composables/public/usePropertyListing';

const props = defineProps({
    fixedPurpose: {
        type: String,
        default: null,
        validator: (value) => value == null || ['rent', 'sale'].includes(value),
    },
    heroTitle: {
        type: String,
        default: 'Find Your Next Chapter',
    },
    heroCopy: {
        type: String,
        default: 'Explore curated residences for rent and sale — filtered with the same live inventory powering Rosewood Royale.',
    },
    heroImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1800',
    },
});

const resultsRef = ref(null);

const {
    loading,
    error,
    page,
    sort,
    filters,
    filtersOpen,
    properties,
    totalPages,
    resultMeta,
    activeFilterChips,
    fetchProperties,
    applyFilters,
    clearFilters,
    removeFilterChip,
    goToPage,
} = usePropertyListing({ fixedPurpose: props.fixedPurpose });

const pageNumbers = computed(() => {
    const total = totalPages.value;
    const current = page.value;
    if (total <= 7) {
        return Array.from({ length: total }, (_, index) => index + 1);
    }

    const pages = new Set([1, total, current, current - 1, current + 1]);
    return Array.from(pages)
        .filter((value) => value >= 1 && value <= total)
        .sort((a, b) => a - b);
});

async function changePage(nextPage) {
    goToPage(nextPage);
    await nextTick();
    resultsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

onMounted(fetchProperties);

watch(
    () => props.fixedPurpose,
    async () => {
        if (props.fixedPurpose) {
            filters.purpose = props.fixedPurpose;
        }
        await fetchProperties();
    }
);

watch(sort, () => {
    page.value = 1;
});
</script>

<template>
    <div class="rw-listing-page">
        <section class="rw-page-hero rw-listing-hero">
            <div
                class="rw-page-hero__media"
                aria-hidden="true"
            >
                <img
                    :src="heroImage"
                    alt=""
                >
            </div>
            <div class="rw-page-hero__overlay" />
            <div class="container rw-page-hero__content rw-listing-hero__copy">
                <p class="rw-kicker">Rosewood Royale Residences</p>
                <h1>{{ heroTitle }}</h1>
                <p class="rw-lede">{{ heroCopy }}</p>
            </div>
        </section>

        <section class="rw-section rw-section--tight">
            <div class="container">
                <PropertySearch
                    :model-value="filters"
                    :show-purpose="!fixedPurpose"
                    @search="applyFilters"
                />
            </div>
        </section>

        <section
            ref="resultsRef"
            class="rw-section rw-listing-results"
        >
            <div class="container">
                <div class="rw-listing-toolbar">
                    <div>
                        <p class="rw-listing-count">
                            <strong>{{ resultMeta.total }}</strong>
                            {{ resultMeta.total === 1 ? 'Residence' : 'Residences' }}
                        </p>
                        <div
                            v-if="activeFilterChips.length"
                            class="rw-filter-chips"
                        >
                            <button
                                v-for="chip in activeFilterChips"
                                :key="chip.key"
                                type="button"
                                class="rw-filter-chip"
                                :aria-label="`Remove ${chip.label} filter`"
                                @click="removeFilterChip(chip.key)"
                            >
                                <span>{{ chip.label }}</span>
                                <i
                                    class="fas fa-xmark"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>

                    <div class="rw-listing-toolbar__actions">
                        <button
                            type="button"
                            class="rw-btn rw-btn-ghost rw-filters-mobile"
                            @click="filtersOpen = true"
                        >
                            Filters
                        </button>
                        <div class="rw-field rw-listing-sort">
                            <label for="rw-sort">Sort by</label>
                            <select
                                id="rw-sort"
                                v-model="sort"
                                class="rw-input"
                            >
                                <option value="newest">Newest</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="rw-listing-layout">
                    <div class="rw-filters-desktop">
                        <PropertyFilters
                            :model-value="filters"
                            :fixed-purpose="fixedPurpose"
                            @apply="applyFilters"
                            @reset="clearFilters"
                        />
                    </div>

                    <div class="rw-listing-main">
                        <div
                            v-if="loading"
                            class="rw-property-grid"
                            aria-busy="true"
                            aria-live="polite"
                        >
                            <PropertyCardSkeleton
                                v-for="n in 6"
                                :key="`sk-${n}`"
                            />
                        </div>

                        <div
                            v-else-if="error"
                            class="rw-listing-state rw-listing-state--error"
                        >
                            <RwEmptyState
                                icon="pi pi-exclamation-circle"
                                title="Properties are temporarily unavailable."
                                message="Please try again in a moment."
                                :primary-cta="{ label: 'Try Again', onClick: () => fetchProperties() }"
                            />
                        </div>

                        <div
                            v-else-if="properties.length"
                            class="rw-property-grid reveal reveal-stagger is-visible"
                        >
                            <PropertyCard
                                v-for="property in properties"
                                :key="`${property.purpose}-${property.id}`"
                                :property="property"
                            />
                        </div>

                        <div
                            v-else
                            class="rw-listing-state"
                        >
                            <RwEmptyState
                                icon="pi pi-search"
                                title="No residences matched your filters."
                                message="Try adjusting the location, price range, or property type."
                                :secondary-cta="{ label: 'Clear Filters', onClick: clearFilters, icon: false }"
                            />
                        </div>

                        <nav
                            v-if="!loading && !error && totalPages > 1"
                            class="rw-pagination"
                            aria-label="Property results pages"
                        >
                            <button
                                type="button"
                                class="rw-pagination__btn"
                                :disabled="page <= 1"
                                @click="changePage(page - 1)"
                            >
                                Previous
                            </button>

                            <div class="rw-pagination__pages">
                                <template
                                    v-for="(pageNumber, index) in pageNumbers"
                                    :key="pageNumber"
                                >
                                    <span
                                        v-if="index > 0 && pageNumber - pageNumbers[index - 1] > 1"
                                        class="rw-pagination__ellipsis"
                                    >…</span>
                                    <button
                                        type="button"
                                        class="rw-pagination__page"
                                        :class="{ 'is-active': page === pageNumber }"
                                        :aria-current="page === pageNumber ? 'page' : undefined"
                                        @click="changePage(pageNumber)"
                                    >
                                        {{ pageNumber }}
                                    </button>
                                </template>
                            </div>

                            <button
                                type="button"
                                class="rw-pagination__btn"
                                :disabled="page >= totalPages"
                                @click="changePage(page + 1)"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </section>

        <Teleport to="body">
            <Transition name="rw-filter-sheet">
                <div
                    v-if="filtersOpen"
                    class="rw-filter-sheet"
                >
                    <div
                        class="rw-filter-sheet__backdrop"
                        @click="filtersOpen = false"
                    />
                    <div
                        class="rw-filter-sheet__panel"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Property filters"
                    >
                        <div class="rw-filter-sheet__head">
                            <h2>Filters</h2>
                            <button
                                type="button"
                                class="rw-filter-sheet__close"
                                aria-label="Close filters"
                                @click="filtersOpen = false"
                            >
                                <i class="fas fa-xmark" />
                            </button>
                        </div>
                        <PropertyFilters
                            :model-value="filters"
                            :fixed-purpose="fixedPurpose"
                            @apply="applyFilters"
                            @reset="clearFilters"
                        />
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<style scoped>
.rw-listing-page {
    padding-bottom: 2rem;
}

.rw-listing-hero {
    min-height: 460px;
}

.rw-listing-hero__copy > * {
    animation: rw-listing-hero-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.rw-listing-hero__copy > *:nth-child(1) { animation-delay: 80ms; }
.rw-listing-hero__copy > *:nth-child(2) { animation-delay: 160ms; }
.rw-listing-hero__copy > *:nth-child(3) { animation-delay: 240ms; }

.rw-listing-hero__copy h1 {
    font-size: clamp(2.4rem, 5vw, 3.6rem);
    max-width: 14ch;
    line-height: 1.02;
}

.rw-listing-hero__copy .rw-lede {
    max-width: 40rem;
}

.rw-listing-results {
    padding-top: 0;
    padding-bottom: 5.5rem;
    scroll-margin-top: 6rem;
}

.rw-listing-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.35rem;
}

.rw-listing-count {
    margin: 0;
    color: #a9adb5;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.78rem;
}

.rw-listing-count strong {
    color: #f5f2ee;
    font-family: var(--rw-font-serif, 'Cormorant Garamond', serif);
    font-size: 1.55rem;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
    margin-right: 0.35rem;
}

.rw-filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin-top: 0.75rem;
}

.rw-filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 30px;
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
    border: 1px solid rgba(143, 35, 56, 0.45);
    background: rgba(143, 35, 56, 0.12);
    color: #f5f2ee;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background 0.25s ease, border-color 0.25s ease;
}

.rw-filter-chip:hover,
.rw-filter-chip:focus-visible {
    background: rgba(143, 35, 56, 0.2);
    border-color: rgba(169, 43, 71, 0.7);
}

.rw-filter-chip i {
    font-size: 0.65rem;
    color: #a9adb5;
}

.rw-listing-toolbar__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: end;
}

.rw-listing-sort {
    min-width: 190px;
}

.rw-filters-mobile {
    display: none;
}

.rw-listing-main {
    min-width: 0;
}

.rw-listing-state {
    padding: 0.5rem;
    text-align: center;
    border: 1px solid color-mix(in srgb, var(--rw-border, rgba(255, 255, 255, 0.1)) 100%, transparent);
    border-radius: 14px;
    background: color-mix(in srgb, var(--rw-surface, rgba(23, 24, 27, 0.72)) 88%, transparent);
}

.rw-listing-state .rw-empty-state__title {
    font-family: var(--rw-font-serif, 'Cormorant Garamond', serif);
    font-size: 1.45rem;
    font-weight: 500;
}

.rw-listing-state--error {
    border-color: color-mix(in srgb, var(--rw-primary) 35%, var(--rw-border, transparent));
}

.rw-pagination {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    margin-top: 2rem;
}

.rw-pagination__btn,
.rw-pagination__page {
    min-height: 38px;
    padding: 0 0.9rem;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(23, 24, 27, 0.88);
    color: #a9adb5;
    font-size: 0.82rem;
    cursor: pointer;
    transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease;
}

.rw-pagination__page {
    min-width: 38px;
    padding: 0 0.55rem;
}

.rw-pagination__btn:hover:not(:disabled),
.rw-pagination__page:hover {
    border-color: rgba(255, 255, 255, 0.2);
    color: #f5f2ee;
}

.rw-pagination__page.is-active {
    border-color: rgba(143, 35, 56, 0.7);
    background: rgba(143, 35, 56, 0.18);
    color: #f5f2ee;
}

.rw-pagination__btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.rw-pagination__pages {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
}

.rw-pagination__ellipsis {
    color: #777b82;
    padding: 0 0.15rem;
}

.rw-filter-sheet {
    position: fixed;
    inset: 0;
    z-index: 140;
}

.rw-filter-sheet__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
}

.rw-filter-sheet__panel {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    max-height: 88vh;
    overflow: auto;
    padding: 1rem 1rem 1.35rem;
    border-radius: 18px 18px 0 0;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-bottom: 0;
    background: rgba(18, 18, 20, 0.97);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
}

.rw-filter-sheet__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.85rem;
}

.rw-filter-sheet__head h2 {
    margin: 0;
    font-size: 1.45rem;
    font-weight: 500;
}

.rw-filter-sheet__close {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: transparent;
    color: #f5f2ee;
    cursor: pointer;
}

.rw-filter-sheet-enter-active,
.rw-filter-sheet-leave-active {
    transition: opacity 0.22s ease;
}

.rw-filter-sheet-enter-active .rw-filter-sheet__panel,
.rw-filter-sheet-leave-active .rw-filter-sheet__panel {
    transition: transform 0.24s ease;
}

.rw-filter-sheet-enter-from,
.rw-filter-sheet-leave-to {
    opacity: 0;
}

.rw-filter-sheet-enter-from .rw-filter-sheet__panel,
.rw-filter-sheet-leave-to .rw-filter-sheet__panel {
    transform: translateY(18px);
}

@keyframes rw-listing-hero-in {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 960px) {
    .rw-filters-desktop {
        display: none;
    }

    .rw-filters-mobile {
        display: inline-flex;
    }

    .rw-listing-hero {
        min-height: 400px;
    }
}

@media (max-width: 640px) {
    .rw-listing-hero {
        min-height: 360px;
    }

    .rw-listing-sort {
        min-width: 0;
        flex: 1;
    }

    .rw-listing-toolbar__actions {
        width: 100%;
    }

    .rw-listing-results {
        padding-bottom: 6.5rem;
    }
}

@media (prefers-reduced-motion: reduce) {
    .rw-listing-hero__copy > *,
    .rw-filter-sheet-enter-active,
    .rw-filter-sheet-leave-active,
    .rw-filter-sheet-enter-active .rw-filter-sheet__panel,
    .rw-filter-sheet-leave-active .rw-filter-sheet__panel {
        animation: none !important;
        transition: none !important;
        transform: none !important;
    }
}
</style>
