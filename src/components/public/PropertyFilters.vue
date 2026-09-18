<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({}),
    },
    fixedPurpose: {
        type: String,
        default: null,
        validator: (value) => value == null || ['rent', 'sale'].includes(value),
    },
});

const emit = defineEmits(['update:modelValue', 'apply', 'reset']);

const form = reactive({
    purpose: props.fixedPurpose || props.modelValue.purpose || 'all',
    township: props.modelValue.township ?? '',
    price_min: props.modelValue.price_min ?? '',
    price_max: props.modelValue.price_max ?? '',
    area_min: props.modelValue.area_min ?? '',
    area_max: props.modelValue.area_max ?? '',
});

watch(
    () => props.modelValue,
    (value) => {
        Object.assign(form, {
            purpose: props.fixedPurpose || value.purpose || 'all',
            township: value.township ?? '',
            price_min: value.price_min ?? '',
            price_max: value.price_max ?? '',
            area_min: value.area_min ?? '',
            area_max: value.area_max ?? '',
        });
    },
    { deep: true }
);

function apply() {
    const payload = { ...form };
    if (props.fixedPurpose) {
        payload.purpose = props.fixedPurpose;
    }
    emit('update:modelValue', payload);
    emit('apply', payload);
}

function reset() {
    Object.assign(form, {
        purpose: props.fixedPurpose || 'all',
        township: '',
        price_min: '',
        price_max: '',
        area_min: '',
        area_max: '',
    });
    emit('update:modelValue', { ...form });
    emit('reset', { ...form });
}
</script>

<template>
    <aside class="rw-filters">
        <div class="rw-filters__head">
            <h3>Filters</h3>
            <button
                type="button"
                class="rw-filters__reset"
                @click="reset"
            >
                Reset
            </button>
        </div>

        <div
            v-if="!fixedPurpose"
            class="rw-field"
        >
            <label for="rw-filter-purpose">Purpose</label>
            <select
                id="rw-filter-purpose"
                v-model="form.purpose"
                class="rw-input"
            >
                <option value="all">All</option>
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
            </select>
        </div>

        <div class="rw-field">
            <label for="rw-filter-township">Township / Location</label>
            <input
                id="rw-filter-township"
                v-model="form.township"
                class="rw-input"
                type="text"
                placeholder="e.g. Bahan"
            >
        </div>

        <div class="rw-filters__row">
            <div class="rw-field">
                <label for="rw-filter-min">Min Price</label>
                <input
                    id="rw-filter-min"
                    v-model="form.price_min"
                    class="rw-input"
                    type="number"
                    min="0"
                >
            </div>
            <div class="rw-field">
                <label for="rw-filter-max">Max Price</label>
                <input
                    id="rw-filter-max"
                    v-model="form.price_max"
                    class="rw-input"
                    type="number"
                    min="0"
                >
            </div>
        </div>

        <div class="rw-filters__row">
            <div class="rw-field">
                <label for="rw-filter-area-min">Min Area</label>
                <input
                    id="rw-filter-area-min"
                    v-model="form.area_min"
                    class="rw-input"
                    type="number"
                    min="0"
                    placeholder="sqft"
                >
            </div>
            <div class="rw-field">
                <label for="rw-filter-area-max">Max Area</label>
                <input
                    id="rw-filter-area-max"
                    v-model="form.area_max"
                    class="rw-input"
                    type="number"
                    min="0"
                    placeholder="sqft"
                >
            </div>
        </div>

        <button
            type="button"
            class="rw-btn rw-btn-primary rw-filters__apply"
            @click="apply"
        >
            Apply Filters
        </button>
    </aside>
</template>

<style scoped>
.rw-filters {
    display: grid;
    gap: 0.8rem;
    position: sticky;
    top: 120px;
    padding: 1.05rem;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(20, 20, 22, 0.82);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
}

.rw-filters__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.15rem;
}

.rw-filters__head h3 {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 500;
}

.rw-filters__reset {
    border: 0;
    background: transparent;
    color: #a9adb5;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
}

.rw-filters__reset:hover {
    color: #f5f2ee;
}

.rw-filters__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
}

.rw-filters__apply {
    width: 100%;
    min-height: 42px;
    margin-top: 0.35rem;
    border-radius: 10px;
}
</style>
