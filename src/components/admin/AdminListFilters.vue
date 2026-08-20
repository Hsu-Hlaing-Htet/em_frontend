<template>
    <div
        class="admin-list-toolbar"
        :class="{ 'admin-list-toolbar--selection': $slots.selection }"
    >
        <div class="admin-list-toolbar__heading">
            <p class="admin-list-toolbar__title">{{ title }}</p>

            <div
                v-if="$slots.actions"
                class="admin-list-toolbar__heading-actions"
            >
                <slot name="actions" />
            </div>
        </div>

        <slot name="selection" />

        <div
            v-if="showSearch"
            class="admin-list-toolbar__search-row"
        >
            <div class="admin-list-toolbar__search">
                <i
                    class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--admin-text-muted)]"
                />

                <InputText
                    :model-value="search"
                    :placeholder="searchPlaceholder"
                    class="w-full !pl-10"
                    @update:model-value="$emit('update:search', $event)"
                />
            </div>

            <Button
                :label="resetLabel"
                class="btn-outline admin-list-toolbar__reset"
                @click="$emit('reset')"
            />
        </div>

        <div
            v-if="$slots.default"
            class="admin-list-toolbar__filters"
        >
            <slot />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default defineComponent({
    name: 'AdminListFilters',
    components: { InputText, Button },
    props: {
        title: {
            type: String,
            required: true,
        },
        search: {
            type: String,
            default: undefined,
        },
        searchPlaceholder: {
            type: String,
            default: 'Search...',
        },
        resetLabel: {
            type: String,
            default: 'Reset',
        },
        showSearch: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['update:search', 'reset'],
});
</script>
