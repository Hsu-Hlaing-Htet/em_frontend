<template>
    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8">
        <div class="min-w-0">
            <div
                v-if="hasBillingValue(name)"
                class="mt-5 break-words text-base font-semibold leading-normal text-[var(--admin-text)]"
            >
                {{ name }}
            </div>

            <div
                v-for="(line, index) in visibleLines"
                :key="`${index}-${line}`"
                class="mt-5 break-words text-[0.9375rem] leading-relaxed text-[var(--admin-text)]"
                :class="{ 'break-all': isEmailLine(line) }"
            >
                {{ line }}
            </div>
        </div>

        <div
            v-if="hasBillingValue(date)"
            class="md:text-right"
        >
            <span class="inline-flex px-3 py-1.5 text-sm text-[var(--admin-text)] opacity-70">
                {{ date }}
            </span>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { compactBillingValues, hasBillingValue } from '@/helpers/billing/billingDetailHelpers';

export default defineComponent({
    name: 'BillingDetailCustomerSection',
    props: {
        name: {
            type: String,
            default: '',
        },
        lines: {
            type: Array,
            default: () => [],
        },
        date: {
            type: String,
            default: '',
        },
    },
    setup(props) {
        const visibleLines = computed(() => compactBillingValues(props.lines));

        const isEmailLine = (line) => typeof line === 'string' && line.includes('@');

        return {
            visibleLines,
            hasBillingValue,
            isEmailLine,
        };
    },
});
</script>
