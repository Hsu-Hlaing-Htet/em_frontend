<template>
    <div class="dashboard-area-chart">
        <svg
            :viewBox="`0 0 ${width} ${height}`"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <defs>
                <linearGradient
                    :id="`${chartId}-billed`"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                >
                    <stop
                        offset="0%"
                        stop-color="#e8e8e8"
                        stop-opacity="0.22"
                    />
                    <stop
                        offset="100%"
                        stop-color="#e8e8e8"
                        stop-opacity="0"
                    />
                </linearGradient>
                <linearGradient
                    :id="`${chartId}-collected`"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                >
                    <stop
                        offset="0%"
                        stop-color="#9b2d45"
                        stop-opacity="0.35"
                    />
                    <stop
                        offset="100%"
                        stop-color="#9b2d45"
                        stop-opacity="0"
                    />
                </linearGradient>
            </defs>

            <g class="dashboard-area-chart__grid">
                <line
                    v-for="(line, index) in gridLines"
                    :key="`grid-${index}`"
                    :x1="padding.left"
                    :x2="width - padding.right"
                    :y1="line"
                    :y2="line"
                />
            </g>

            <path
                v-if="billedArea"
                :d="billedArea"
                :fill="`url(#${chartId}-billed)`"
            />
            <path
                v-if="collectedArea"
                :d="collectedArea"
                :fill="`url(#${chartId}-collected)`"
            />

            <path
                v-if="billedLine"
                :d="billedLine"
                class="dashboard-area-chart__line dashboard-area-chart__line--billed"
            />
            <path
                v-if="collectedLine"
                :d="collectedLine"
                class="dashboard-area-chart__line dashboard-area-chart__line--collected"
            />

            <g class="dashboard-area-chart__dots">
                <circle
                    v-for="(point, index) in collectedPoints"
                    :key="`dot-${index}`"
                    :cx="point.x"
                    :cy="point.y"
                    r="3.5"
                    class="dashboard-area-chart__dot dashboard-area-chart__dot--collected"
                />
                <circle
                    v-for="(point, index) in billedPoints"
                    :key="`dot-billed-${index}`"
                    :cx="point.x"
                    :cy="point.y"
                    r="3.5"
                    class="dashboard-area-chart__dot dashboard-area-chart__dot--billed"
                />
            </g>
        </svg>

        <div class="dashboard-area-chart__labels">
            <span
                v-for="(point, index) in points"
                :key="`label-${index}`"
            >
                {{ point.month }}
            </span>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
    name: 'DashboardAreaChart',
    props: {
        points: {
            type: Array,
            default: () => [],
        },
        width: {
            type: Number,
            default: 640,
        },
        height: {
            type: Number,
            default: 220,
        },
    },
    setup(props) {
        const chartId = `area-${Math.random().toString(36).slice(2, 9)}`;
        const padding = { top: 16, right: 12, bottom: 8, left: 12 };

        const normalizedPoints = computed(() => (
            (props.points || []).map((point) => ({
                month: point.month,
                billed: Number(point.billed) || 0,
                collected: Number(point.collected) || 0,
            }))
        ));

        const maxValue = computed(() => {
            const values = normalizedPoints.value.flatMap((point) => [point.billed, point.collected]);
            return Math.max(...values, 1);
        });

        const chartWidth = computed(() => props.width - padding.left - padding.right);
        const chartHeight = computed(() => props.height - padding.top - padding.bottom);

        function buildSeries(key) {
            const series = normalizedPoints.value;

            if (!series.length) {
                return [];
            }

            return series.map((point, index) => {
                const x = series.length === 1
                    ? padding.left + chartWidth.value / 2
                    : padding.left + (index / (series.length - 1)) * chartWidth.value;
                const y = padding.top + chartHeight.value - ((point[key] / maxValue.value) * chartHeight.value);

                return { x, y, value: point[key] };
            });
        }

        const billedPoints = computed(() => buildSeries('billed'));
        const collectedPoints = computed(() => buildSeries('collected'));

        function buildLinePath(points) {
            if (!points.length) {
                return '';
            }

            return points
                .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
                .join(' ');
        }

        function buildAreaPath(points) {
            if (!points.length) {
                return '';
            }

            const line = buildLinePath(points);
            const first = points[0];
            const last = points[points.length - 1];
            const baseY = padding.top + chartHeight.value;

            return `${line} L${last.x.toFixed(2)} ${baseY} L${first.x.toFixed(2)} ${baseY} Z`;
        }

        const billedLine = computed(() => buildLinePath(billedPoints.value));
        const collectedLine = computed(() => buildLinePath(collectedPoints.value));
        const billedArea = computed(() => buildAreaPath(billedPoints.value));
        const collectedArea = computed(() => buildAreaPath(collectedPoints.value));

        const gridLines = computed(() => {
            const lines = [];
            const rows = 4;

            for (let index = 0; index <= rows; index += 1) {
                lines.push(padding.top + (index / rows) * chartHeight.value);
            }

            return lines;
        });

        return {
            chartId,
            padding,
            billedPoints,
            collectedPoints,
            billedLine,
            collectedLine,
            billedArea,
            collectedArea,
            gridLines,
            points: normalizedPoints,
        };
    },
});
</script>

<style scoped>
.dashboard-area-chart {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    min-height: 14rem;
}

.dashboard-area-chart svg {
    display: block;
    width: 100%;
    height: 14rem;
}

.dashboard-area-chart__grid line {
    stroke: rgba(255, 255, 255, 0.06);
    stroke-width: 1;
}

.dashboard-area-chart__line {
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.dashboard-area-chart__line--billed {
    stroke: rgba(232, 232, 232, 0.92);
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.18));
}

.dashboard-area-chart__line--collected {
    stroke: #b83a55;
    filter: drop-shadow(0 0 6px rgba(184, 58, 85, 0.45));
}

.dashboard-area-chart__dot {
    fill: #121214;
    stroke-width: 2;
}

.dashboard-area-chart__dot--billed {
    stroke: rgba(232, 232, 232, 0.92);
}

.dashboard-area-chart__dot--collected {
    stroke: #d45a72;
}

.dashboard-area-chart__labels {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    gap: 0.35rem;
    padding: 0 0.35rem;
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--admin-text-muted);
    text-align: center;
}
</style>
