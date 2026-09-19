<template>
    <div class="admin-panel customer-empty-panel">
        <RwEmptyState
            :icon="icon"
            :title="title"
            :message="message"
            :compact="compact"
            :primary-cta="primaryCta"
            :secondary-cta="secondaryCta"
            @primary="$emit('primary', $event)"
            @secondary="$emit('secondary', $event)"
        >
            <template
                v-if="$slots.actions"
                #actions
            >
                <slot name="actions" />
            </template>
        </RwEmptyState>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import RwEmptyState from '@/components/global/RwEmptyState.vue';

export default defineComponent({
    name: 'CustomerEmptyState',
    components: { RwEmptyState },
    props: {
        icon: { type: String, default: 'pi pi-inbox' },
        title: { type: String, default: 'Nothing here yet' },
        message: { type: String, default: 'There are no records to show.' },
        compact: { type: Boolean, default: true },
        primaryCta: { type: Object, default: null },
        secondaryCta: { type: Object, default: null },
    },
    emits: ['primary', 'secondary'],
});
</script>
