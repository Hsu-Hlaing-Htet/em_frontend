<template>
    <div ref="rootEl" class="admin-user-profile">
        <button
            type="button"
            class="flex cursor-pointer items-center gap-3 py-1.5 pl-1.5 pr-3 transition-all duration-300"
            aria-haspopup="menu"
            :aria-expanded="open"
            @click.stop="toggle"
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

        <Teleport to="body">
            <ul
                v-if="open"
                ref="menuEl"
                class="admin-user-profile-menu"
                :style="menuStyle"
                role="menu"
                :aria-label="t('common.profile')"
                @click.stop
            >
                <li
                    role="menuitem"
                    tabindex="0"
                    @click.stop="goToProfile"
                    @keydown.enter.prevent="goToProfile"
                >
                    <i class="pi pi-user" aria-hidden="true" />
                    {{ t('common.profile') }}
                </li>
                <li
                    role="menuitem"
                    tabindex="0"
                    @click.stop="handleLogout"
                    @keydown.enter.prevent="handleLogout"
                >
                    <i class="pi pi-sign-out" aria-hidden="true" />
                    {{ t('common.logout') }}
                </li>
            </ul>
        </Teleport>
    </div>
</template>

<script>
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Avatar from 'primevue/avatar';
import { useAuthStore } from '@/modules/auth/store';
import ProfileImage from '@/assets/images/profile.png';

export default defineComponent({
    name: 'UserProfile',
    components: {
        Avatar,
    },
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();
        const { t } = useI18n();
        const open = ref(false);
        const rootEl = ref(null);
        const menuEl = ref(null);
        const menuStyle = ref({});

        const user = computed(() => authStore.user);

        const avatarUrl = computed(() => {
            if (user.value?.profile?.avatar_path) {
                return user.value.profile.avatar_path;
            }

            return ProfileImage;
        });

        const avatarLabel = computed(() => {
            const name = user.value?.name || 'A';

            return name.charAt(0).toUpperCase();
        });

        const updateMenuPosition = () => {
            const rect = rootEl.value?.getBoundingClientRect();

            if (!rect) {
                return;
            }

            menuStyle.value = {
                top: `${Math.round(rect.bottom + 6)}px`,
                right: `${Math.round(window.innerWidth - rect.right)}px`,
            };
        };

        const close = () => {
            open.value = false;
        };

        const toggle = () => {
            open.value = !open.value;

            if (open.value) {
                updateMenuPosition();
            }
        };

        const goToProfile = () => {
            close();
            router.push({ name: 'adminProfile' });
        };

        const handleLogout = async () => {
            close();
            await authStore.logout();
            await router.push({ name: 'login' });
        };

        const onDocumentClick = (event) => {
            if (rootEl.value?.contains(event.target) || menuEl.value?.contains(event.target)) {
                return;
            }

            close();
        };

        const onEscape = (event) => {
            if (event.key === 'Escape') {
                close();
            }
        };

        onMounted(() => {
            document.addEventListener('click', onDocumentClick);
            document.addEventListener('keydown', onEscape);
            window.addEventListener('resize', updateMenuPosition);
        });

        onBeforeUnmount(() => {
            document.removeEventListener('click', onDocumentClick);
            document.removeEventListener('keydown', onEscape);
            window.removeEventListener('resize', updateMenuPosition);
        });

        return {
            t,
            open,
            rootEl,
            menuEl,
            menuStyle,
            user,
            avatarUrl,
            avatarLabel,
            toggle,
            goToProfile,
            handleLogout,
        };
    },
});
</script>

<style scoped>
.admin-user-profile {
    position: relative;
    z-index: 1300;
    overflow: visible !important;
}

.admin-user-profile-menu {
    position: fixed;
    z-index: 2000;
    min-width: 10rem;
    max-width: min(14rem, calc(100vw - 1.5rem));
    margin: 0;
    padding: 0.35rem;
    list-style: none;
    border-radius: 8px;
    border: 1px solid var(--rw-border, var(--admin-border));
    background: var(--rw-surface-solid, var(--admin-surface-solid));
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.admin-user-profile-menu li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    color: var(--rw-text, var(--admin-text));
    cursor: pointer;
}

.admin-user-profile-menu li:hover,
.admin-user-profile-menu li:focus-visible {
    background: var(--admin-border, var(--rw-border));
    outline: none;
}
</style>
