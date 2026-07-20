<template>
    <div v-if="!isLoading" class="admin-panel p-10">
<div class="flex flex-wrap items-start justify-between gap-6 lg:gap-8">

    <div class="min-w-0 flex-1">

        <p class="mb-2 text-xs uppercase tracking-[0.14em]">
            Draft Contract
        </p>

            <h1 class="text-2xl leading-tight tracking-[-0.02em]">
            {{ document.header.contractNo || '—' }}
        </h1>

            <StatusBadge
                v-if="state.status"
                class="mt-3"
                :value="state.status"
            />

    </div>

    <div class="flex flex-wrap items-center justify-end gap-2">

        <router-link
            v-if="contractPdfRoute"
            :to="contractPdfRoute"
        >
            <Button
                icon="pi pi-file"
                label="View"
            />
        </router-link>

        <router-link
            v-if="editRoute"
            :to="editRoute"
        >
            <Button
                icon="pi pi-pencil"
                label="Edit"
                severity="secondary"
            />
        </router-link>

        <router-link :to="backRoute">
            <Button
                label="Back"
                severity="secondary"
            />
        </router-link>

    </div>

</div>

<div
    v-for="section in fieldSections"
    :key="section.title"
    class="pt-6 first:pt-0"
>

    <h3 class="mb-4 text-lg">
        {{ section.title }}
    </h3>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-6">

        <div
            v-for="item in section.fields"
            :key="item.label"
            :class="{
                'lg:col-span-2': section.wideLabels.includes(item.label),
            }"
        >

                <p class="mb-1 text-md font-size-[18px]">
                {{ item.label }}
            </p>

                <p class="text-sm font-size-[14px]">
                {{ item.value }}
            </p>

        </div>

    </div>

</div>


</div>
    <Loading v-if="isLoading" />
</template>

<script>
import { computed, defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import useShowSaleDraft from './useShowSaleDraft';

function fieldValue(fields, label) {
    return fields?.find((item) => item.label === label)?.value ?? '—';
}

export default defineComponent({
    name: 'ShowSaleDraft',
    components: { Button, Loading, StatusBadge },
    setup() {
        const draft = useShowSaleDraft();

        const summary = computed(() => {
            const doc = draft.document.value;
            const customer = fieldValue(doc.customer, 'Full Name');
            const building = fieldValue(doc.property, 'Building');
            const room = fieldValue(doc.property, 'Room / Unit');

            return {
                customer,
                property: building !== '—' || room !== '—'
                    ? `${building} · ${room}`
                    : '—',
                stats: [
                    { label: 'Customer', value: customer },
                    { label: 'Property', value: `${building} · ${room}` },
                    { label: 'Contract Total', value: fieldValue(doc.contract, 'Contract Total') },
                    { label: 'Payment Type', value: fieldValue(doc.contract, 'Payment Type') },
                ],
            };
        });

        return {
            ...draft,
            summary,
        };
    },
});
</script>

<style>
@media print {
    .contract {
        gap: 0;
        padding: 0;
        max-width: none;
    }
}
</style>
