<template>
    <div class="grid grid-cols-3 gap-2">
        <Dropdown
            v-model="selectedDay"
            :options="dayOptions"
            option-label="label"
            option-value="value"
            placeholder="Day"
            class="w-full"
        />
        <Dropdown
            v-model="selectedMonth"
            :options="monthOptions"
            option-label="label"
            option-value="value"
            placeholder="Month"
            class="w-full"
        />
        <Dropdown
            v-model="selectedYear"
            :options="yearOptions"
            option-label="label"
            option-value="value"
            placeholder="Year"
            class="w-full"
        />
    </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import { parseDate } from '@/utils/formatter';

const MONTHS = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
];

function daysInMonth(year, month) {
    if (!year || !month) {
        return 31;
    }

    return new Date(year, month, 0).getDate();
}

function isFutureDate(year, month, day) {
    const today = new Date();
    const selected = new Date(year, month - 1, day);

    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    return selected > today;
}

function isRealDate(year, month, day) {
    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year
        && date.getMonth() === month - 1
        && date.getDate() === day;
}

export default defineComponent({
    name: 'DateOfBirthSelect',
    components: {
        Dropdown,
    },
    props: {
        modelValue: {
            type: [Date, String],
            default: null,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const selectedDay = ref(null);
        const selectedMonth = ref(null);
        const selectedYear = ref(null);
        const isUpdatingModel = ref(false);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();

        const yearOptions = computed(() => Array.from({ length: 121 }, (_, index) => {
            const year = currentYear - index;

            return { label: String(year), value: year };
        }));

        const monthOptions = computed(() => MONTHS.filter((month) => {
            if (selectedYear.value !== currentYear) {
                return true;
            }

            return month.value <= currentMonth;
        }));

        const dayOptions = computed(() => {
            const maxDay = daysInMonth(selectedYear.value, selectedMonth.value);
            const limit = selectedYear.value === currentYear && selectedMonth.value === currentMonth
                ? Math.min(maxDay, currentDay)
                : maxDay;

            return Array.from({ length: limit }, (_, index) => {
                const day = index + 1;

                return { label: String(day), value: day };
            });
        });

        const syncFromModel = (value) => {
            if (isUpdatingModel.value) {
                isUpdatingModel.value = false;

                if (value === null) {
                    return;
                }
            }

            const parsed = parseDate(value);

            if (!parsed || isFutureDate(parsed.getFullYear(), parsed.getMonth() + 1, parsed.getDate())) {
                selectedDay.value = null;
                selectedMonth.value = null;
                selectedYear.value = null;
                return;
            }

            selectedDay.value = parsed.getDate();
            selectedMonth.value = parsed.getMonth() + 1;
            selectedYear.value = parsed.getFullYear();
        };

        const emitDate = () => {
            const year = selectedYear.value;
            const month = selectedMonth.value;
            const day = selectedDay.value;

            if (!year || !month || !day || !isRealDate(year, month, day) || isFutureDate(year, month, day)) {
                isUpdatingModel.value = true;
                emit('update:modelValue', null);
                return;
            }

            isUpdatingModel.value = true;
            emit('update:modelValue', new Date(year, month - 1, day));
        };

        watch(() => props.modelValue, syncFromModel, { immediate: true });

        watch([selectedYear, selectedMonth], () => {
            if (selectedYear.value === currentYear && selectedMonth.value > currentMonth) {
                selectedMonth.value = null;
            }

            if (selectedDay.value && selectedDay.value > dayOptions.value.length) {
                selectedDay.value = null;
            }

            emitDate();
        });

        watch(selectedDay, emitDate);

        return {
            dayOptions,
            monthOptions,
            selectedDay,
            selectedMonth,
            selectedYear,
            yearOptions,
        };
    },
});
</script>
