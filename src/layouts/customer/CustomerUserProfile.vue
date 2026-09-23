<template>
    <div ref="rootEl" class="customer-user-profile">
        <button
            type="button"
            class="flex cursor-pointer items-center gap-3 py-1.5 pl-1.5 pr-3 transition-all duration-300"
            aria-haspopup="menu"
            :aria-expanded="open"
            @click.stop="toggle"
        >
            <Avatar
                :image="resolvedAvatarUrl"
                :label="avatarLabel"
                size="large"
                shape="circle"
            />

            <div class="hidden min-w-0 flex-col lg:flex">
                <span class="customer-user-profile__name whitespace-nowrap text-sm">{{ user?.name || 'Customer' }}</span>
                <span class="customer-user-profile__role text-xs capitalize">{{ user?.role || 'customer' }}</span>
            </div>
            <i class="pi pi-angle-down ml-auto hidden text-sm transition-all duration-200 lg:block" />
        </button>

        <ul
            v-if="open"
            class="customer-user-profile-menu"
            role="menu"
            :aria-label="$t('customer.account')"
        >
            <li
                role="menuitem"
                tabindex="0"
                @click.stop="goToAccount"
                @keydown.enter.prevent="goToAccount"
            >
                <i class="pi pi-user" aria-hidden="true" />
                {{ $t('customer.account') }}
            </li>
            <li
                role="menuitem"
                tabindex="0"
                @click.stop="handleLogout"
                @keydown.enter.prevent="handleLogout"
            >
                <i class="pi pi-sign-out" aria-hidden="true" />
                {{ $t('common.logout') }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Avatar from 'primevue/avatar';
import { useAuthStore } from '@/modules/auth/store';
import ProfileImage from '@/assets/images/profile.png';

const props = defineProps({
    avatarUrl: {
        type: String,
        default: '',
    },
});

const authStore = useAuthStore();
const router = useRouter();
const open = ref(false);
const rootEl = ref(null);

const user = computed(() => authStore.user);

const resolvedAvatarUrl = computed(() => (
    props.avatarUrl
    || user.value?.profile?.avatar_path
    || ProfileImage
));

const avatarLabel = computed(() => {
    const name = user.value?.name?.trim() || 'C';

    return name.charAt(0).toUpperCase();
});

function close() {
    open.value = false;
}

function toggle() {
    open.value = !open.value;
}

function goToAccount() {
    close();
    router.push({ name: 'customerProfile' });
}

async function handleLogout() {
    close();
    await authStore.logout();
    await router.push({ name: 'login' });
}

function onDocumentClick(event) {
    if (!rootEl.value?.contains(event.target)) {
        close();
    }
}

function onEscape(event) {
    if (event.key === 'Escape') {
        close();
    }
}

onMounted(() => {
    document.addEventListener('click', onDocumentClick, true);
    document.addEventListener('keydown', onEscape);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick, true);
    document.removeEventListener('keydown', onEscape);
});
</script>

<style scoped>
.customer-user-profile {
    position: relative;
    z-index: 1300;
    overflow: visible !important;
}

.customer-user-profile-menu {
    position: absolute;
    top: calc(100% + 0.35rem);
    right: 0;
    z-index: 1301;
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

.customer-user-profile-menu li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    color: var(--rw-text, var(--admin-text));
    cursor: pointer;
}

.customer-user-profile-menu li:hover,
.customer-user-profile-menu li:focus-visible {
    background: var(--admin-border, var(--rw-border));
    outline: none;
}
</style>
