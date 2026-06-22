<template>
    <div class="flex justify-end p-4">
        <div class="flex gap-2">
            <router-link :to="{ name: 'residentList' }">
                <Button label="Back" class="p-2" />
            </router-link>
            <router-link v-if="state.id" :to="{ name: 'editResident', params: { id: state.id } }">
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
                    Email
                </p>
                <p class="text-base font-medium text-[var(--admin-text)]">
                    {{ state.email }}
                </p>
            </div>

            <div class="p-3">
                <p class="mb-2 text-md font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                    Phone
                </p>
                <p class="text-base font-medium text-[var(--admin-text)]">
                    {{ state.phone || '—' }}
                </p>
            </div>

            <div class="p-3">
                <p class="mb-2 text-md font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                    NRC
                </p>
                <p class="text-base font-medium text-[var(--admin-text)]">
                    {{ state.nrc || '—' }}
                </p>
            </div>

            <div class="p-3">
                <p class="mb-2 text-md font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                    Date of Birth
                </p>
                <p class="text-base font-medium text-[var(--admin-text)]">
                    {{ state.dob || '—' }}
                </p>
            </div>

            <div class="p-3">
                <p class="mb-2 text-md font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                    Gender
                </p>
                <p class="text-base font-medium text-[var(--admin-text)]">
                    {{ state.gender || '—' }}
                </p>
            </div>

            <div class="p-3 md:col-span-2">
                <p class="mb-2 text-md font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                    Address
                </p>
                <p class="leading-7 text-[var(--admin-text)]">
                    {{ state.address || '—' }}
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
import useShowResident from './useShowResident';

export default defineComponent({
    name: 'ShowResident',
    components: { Button, Loading },
    setup() {
        return useShowResident();
    },
});
</script>
