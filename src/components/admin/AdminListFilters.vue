<template>
    <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="m-0 text-md">{{ title }}</p>

        <div class="flex flex-wrap items-center gap-2">
            <div
                v-if="showSearch"
                class="relative"
            >
                <i
                    class="pi pi-search absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--admin-text-muted)]"
                />

                <InputText
                    :model-value="search"
                    :placeholder="searchPlaceholder"
                    class="w-72 !pl-10"
                    @update:model-value="$emit('update:search', $event)"
                />
            </div>

            <slot />

            <Button
                :label="resetLabel"
                class="btn-outline"
                @click="$emit('reset')"
            />

            <slot name="actions" />
        </div>

        <div
            v-if="$slots.trailing"
            class="ml-auto flex items-center gap-2"
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
