<template>
    <div class="customer-search-bar">
        <div class="customer-search-input-wrap">
            <i class="pi pi-search" />
            <InputText
                :model-value="search"
                :placeholder="placeholder"
                @update:model-value="$emit('update:search', $event)"
            />
        </div>
        <div v-if="filters.length" class="customer-filter-chips">
            <button
                v-for="filter in filters"
                :key="filter.value"
                type="button"
                class="customer-filter-chip"
                :class="{ 'is-active': status === filter.value }"
                @click="$emit('update:status', filter.value)"
            >
                {{ filter.label }}
            </button>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';

export default defineComponent({
    name: 'CustomerSearchBar',
    components: { InputText },
    props: {
        search: { type: String, default: '' },
        status: { type: String, default: '' },
        placeholder: { type: String, default: 'Search...' },
        filters: { type: Array, default: () => [] },
    },
    emits: ['update:search', 'update:status'],
});
</script>
