<template>
    
        <div class="flex justify-end p-4">
            <div class="flex gap-2">
                <router-link :to="{ name: 'buildingList' }">
                    <Button label="Back" class="p-2"/>
                </router-link>
                <router-link v-if="state.id" :to="{ name: 'editBuilding', params: { id: state.id } }">
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

<!-- Details -->
<div class="grid grid-cols-1 gap-6 md:grid-cols-2">

    <div
        class="p-3"
    >
        <p class="mb-2 text-md font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
            Building Name
        </p>

        <p class="text-base font-medium text-[var(--admin-text)]">
            {{ state.building_name }}
        </p>
    </div>

    <div
        class="p-2"
    >
        <p class="mb-2 text-md font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
            Location
        </p>

        <p class="text-base font-medium text-[var(--admin-text)]">
            {{ state.location }}
        </p>
    </div>

    <div
        class="p-2 md:col-span-2"
    >
        <p class="mb-2 text-md font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
            Description
        </p>

        <p class="leading-7 text-[var(--admin-text)]">
            {{ state.description || '-' }}
        </p>
    </div>

</div>
</div>

        <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import useShowBuilding from './useShowBuilding';

export default defineComponent({
    name: 'ShowBuilding',
    components: { InputText, Textarea, Button, Loading },
    setup() {
        return useShowBuilding();
    },
});
</script>
