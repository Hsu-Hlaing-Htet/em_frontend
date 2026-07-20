<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAnimatedCounter } from '@/composables/public/useAnimatedCounter';

const props = defineProps({
    stats: {
        type: Object,
        required: true,
    },
});

const sectionRef = ref(null);

const statItems = [
    { key: 'total_properties', label: 'Properties Listed', suffix: '+' },
    { key: 'total_clients', label: 'Happy Clients', suffix: '+' },
    { key: 'years_of_service', label: 'Years of Service', suffix: '' },
    { key: 'available', label: 'Available Units', suffix: '' },
];

const counters = statItems.map((item) => ({
    ...item,
    source: computed(() => props.stats[item.key] ?? 0),
    counter: null,
}));

counters.forEach((item) => {
    item.counter = useAnimatedCounter(item.source, { suffix: item.suffix });
});

onMounted(() => {
    counters.forEach((item, index) => {
        const card = sectionRef.value?.querySelectorAll('.stat-card')[index];

        if (card) {
            item.counter.observeElement(card);
        }
    });
});
</script>

<template>
    <section
        ref="sectionRef"
        class="section reveal landing-stats"
    >
        <div class="container">
            <div class="section-heading-row">
                <h2>Rosewood Royale in Numbers</h2>
            </div>

            <div class="layout-columns mt-4">
                <article
                    v-for="item in counters"
                    :key="item.key"
                    class="col-3 stat-card landing-stat-card"
                >
                    <h3>{{ item.counter.formattedValue() }}</h3>
                    <p>{{ item.label }}</p>
                </article>
            </div>
        </div>
    </section>
</template>
