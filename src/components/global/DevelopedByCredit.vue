<template>
    <span :class="['block text-sm', textClass]">Developed by Catto_Hera</span>
</template>

<script>
export default {
    name: 'DevelopedByCredit',
    props: {
        textClass: {
            type: String,
            default: 'text-[var(--admin-text-muted)]',
        },
    },
};
</script>
