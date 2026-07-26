<script setup>
import { inject } from 'vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import DashboardManagedSection from '../components/DashboardManagedSection.vue';

const dashboard = inject('dashboard');
</script>

<template>
    <div class="flex flex-col gap-5">
        <DashboardManagedSection
            section-key="roles"
            title="User Roles & Permissions"
            subtitle="Role assignments and access control overview"
            admin-route="/admin/roles"
        >
            <template #default="{ items }">
                <div class="dashboard-table-wrap">
                    <table class="dashboard-table">
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Users</th>
                                <th>Permissions</th>
                                <th>Status</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="item in items"
                                :key="item.id"
                                :class="{ 'dashboard-row-selected': dashboard.selectedRole?.id === item.id }"
                            >
                                <td>{{ item.name }}</td>
                                <td>{{ item.users }}</td>
                                <td>{{ item.permissions }}</td>
                                <td><StatusBadge :value="item.status" /></td>
                                <td>
                                    <button
                                        type="button"
                                        class="dashboard-control"
                                        :class="{ 'dashboard-control-active': dashboard.selectedRole?.id === item.id }"
                                        @click="dashboard.selectRole(item.id)"
                                    >
                                        Permissions
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </DashboardManagedSection>

        <article
            v-if="dashboard.selectedRole"
            class="dashboard-panel"
        >
            <h2 class="m-0 text-base text-rosewood">
                Permission Matrix — {{ dashboard.selectedRole.name }}
            </h2>
            <p class="m-0 mt-1 text-sm text-[var(--admin-text-muted)]">
                Module-level access for the selected role
            </p>

            <div class="dashboard-table-wrap mt-4">
                <table class="dashboard-table">
                    <thead>
                        <tr>
                            <th>Module</th>
                            <th>View</th>
                            <th>Create</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="item in dashboard.permissionModules"
                            :key="item.module"
                        >
                            <td>{{ item.module }}</td>
                            <td>{{ item.view ? 'Yes' : 'No' }}</td>
                            <td>{{ item.create ? 'Yes' : 'No' }}</td>
                            <td>{{ item.edit ? 'Yes' : 'No' }}</td>
                            <td>{{ item.delete ? 'Yes' : 'No' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </article>
    </div>
</template>

<style scoped src="../dashboardShared.css"></style>

<style scoped>
.dashboard-row-selected {
    background: var(--rw-hover-bg);
}
</style>
