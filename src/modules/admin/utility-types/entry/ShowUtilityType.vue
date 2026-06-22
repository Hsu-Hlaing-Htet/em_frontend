<template>
    <div class="flex justify-end p-4">
        <div class="flex gap-2">
            <router-link :to="{ name: 'utilityTypeList' }">
                <Button label="Back" class="p-2" />
            </router-link>
            <router-link v-if="state.id" :to="{ name: 'editUtilityType', params: { id: state.id } }">
                <Button
                    icon="pi pi-pencil"
                    text
                    severity="info"
                    class="p-2"
                />
            </router-link>
        </div>
    </div>

    <div v-if="!isLoading" class="admin-panel mx-auto max-w-5xl">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="p-3">
                <p class="mb-2 text-md font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                    Name
                </p>
                <p class="text-base font-medium text-[var(--admin-text)]">
                    {{ state.name }}
                </p>
            </div>

            <div class="p-3">
                <p class="mb-2 text-md font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                    Slug
                </p>
                <p class="text-base font-medium text-[var(--admin-text)]">
                    {{ state.slug }}
                </p>
            </div>

            <div class="p-3">
                <p class="mb-2 text-md font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                    Status
                </p>
                <p class="text-base font-medium text-[var(--admin-text)]">
                    {{ state.status }}
                </p>
            </div>

            <div class="p-3">
                <p class="mb-2 text-md font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                    Created At
                </p>
                <p class="text-base font-medium text-[var(--admin-text)]">
                    {{ state.created_at || '-' }}
                </p>
            </div>
        </div>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import useShowUtilityType from './useShowUtilityType';

export default defineComponent({
    name: 'ShowUtilityType',
    components: { Button, Loading },
    setup() {
        return useShowUtilityType();
    },
});
</script>
