<template>
    <div class="customer-portal-page customer-mr-detail">
        <CustomerPageHeader
            :title="$t('customer.maintenanceRequestDetails')"
            :subtitle="$t('customer.maintenanceRequestDetailsLead')"
        >
            <template #actions>
                <router-link :to="{ name: 'customerMaintenanceRequestList' }">
                    <Button
                        :label="$t('common.back')"
                        icon="pi pi-arrow-left"
                        class="btn-outline"
                    />
                </router-link>
            </template>
        </CustomerPageHeader>

        <div v-if="!isLoading" class="customer-mr-detail__card">
            <div class="customer-mr-detail__meta">
                <p class="customer-mr-detail__request-no">
                    {{ $t('customer.requestNo') }}
                    {{ state.request_number || `MR-${String(state.id).padStart(6, '0')}` }}
                </p>
                <div class="customer-mr-detail__meta-end">
                    <StatusBadge :value="statusBadgeValue" />
                    <p class="customer-mr-detail__datetime">{{ state.created_at || '—' }}</p>
                </div>
            </div>

            <div class="customer-mr-detail__grid">
                <div class="customer-mr-detail__col">
                    <div class="customer-mr-detail__row">
                        <span class="customer-mr-detail__label">{{ $t('customer.title') }}</span>
                        <span class="customer-mr-detail__value">{{ state.title || '—' }}</span>
                    </div>
                    <div class="customer-mr-detail__row">
                        <span class="customer-mr-detail__label">{{ $t('customer.category') }}</span>
                        <span class="customer-mr-detail__value capitalize">{{ state.category || '—' }}</span>
                    </div>
                    <div class="customer-mr-detail__row">
                        <span class="customer-mr-detail__label">{{ $t('customer.priority') }}</span>
                        <span class="customer-mr-detail__value capitalize">{{ state.priority || '—' }}</span>
                    </div>
                </div>
                <div class="customer-mr-detail__col">
                    <div class="customer-mr-detail__row">
                        <span class="customer-mr-detail__label">{{ $t('customer.building') }}</span>
                        <span class="customer-mr-detail__value">{{ state.building_name || '—' }}</span>
                    </div>
                    <div class="customer-mr-detail__row">
                        <span class="customer-mr-detail__label">{{ $t('customer.room') }}</span>
                        <span class="customer-mr-detail__value">{{ state.room_number || '—' }}</span>
                    </div>
                </div>
            </div>

            <div class="customer-mr-detail__section">
                <p class="customer-mr-detail__section-label">{{ $t('customer.description') }}</p>
                <div class="customer-mr-detail__box">
                    {{ state.description || '—' }}
                </div>
                <p
                    v-if="statusRemark"
                    class="customer-mr-detail__remark"
                    :class="`is-${statusRemark.tone}`"
                >
                    <span class="customer-mr-detail__remark-label">{{ $t(statusRemark.labelKey) }}:</span>
                    {{ statusRemark.text }}
                </p>
            </div>

            <div class="customer-mr-detail__section">
                <p class="customer-mr-detail__section-label">{{ $t('customer.attachment') }}</p>
                <div class="customer-mr-detail__attachment">
                    <img
                        v-if="state.attachment_url"
                        :src="state.attachment_url"
                        alt="Uploaded attachment"
                        class="customer-mr-detail__attachment-img"
                    >
                    <p v-else class="customer-mr-detail__attachment-empty">
                        {{ $t('customer.noAttachment') }}
                    </p>
                </div>
            </div>

            <div v-if="showProgressTimeline" class="customer-mr-detail__section">
                <p class="customer-mr-detail__section-label">Progress Timeline</p>
                <div
                    class="customer-mr-detail__timeline"
                    :class="{ 'is-flowing': timelineFlowActive }"
                    :style="{
                        '--timeline-steps': timelineSteps.length,
                        '--timeline-progress': timelineProgress / 100,
                    }"
                >
                    <div class="customer-mr-detail__rail" aria-hidden="true">
                        <div class="customer-mr-detail__track" />
                        <div class="customer-mr-detail__progress" />
                        <div v-if="timelineFlowActive" class="customer-mr-detail__flow" />
                    </div>
                    <div class="customer-mr-detail__nodes">
                        <div
                            v-for="step in timelineSteps"
                            :key="step.key"
                            class="customer-mr-detail__step"
                            :class="{ 'is-reached': step.reached }"
                        >
                            <div class="customer-mr-detail__dot">
                                <i v-if="step.reached" class="pi pi-check" />
                            </div>
                            <p class="customer-mr-detail__step-label">{{ step.label }}</p>
                            <p class="customer-mr-detail__step-detail">{{ step.detail }}</p>
                            <p v-if="step.reached && step.at" class="customer-mr-detail__step-at">
                                {{ step.at }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="showUpdatedHistory"
                class="customer-mr-detail__section customer-mr-detail__section--last"
            >
                <p class="customer-mr-detail__section-label">{{ $t('customer.updatedHistory') }}</p>
                <p
                    v-if="!visibleHistory.length"
                    class="customer-mr-detail__history-empty"
                >
                    {{ $t('customer.updatedHistoryEmpty') }}
                </p>
                <ul v-else class="customer-mr-detail__history">
                    <li
                        v-for="(item, index) in visibleHistory"
                        :key="`${item.at}-${index}`"
                        class="customer-mr-detail__history-item"
                    >
                        <div class="customer-mr-detail__history-head">
                            <span class="customer-mr-detail__history-status">
                                {{ formatHistoryStatus(item.status) }}
                            </span>
                            <span class="customer-mr-detail__history-at">{{ item.at }}</span>
                        </div>
                        <p class="customer-mr-detail__history-remarks">{{ item.remarks }}</p>
                    </li>
                </ul>
            </div>
        </div>

        <Loading v-if="isLoading" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useCustomerShowMaintenanceRequest from '@/composables/customer/useCustomerShowMaintenanceRequest';

const HISTORY_STATUS_LABELS = {
    pending: 'Pending',
    accepted: 'Accepted',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
};

export default defineComponent({
    name: 'CustomerShowMaintenanceRequest',
    components: { Button, Loading, StatusBadge, CustomerPageHeader },
    setup() {
        const page = useCustomerShowMaintenanceRequest();

        const formatHistoryStatus = (status) => HISTORY_STATUS_LABELS[status] || status;

        return {
            ...page,
            formatHistoryStatus,
        };
    },
});
</script>

<style scoped>
.customer-mr-detail__card {
    border: 1px solid var(--admin-border);
    border-radius: 0.75rem;
    background: var(--admin-surface, var(--surface-card, transparent));
    padding: 1.25rem 1.35rem;
}

.customer-mr-detail__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem 1rem;
    padding-bottom: 0.85rem;
    margin-bottom: 0.85rem;
    border-bottom: 1px solid var(--admin-border);
}

.customer-mr-detail__request-no {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
}

.customer-mr-detail__datetime {
    margin: 0;
    font-size: 0.875rem;
    color: var(--admin-text-muted);
}

.customer-mr-detail__meta-end {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem 0.75rem;
}

.customer-mr-detail__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.35rem 2.5rem;
    margin-bottom: 1rem;
}

@media (min-width: 768px) {
    .customer-mr-detail__grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

.customer-mr-detail__col {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
}

.customer-mr-detail__row {
    display: grid;
    grid-template-columns: 7.5rem minmax(0, 1fr);
    gap: 0.75rem;
    align-items: start;
}

.customer-mr-detail__label {
    font-size: 0.8125rem;
    color: var(--admin-text-muted);
}

.customer-mr-detail__value {
    font-size: 0.9375rem;
    font-weight: 500;
    word-break: break-word;
}

.customer-mr-detail__section {
    margin-top: 1rem;
}

.customer-mr-detail__section--last {
    margin-bottom: 0;
}

.customer-mr-detail__section-label {
    margin: 0 0 0.45rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--admin-text-muted);
}

.customer-mr-detail__box {
    border: 1px solid var(--admin-border);
    border-radius: 0.5rem;
    padding: 0.75rem 0.9rem;
    font-size: 0.9375rem;
    line-height: 1.6;
    min-height: 4.5rem;
}

.customer-mr-detail__remark {
    margin: 0.65rem 0 0;
    font-size: 0.875rem;
    line-height: 1.55;
}

.customer-mr-detail__remark-label {
    font-weight: 600;
    margin-right: 0.3rem;
}

.customer-mr-detail__remark.is-danger {
    color: var(--status-danger-text, var(--rw-danger));
}

.customer-mr-detail__remark.is-success {
    color: var(--status-success-text, var(--rw-success));
}

.customer-mr-detail__remark.is-accent {
    color: var(--admin-primary);
}

.customer-mr-detail__attachment {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 8.5rem;
    border: 1px dashed var(--admin-border);
    border-radius: 0.5rem;
    padding: 0.75rem;
    background: color-mix(in srgb, var(--admin-border) 18%, transparent);
}

.customer-mr-detail__attachment-img {
    max-height: 14rem;
    max-width: 100%;
    object-fit: contain;
    border-radius: 0.35rem;
}

.customer-mr-detail__attachment-empty {
    margin: 0;
    font-size: 0.875rem;
    color: var(--admin-text-muted);
}

.customer-mr-detail__timeline {
    --timeline-dot: 1.4rem;
    --timeline-steps: 3;
    --timeline-progress: 0;
    position: relative;
    margin-top: 0.35rem;
    padding: 0;
}

.customer-mr-detail__rail {
    position: relative;
    z-index: 0;
    height: var(--timeline-dot);
    margin: 0;
    padding: 0;
    overflow: hidden;
    pointer-events: none;
}

.customer-mr-detail__track,
.customer-mr-detail__progress,
.customer-mr-detail__flow {
    position: absolute;
    top: 50%;
    left: calc(100% / (2 * var(--timeline-steps)));
    width: calc(100% * (var(--timeline-steps) - 1) / var(--timeline-steps));
    height: 2px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 999px;
    transform: translateY(-50%);
    line-height: 0;
    font-size: 0;
}

.customer-mr-detail__track {
    background: var(--admin-border);
}

.customer-mr-detail__progress {
    width: calc(
        100% * (var(--timeline-steps) - 1) / var(--timeline-steps) * var(--timeline-progress)
    );
    background: var(--admin-primary);
    transition: width 0.2s ease;
}

.customer-mr-detail__flow {
    left: calc(
        (100% / (2 * var(--timeline-steps)))
        + (100% * (var(--timeline-steps) - 1) / var(--timeline-steps) * var(--timeline-progress))
    );
    width: calc(100% / var(--timeline-steps));
    overflow: hidden;
    background: color-mix(in srgb, var(--admin-primary) 22%, var(--admin-border));
}

.customer-mr-detail__flow::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 42%;
    height: 100%;
    border-radius: 999px;
    transform: translate(-20%, -50%);
    background: linear-gradient(
        90deg,
        transparent 0%,
        color-mix(in srgb, var(--admin-primary) 45%, transparent) 30%,
        color-mix(in srgb, var(--admin-primary) 90%, #fff) 50%,
        color-mix(in srgb, var(--admin-primary) 45%, transparent) 70%,
        transparent 100%
    );
    animation: customer-mr-timeline-flow 2.8s ease-in-out infinite;
}

@keyframes customer-mr-timeline-flow {
    0% {
        transform: translate(-35%, -50%);
        opacity: 0.35;
    }

    50% {
        opacity: 0.95;
    }

    100% {
        transform: translate(175%, -50%);
        opacity: 0.35;
    }
}

@media (prefers-reduced-motion: reduce) {
    .customer-mr-detail__flow::after {
        animation: none;
        left: 0;
        width: 100%;
        transform: none;
        opacity: 0.55;
        background: color-mix(in srgb, var(--admin-primary) 55%, transparent);
    }
}

.customer-mr-detail__nodes {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    margin-top: calc(var(--timeline-dot) * -1);
    padding: 0;
}

.customer-mr-detail__step {
    flex: 1 1 0;
    min-width: 0;
    text-align: center;
}

.customer-mr-detail__dot {
    width: var(--timeline-dot);
    height: var(--timeline-dot);
    margin: 0 auto 0.35rem;
    border-radius: 999px;
    border: 2px solid var(--admin-border);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--admin-surface, #111);
    color: #fff;
    font-size: 0.65rem;
    box-sizing: border-box;
}

.customer-mr-detail__step.is-reached .customer-mr-detail__dot {
    border-color: var(--admin-primary);
    background: var(--admin-primary);
}

.customer-mr-detail__step-label {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--admin-text-muted);
}

.customer-mr-detail__step.is-reached .customer-mr-detail__step-label {
    color: inherit;
}

.customer-mr-detail__step-detail,
.customer-mr-detail__step-at {
    margin: 0.1rem 0 0;
    font-size: 0.7rem;
    line-height: 1.35;
    color: var(--admin-text-muted);
}

.customer-mr-detail__history-empty {
    margin: 0;
    font-size: 0.875rem;
    color: var(--admin-text-muted);
}

.customer-mr-detail__history {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
}

.customer-mr-detail__history-item {
    border: 1px solid var(--admin-border);
    border-radius: 0.45rem;
    padding: 0.55rem 0.7rem;
}

.customer-mr-detail__history-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.35rem 0.75rem;
    margin-bottom: 0.2rem;
}

.customer-mr-detail__history-status {
    font-size: 0.8125rem;
    font-weight: 600;
}

.customer-mr-detail__history-at {
    font-size: 0.75rem;
    color: var(--admin-text-muted);
}

.customer-mr-detail__history-remarks {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.45;
}

@media (max-width: 768px) {
    .customer-mr-detail__row {
        grid-template-columns: 6.25rem minmax(0, 1fr);
        gap: 0.5rem;
    }

    .customer-mr-detail__step {
        max-width: none;
    }
}
</style>
