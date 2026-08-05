<template>
    <svg
        class="dashboard-sparkline"
        :viewBox="`0 0 ${width} ${height}`"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <defs>
            <linearGradient
                :id="gradientId"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
            >
                <stop
                    offset="0%"
                    :stop-color="color"
                    stop-opacity="0.28"
                />
                <stop
                    offset="100%"
                    :stop-color="color"
                    stop-opacity="0"
                />
            </linearGradient>
        </defs>
        <path
            v-if="areaPath"
            :d="areaPath"
            :fill="`url(#${gradientId})`"
        />
        <path
            v-if="linePath"
            :d="linePath"
            fill="none"
            :stroke="color"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="dashboard-sparkline__line"
            :style="{ filter: `drop-shadow(0 0 4px ${glowColor})` }"
        />
        <circle
            v-if="lastPoint"
            :cx="lastPoint.x"
            :cy="lastPoint.y"
            r="3"
            :fill="color"
            class="dashboard-sparkline__dot"
            :style="{ filter: `drop-shadow(0 0 5px ${glowColor})` }"
        />
    </svg>
</template>

<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
    name: 'DashboardSparkline',
    props: {
        values: {
            type: Array,
            default: () => [],
        },
        color: {
            type: String,
            default: '#10b981',
        },
        width: {
            type: Number,
            default: 140,
        },
        height: {
            type: Number,
            default: 56,
        },
    },
    setup(props) {
        const gradientId = computed(() => (
            `spark-fill-${Math.abs(hashColor(props.color))}-${props.values.length}`
        ));

        const points = computed(() => {
            const series = (props.values || [])
                .map((value) => Number(value))
                .filter((value) => Number.isFinite(value));

            if (series.length === 0) {
                return [];
            }

            const min = Math.min(...series);
            const max = Math.max(...series);
            const range = max - min || 1;
            const padY = 4;
            const usableHeight = props.height - padY * 2;

            return series.map((value, index) => {
                const x = series.length === 1
                    ? props.width / 2
                    : (index / (series.length - 1)) * props.width;
                const y = padY + usableHeight - ((value - min) / range) * usableHeight;

                return { x, y };
            });
        });

        const linePath = computed(() => {
            if (!points.value.length) {
                return '';
            }

            return points.value
                .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
                .join(' ');
        });

        const areaPath = computed(() => {
            if (!points.value.length) {
                return '';
            }

            const first = points.value[0];
            const last = points.value[points.value.length - 1];

            return `${linePath.value} L${last.x.toFixed(2)} ${props.height} L${first.x.toFixed(2)} ${props.height} Z`;
        });

        const lastPoint = computed(() => (
            points.value.length ? points.value[points.value.length - 1] : null
        ));

        const glowColor = computed(() => {
            const alpha = '66';
            const hex = String(props.color).replace('#', '');

            if (hex.length === 6) {
                return `#${hex}${alpha}`;
            }

            return props.color;
        });

        return {
            gradientId,
            linePath,
            areaPath,
            lastPoint,
            glowColor,
        };
    },
});

function hashColor(color) {
    return String(color).split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
}
</script>

<style scoped>
.dashboard-sparkline {
    display: block;
    width: 100%;
    height: 100%;
}
</style>
