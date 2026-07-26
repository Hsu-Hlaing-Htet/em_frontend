<template>
    <component
        :is="to ? 'router-link' : 'button'"
        class="customer-transaction-card"
        :to="to || undefined"
        type="button"
        @click="handleClick"
    >
        <div class="customer-transaction-top">
            <div>
                <p v-if="transactionId" class="customer-transaction-id">{{ transactionId }}</p>
                <h3 class="customer-transaction-title">{{ title }}</h3>
            </div>
            <p class="customer-transaction-amount">{{ formattedAmount }}</p>
        </div>
        <div class="customer-transaction-bottom">
            <span>{{ subtitle }}</span>
            <StatusBadge v-if="status" :value="status" />
        </div>
    </component>
</template>

<script>
import { computed, defineComponent } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import { formatCurrency } from '@/utils/formatter';

export default defineComponent({
    name: 'CustomerTransactionCard',
    components: { StatusBadge },
    props: {
        to: { type: Object, default: null },
        transactionId: { type: String, default: '' },
        title: { type: String, required: true },
        amount: { type: [String, Number], default: null },
        subtitle: { type: String, default: '' },
        status: { type: String, default: '' },
    },
    emits: ['select'],
    setup(props, { emit }) {
        const formattedAmount = computed(() => {
            if (props.amount === null || props.amount === undefined || props.amount === '') {
                return '—';
            }

            return formatCurrency(Number(props.amount));
        });

        const handleClick = () => {
            if (!props.to) {
                emit('select');
            }
        };

        return { formattedAmount, handleClick };
    },
});
</script>
