<template>
    <div class="admin-list-toolbar">
        <p class="admin-list-toolbar__title">{{ title }}</p>

        <div class="admin-list-toolbar__controls">
            <div
                v-if="showSearch"
                class="admin-list-toolbar__search"
            >
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

            <slot />

            <div class="admin-list-toolbar__actions">
                <Button
                    :label="resetLabel"
                    class="btn-outline"
                    @click="$emit('reset')"
                />

                <slot name="actions" />
            </div>
        </div>

        <div
            v-if="$slots.trailing"
            class="admin-list-toolbar__trailing"
        >
            <slot name="trailing" />
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
