<template>
    <div class="flex-1 overflow-auto px-3 pb-5 pt-3">
        <Submenu
            :items="model"
            class="m-0 list-none p-0"
            :root="true"
            @menuitem-click="onMenuItemClick"
            @keydown="onKeyDown"
        />
    </div>
</template>

<script>
import Submenu from './Submenu.vue';

export default {
    components: {
        Submenu,
    },
    props: {
        model: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['menuitem-click'],
    methods: {
        onMenuItemClick(event) {
            this.$emit('menuitem-click', event);
        },
        onKeyDown(event) {
            const nodeElement = event.target;

            if (event.code === 'Enter' || event.code === 'Space') {
                nodeElement.click();
                event.preventDefault();
            }
        },
    },
};
</script>
