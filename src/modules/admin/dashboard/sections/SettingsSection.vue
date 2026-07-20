<script setup>
import { inject } from 'vue';

const dashboard = inject('dashboard');
</script>

<template>
    <article class="dashboard-panel">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 class="m-0 text-base text-rosewood">
                    Dashboard Settings
                </h2>
                <p class="m-0 mt-1 text-sm text-[var(--admin-text-muted)]">
                    Preferences and platform configuration
                </p>
            </div>

            <button
                type="button"
                class="dashboard-control dashboard-control-primary"
                @click="dashboard.saveSettings"
            >
                Save settings
            </button>
        </div>

        <p
            v-if="dashboard.settingsSaved"
            class="dashboard-settings-success"
        >
            Settings saved successfully.
        </p>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label class="dashboard-setting-field">
                <span>Default section</span>
                <select
                    v-model="dashboard.settings.default_section"
                    class="dashboard-setting-input"
                >
                    <option
                        v-for="section in dashboard.sections"
                        :key="section.key"
                        :value="section.key"
                    >
                        {{ section.label }}
                    </option>
                </select>
            </label>

            <label class="dashboard-setting-field">
                <span>Refresh interval (seconds)</span>
                <input
                    v-model.number="dashboard.settings.refresh_interval_seconds"
                    type="number"
                    min="30"
                    max="300"
                    class="dashboard-setting-input"
                >
            </label>

            <label class="dashboard-setting-field">
                <span>Currency</span>
                <select
                    v-model="dashboard.settings.currency"
                    class="dashboard-setting-input"
                >
                    <option value="USD">
                        USD
                    </option>
                    <option value="MMK">
                        MMK
                    </option>
                </select>
            </label>

            <label class="dashboard-setting-field">
                <span>Timezone</span>
                <select
                    v-model="dashboard.settings.timezone"
                    class="dashboard-setting-input"
                >
                    <option value="Asia/Yangon">
                        Asia/Yangon
                    </option>
                    <option value="UTC">
                        UTC
                    </option>
                </select>
            </label>

            <label class="dashboard-setting-toggle">
                <input
                    v-model="dashboard.settings.auto_refresh"
                    type="checkbox"
                >
                <span>Enable auto refresh</span>
            </label>

            <label class="dashboard-setting-toggle">
                <input
                    v-model="dashboard.settings.email_digest"
                    type="checkbox"
                >
                <span>Email digest notifications</span>
            </label>

            <label class="dashboard-setting-toggle">
                <input
                    v-model="dashboard.settings.slack_alerts"
                    type="checkbox"
                >
                <span>Slack alerts</span>
            </label>

            <label class="dashboard-setting-toggle">
                <input
                    v-model="dashboard.settings.compact_tables"
                    type="checkbox"
                >
                <span>Compact table layout</span>
            </label>

            <label class="dashboard-setting-toggle">
                <input
                    v-model="dashboard.settings.show_revenue_chart"
                    type="checkbox"
                >
                <span>Show revenue chart on overview</span>
            </label>
        </div>
    </article>
</template>

<style scoped src="../dashboardShared.css"></style>

<style scoped>
.dashboard-setting-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.875rem;
    color: var(--admin-text-muted);
}

.dashboard-setting-input {
    border-radius: 0.75rem;
    border: 1px solid var(--admin-border);
    background: var(--admin-surface-solid);
    padding: 0.65rem 0.85rem;
    color: var(--admin-text);
}

.dashboard-setting-toggle {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    border-radius: 0.75rem;
    border: 1px solid var(--admin-border);
    padding: 0.85rem;
    font-size: 0.875rem;
}

.dashboard-settings-success {
    margin: 0 0 1rem;
    border-radius: 0.75rem;
    background: rgba(16, 185, 129, 0.12);
    color: #047857;
    padding: 0.65rem 0.85rem;
    font-size: 0.875rem;
}
</style>
