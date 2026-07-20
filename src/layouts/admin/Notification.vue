<template>
    <div class="notif-root">
        <button
            type="button"
            class=""
            aria-label="Notifications"
            @click="togglePanel"
        >
            <i class="pi pi-bell" />
        </button>

        <OverlayPanel ref="userPanel" :style="{ width: '360px' }">
            <div class="flex items-center justify-between bg-gradient-to-br from-rosewood to-rosewood-accent px-4 py-4 text-white">
                <div>
                    <div class="text-base font-bold">Notifications</div>
                    <div class="text-sm opacity-85">Latest platform activity</div>
                </div>
                <span class="grid h-7 min-w-7 place-items-center rounded-full bg-white/15 text-xs font-bold">
                    {{ notifications.length }}
                </span>
            </div>

            <div
                v-for="item in notifications"
                :key="item.id"
                class="flex gap-3.5 border-b border-[var(--admin-border)] px-4 py-4 transition-colors duration-300 hover:bg-rosewood-secondary/10"
            >
                <Avatar
                    :icon="item.icon"
                    shape="circle"
                    class="!bg-rosewood/10 !text-rosewood"
                />
                <div class="min-w-0">
                    <div class="text-sm font-semibold">{{ item.title }}</div>
                    <div class="mt-0.5 text-sm text-[var(--admin-text-muted)]">{{ item.detail }}</div>
                    <div class="mt-1 text-xs text-[var(--admin-text-muted)]">{{ item.time }}</div>
                </div>
            </div>
        </OverlayPanel>
    </div>
</template>

<script>
import { ref, defineComponent, onMounted, onUnmounted } from 'vue';
import Avatar from 'primevue/avatar';
import OverlayPanel from 'primevue/overlaypanel';

export default defineComponent({
    name: 'Notification',
    components: { Avatar, OverlayPanel },
    setup() {
        const userPanel = ref();

        const notifications = ref([
            {
                id: 1,
                title: 'New payment received',
                detail: 'INV-2026-0042 marked as paid',
                time: 'Just now',
                icon: 'pi pi-wallet',
            },
            {
                id: 2,
                title: 'Lease renewal pending',
                detail: 'Lake Tower 4C requires approval',
                time: '18 min ago',
                icon: 'pi pi-file',
            },
            {
                id: 3,
                title: 'Maintenance assigned',
                detail: 'HVAC inspection scheduled',
                time: '1 hr ago',
                icon: 'pi pi-wrench',
            },
            {
                id: 4,
                title: 'New tenant registered',
                detail: 'Thandar Tun joined the portal',
                time: '3 hrs ago',
                icon: 'pi pi-user',
            },
        ]);

        const togglePanel = (event) => {
            userPanel.value.toggle(event);
        };

        const handleScroll = () => {
            userPanel.value?.hide();
        };

        onMounted(() => {
            window.addEventListener('scroll', handleScroll);
        });

        onUnmounted(() => {
            window.removeEventListener('scroll', handleScroll);
        });

        return {
            userPanel,
            notifications,
            togglePanel,
        };
    },
});
</script>


