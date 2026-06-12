<template>
    <footer class="flex items-center justify-center">
        <div class="text-center">
            <span class="text-gray-500 text-sm">&copy; {{ year }} Rosewood Royale</span>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
    computed: {
        year() {
            return new Date().getFullYear();
        },
    },
};
</script>
