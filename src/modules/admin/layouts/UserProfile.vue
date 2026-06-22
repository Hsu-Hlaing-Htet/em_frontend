<template>
    <Menu ref="userMenu" :model="profileMenuItems" :popup="true" />
    <button
        type="button"
        class="flex cursor-pointer items-center gap-3 py-1.5 pl-1.5 pr-3 transition-all duration-300"
        @click="togglePanel"
    >
        <Avatar
            :image="avatarUrl"
            :label="avatarLabel"
            size="large"
            shape="circle"
        />

        <div class="hidden min-w-0 flex-col lg:flex">
            <span class="whitespace-nowrap text-sm">{{ user?.name || 'Admin User' }}</span>
            <span class="text-xs capitalize">{{ user?.role || 'admin' }}</span>
        </div>
        <i class="pi pi-angle-down ml-auto hidden text-sm transition-all duration-200 lg:block" />
    </button>
</template>

<script>
import { ref, computed, defineComponent } from 'vue';
import { useAuthStore } from '@/modules/auth/store';
import { useRouter } from 'vue-router';
import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';
import ProfileImage from '@/assets/images/profile.png';
export default defineComponent({
    name: 'UserProfile',
    components: {
        Avatar,
        Menu,
    },
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();
        const userMenu = ref();

        const user = computed(() => authStore.user);

        const avatarUrl = computed(() => {
    if (user.value?.profile?.avatar_path) {
        return user.value.profile.avatar_path;
    }

    return ProfileImage;
});
        const profileMenuItems = ref([
            {
                label: 'Profile',
                icon: 'pi pi-user',
                command: () => {
                    router.push('/admin/settings');
                },
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => {
                    authStore.logout();
                },
            },
        ]);

        const togglePanel = (event) => {
            userMenu.value.toggle(event);
        };

        return {
            user,
            userMenu,
            avatarUrl,
            profileMenuItems,
            togglePanel,
        };
    },
});
</script>
