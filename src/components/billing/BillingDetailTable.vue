<template>
    <div :class="billingDetailTableClasses.wrap">
        <table
            :class="billingDetailTableClasses.table"
            :style="{ minWidth }"
        >
            <thead>
                <tr>
                    <th
                        v-for="column in columns"
                        :key="column.key"
                        :class="column.align === 'right' ? billingDetailTableClasses.thNumeric : billingDetailTableClasses.th"
                    >
                        {{ column.label }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(row, rowIndex) in rows"
                    :key="rowKey(row, rowIndex)"
                >
                    <template
                        v-for="column in columns"
                        :key="column.key"
                    >
                        <td
                            v-if="shouldRenderCell(column, rowIndex)"
                            :rowspan="rowspanFor(column)"
                            :class="column.align === 'right' ? billingDetailTableClasses.tdNumeric : billingDetailTableClasses.td"
                        >
                            <slot
                                :name="`cell-${column.key}`"
                                :row="row"
                                :value="row[column.key]"
                            >
                                {{ formatCell(row[column.key]) }}
                            </slot>
                        </td>
                    </template>
                </tr>
                <tr v-if="!rows.length">
                    <td
                        :colspan="columns.length"
                        :class="billingDetailTableClasses.tdEmpty"
                    >
                        {{ emptyMessage }}
                    </td>
                </tr>
            </tbody>
            <tfoot v-if="rows.length && hasBillingValue(totalValue)">
                <tr>
                    <td
                        :colspan="Math.max(columns.length - 1, 1)"
                        :class="billingDetailTableClasses.totalLabel"
                    >
                        {{ totalLabel }}
                    </td>
                    <td :class="billingDetailTableClasses.totalValue">
                        {{ totalValue }}
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import {
    billingDetailTableClasses,
    hasBillingValue,
} from '@/helpers/billing/billingDetailHelpers';

export default defineComponent({
    name: 'BillingDetailTable',
    props: {
        columns: {
            type: Array,
            required: true,
        },
        rows: {
            type: Array,
            default: () => [],
        },
        rowKeyField: {
            type: String,
            default: 'id',
        },
        emptyMessage: {
            type: String,
            default: 'No records found.',
        },
        totalLabel: {
            type: String,
            default: 'Total',
        },
        totalValue: {
            type: [String, Number],
            default: '',
        },
        minWidth: {
            type: String,
            default: '44rem',
        },
        rowspanKeys: {
            type: Array,
            default: () => [],
        },
    },
    setup(props) {
        const rowspanKeySet = () => new Set(props.rowspanKeys || []);

        const rowKey = (row, index) => row?.[props.rowKeyField] ?? index;

        const shouldRenderCell = (column, rowIndex) => {
            if (!rowspanKeySet().has(column.key)) {
                return true;
            }

            return rowIndex === 0;
        };

        const rowspanFor = (column) => {
            if (!rowspanKeySet().has(column.key) || props.rows.length <= 1) {
                return undefined;
            }

            return props.rows.length;
        };

        const formatCell = (value) => {
            if (value === '—' || value === '–' || value === '-') {
                return value;
            }

            return hasBillingValue(value) ? value : '';
        };

        return {
            billingDetailTableClasses,
            hasBillingValue,
            rowKey,
            shouldRenderCell,
            rowspanFor,
            formatCell,
        };
    },
});
</script>
