<template>
    <span class="status-tag" :class="`status-tag-${status}`">
        {{ label }}
    </span>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { getStatusLabel } from '@/utils/formatter';

export default defineComponent({
    name: 'StatusTag',
    props: {
        status: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const label = computed(() => getStatusLabel(props.status));

        return { label };
    },
});
</script>

<style scoped>
.status-tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 6px;
    border-radius: 50px;
    font-size: 12px;
    color: #ffffff;
}

.status-tag-draft {
    background: #2563eb;
}

.status-tag-pending_approval {
    background: #d97706;

}

.status-tag-rejected {
    background: #dc2626;
}

.status-tag-active {
    background: #16a34a;
}

.status-tag-completed {
    background: #4f46e5;
}

.status-tag-cancelled {
    background: #6b7280;
}
</style>
