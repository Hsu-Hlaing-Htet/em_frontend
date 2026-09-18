<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({}),
    },
    compact: {
        type: Boolean,
        default: false,
    },
    showPurpose: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['update:modelValue', 'search']);

const form = reactive({
    purpose: props.modelValue.purpose ?? 'all',
    search: props.modelValue.search ?? '',
    price_min: props.modelValue.price_min ?? '',
    price_max: props.modelValue.price_max ?? '',
});

watch(
    () => props.modelValue,
    (value) => {
        form.purpose = value.purpose ?? 'all';
        form.search = value.search ?? '';
        form.price_min = value.price_min ?? '';
        form.price_max = value.price_max ?? '';
    },
    { deep: true }
);

function submit() {
    emit('update:modelValue', { ...form });
    emit('search', { ...form });
}
</script>

<template>
    <form
        class="rw-glass rw-search"
        :class="{ 'rw-search--compact': compact }"
        @submit.prevent="submit"
    >
        <div
            v-if="showPurpose"
            class="rw-search__tabs"
            role="tablist"
            aria-label="Listing purpose"
        >
            <button
                v-for="tab in [
                    { label: 'All', value: 'all' },
                    { label: 'Rent', value: 'rent' },
                    { label: 'Sale', value: 'sale' },
                ]"
                :key="tab.value"
                type="button"
                class="rw-tab"
                role="tab"
                :aria-selected="form.purpose === tab.value"
                :class="{ 'is-active': form.purpose === tab.value }"
                @click="form.purpose = tab.value"
            >
                {{ tab.label }}
            </button>
        </div>

        <div class="rw-search__fields">
            <div class="rw-field">
                <label for="rw-search-keyword">Location / Keyword</label>
                <input
                    id="rw-search-keyword"
                    v-model="form.search"
                    class="rw-input"
                    type="text"
                    placeholder="Township, building, or keyword"
                >
            </div>

            <div class="rw-field">
                <label for="rw-search-min">Min Price</label>
                <input
                    id="rw-search-min"
                    v-model="form.price_min"
                    class="rw-input"
                    type="number"
                    min="0"
                    placeholder="Min"
                >
            </div>

            <div class="rw-field">
                <label for="rw-search-max">Max Price</label>
                <input
                    id="rw-search-max"
                    v-model="form.price_max"
                    class="rw-input"
                    type="number"
                    min="0"
                    placeholder="Max"
                >
            </div>

            <button
                type="submit"
                class="rw-btn rw-btn-primary rw-search__submit"
            >
                Search
            </button>
        </div>
    </form>
</template>

<style scoped>
.rw-search {
    padding: 1rem 1.05rem;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(20, 20, 22, 0.72);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
}

.rw-search__tabs {
    display: inline-flex;
    gap: 0.3rem;
    margin-bottom: 1rem;
    padding: 0.25rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(13, 13, 15, 0.35);
}

.rw-search__fields {
    display: grid;
    grid-template-columns: 1.6fr 0.9fr 0.9fr auto;
    gap: 0.85rem;
    align-items: end;
}

.rw-search__submit {
    min-width: 124px;
    min-height: 42px;
    border-radius: 10px;
}

@media (max-width: 960px) {
    .rw-search__fields {
        grid-template-columns: 1fr 1fr;
    }

    .rw-search__submit {
        grid-column: 1 / -1;
    }
}

@media (max-width: 640px) {
    .rw-search__fields {
        grid-template-columns: 1fr;
    }
}
</style>
