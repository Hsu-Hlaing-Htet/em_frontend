<template>
    <footer class="flex items-center justify-center">
        <div class="text-center">
            <span class="text-sm text-[var(--admin-text-muted)]">&copy; {{ year }} Rosewood Royale</span>
            <DevelopedByCredit />
        </div>
    </footer>
</template>

<script>
import DevelopedByCredit from '@/components/global/DevelopedByCredit.vue';

export default {
    name: 'Footer',
    components: {
        DevelopedByCredit,
    },
    computed: {
        year() {
            return new Date().getFullYear();
        },
    },
};
</script>
