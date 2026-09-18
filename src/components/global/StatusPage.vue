<script setup>
defineProps({
    code: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    hint: {
        type: String,
        default: '',
    },
    embedded: {
        type: Boolean,
        default: false,
    },
    primaryCta: {
        type: Object,
        required: true,
    },
    secondaryCta: {
        type: Object,
        default: () => ({
            label: 'Go back',
            action: 'back',
        }),
    },
});

const emit = defineEmits(['back', 'primary', 'secondary']);

function runAction(cta, eventName) {
    if (typeof cta?.onClick === 'function') {
        cta.onClick();
    }
    emit(eventName, cta);
}

function onSecondary(cta) {
    if (cta?.action === 'back' || !cta?.to) {
        emit('back');
        return;
    }
    runAction(cta, 'secondary');
}
</script>

<template>
    <div
        class="rw-status-page"
        :class="{ 'rw-status-page--embedded': embedded }"
    >
        <div
            class="rw-status-page__glow"
            aria-hidden="true"
        />

        <div class="rw-status-card">
            <p
                class="rw-status-code"
                aria-hidden="true"
            >
                {{ code }}
            </p>

            <div
                class="rw-status-icon"
                aria-hidden="true"
            >
                <i :class="icon" />
            </div>

            <p class="rw-status-label">{{ code }}</p>
            <h1 class="rw-status-title">{{ title }}</h1>
            <p class="rw-status-message">{{ message }}</p>
            <p
                v-if="hint"
                class="rw-status-hint"
            >
                {{ hint }}
            </p>

            <div class="rw-status-actions">
                <template v-if="secondaryCta">
                    <router-link
                        v-if="secondaryCta.to"
                        :to="secondaryCta.to"
                        class="rw-status-button rw-status-button--secondary"
                    >
                        <i
                            v-if="secondaryCta.icon !== false"
                            :class="secondaryCta.icon || 'pi pi-arrow-left'"
                            aria-hidden="true"
                        />
                        {{ secondaryCta.label }}
                    </router-link>
                    <button
                        v-else
                        type="button"
                        class="rw-status-button rw-status-button--secondary"
                        @click="onSecondary(secondaryCta)"
                    >
                        <i
                            v-if="secondaryCta.icon !== false"
                            :class="secondaryCta.icon || 'pi pi-arrow-left'"
                            aria-hidden="true"
                        />
                        {{ secondaryCta.label }}
                    </button>
                </template>

                <router-link
                    v-if="primaryCta.to"
                    :to="primaryCta.to"
                    class="rw-status-button rw-status-button--primary"
                >
                    <i
                        v-if="primaryCta.icon"
                        :class="primaryCta.icon"
                        aria-hidden="true"
                    />
                    {{ primaryCta.label }}
                </router-link>
                <button
                    v-else
                    type="button"
                    class="rw-status-button rw-status-button--primary"
                    @click="runAction(primaryCta, 'primary')"
                >
                    <i
                        v-if="primaryCta.icon"
                        :class="primaryCta.icon"
                        aria-hidden="true"
                    />
                    {{ primaryCta.label }}
                </button>
            </div>
        </div>
    </div>
</template>
