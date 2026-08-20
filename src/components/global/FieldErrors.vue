<template>
    <small v-if="messages.length" class="p-error">
        <div v-for="message in messages" :key="message">{{ message }}</div>
    </small>
</template>

<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
    name: 'FieldErrors',
    props: {
        errors: {
            type: Object,
            required: true,
        },
        field: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const messages = computed(() => {
            if (!props.errors?.has?.(props.field)) {
                return [];
            }

            return props.errors.get(props.field);
        });

        return { messages };
    },
});
</script>
