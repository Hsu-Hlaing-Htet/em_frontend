<script setup>
defineProps({
    icon: {
        type: String,
        default: 'pi pi-inbox',
    },
    title: {
        type: String,
        default: 'Nothing here yet',
    },
    message: {
        type: String,
        default: 'There are no records to show.',
    },
    compact: {
        type: Boolean,
        default: false,
    },
    primaryCta: {
        type: Object,
        default: null,
    },
    secondaryCta: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(['primary', 'secondary']);

function runAction(cta, eventName) {
    if (typeof cta?.onClick === 'function') {
        cta.onClick();
    }
    emit(eventName, cta);
}
</script>

<template>
    <div
        class="rw-empty-state"
        :class="{ 'rw-empty-state--compact': compact }"
        role="status"
    >
        <div
            class="rw-empty-state__icon"
            aria-hidden="true"
        >
            <i :class="icon" />
        </div>

        <h3 class="rw-empty-state__title">{{ title }}</h3>
        <p class="rw-empty-state__message">{{ message }}</p>

        <div
            v-if="primaryCta || secondaryCta || $slots.actions"
            class="rw-empty-state__actions"
        >
            <slot name="actions">
                <template v-if="secondaryCta">
                    <router-link
                        v-if="secondaryCta.to"
                        :to="secondaryCta.to"
                        class="rw-status-button rw-status-button--secondary"
                    >
                        {{ secondaryCta.label }}
                    </router-link>
                    <button
                        v-else
                        type="button"
                        class="rw-status-button rw-status-button--secondary"
                        @click="runAction(secondaryCta, 'secondary')"
                    >
                        {{ secondaryCta.label }}
                    </button>
                </template>

                <template v-if="primaryCta">
                    <router-link
                        v-if="primaryCta.to"
                        :to="primaryCta.to"
                        class="rw-status-button rw-status-button--primary"
                    >
                        {{ primaryCta.label }}
                    </router-link>
                    <button
                        v-else
                        type="button"
                        class="rw-status-button rw-status-button--primary"
                        @click="runAction(primaryCta, 'primary')"
                    >
                        {{ primaryCta.label }}
                    </button>
                </template>
            </slot>
        </div>
    </div>
</template>
