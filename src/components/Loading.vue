<template>
    <div class="admin-crud-loading">
        <ProgressSpinner stroke-width="4" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import ProgressSpinner from 'primevue/progressspinner';

export default defineComponent({
    name: 'Loading',
    components: { ProgressSpinner },
});
</script>

<style scoped>
.admin-crud-loading {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--admin-surface-solid) 75%, transparent);
    border-radius: inherit;
}
</style>
