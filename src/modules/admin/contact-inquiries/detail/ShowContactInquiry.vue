<template>
    <div class="flex flex-wrap items-center justify-between gap-3 p-4">
        <h1 class="m-0 text-xl font-semibold">Contact Inquiry Detail</h1>
        <router-link :to="{ name: 'contactInquiryList' }">
            <Button
                label="Back"
                icon="pi pi-arrow-left"
                severity="secondary"
            />
        </router-link>
    </div>

    <div
        v-if="!isLoading"
        class="mx-auto flex max-w-4xl flex-col gap-5 px-4 pb-8"
    >
        <section class="admin-panel p-5">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 class="m-0 text-lg font-semibold">Inquiry Information</h2>
                <StatusBadge :value="state.status" />
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Name</p>
                    <p class="text-sm font-medium">{{ state.name || '—' }}</p>
                </div>
                <div>
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Email</p>
                    <p class="text-sm font-medium">
                        <a
                            v-if="state.email"
                            :href="`mailto:${state.email}`"
                            class="text-[var(--admin-accent)] underline"
                        >{{ state.email }}</a>
                        <span v-else>—</span>
                    </p>
                </div>
                <div>
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Phone</p>
                    <p class="text-sm font-medium">
                        <a
                            v-if="state.phone"
                            :href="`tel:${state.phone}`"
                            class="text-[var(--admin-accent)] underline"
                        >{{ state.phone }}</a>
                        <span v-else>—</span>
                    </p>
                </div>
                <div>
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Preferred Service</p>
                    <p class="text-sm font-medium">{{ state.preferred_service || '—' }}</p>
                </div>
                <div class="md:col-span-2">
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Subject</p>
                    <p class="text-sm font-medium">{{ state.subject || '—' }}</p>
                </div>
                <div class="md:col-span-2">
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Message</p>
                    <p class="whitespace-pre-wrap text-sm leading-7">{{ state.message || '—' }}</p>
                </div>
                <div>
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Submitted At</p>
                    <p class="text-sm font-medium">{{ formatDate(state.created_at) || '—' }}</p>
                </div>
                <div>
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Status</p>
                    <StatusBadge :value="state.status" />
                </div>
            </div>
        </section>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { formatDate } from '@/utils/formatter';
import { useContactInquiryStore } from '../store';

export default defineComponent({
    name: 'ShowContactInquiry',
    components: {
        Button,
        Loading,
        StatusBadge,
    },
    setup() {
        const route = useRoute();
        const store = useContactInquiryStore();
        const isLoading = ref(true);

        const state = computed(() => store.getOneResponse?.data || {});

        onMounted(async () => {
            isLoading.value = true;
            await store.fetchOne({ id: route.params.id });
            isLoading.value = false;
        });

        onBeforeUnmount(() => {
            store.$reset();
            store.$dispose();
        });

        return {
            isLoading,
            state,
            formatDate,
        };
    },
});
</script>
