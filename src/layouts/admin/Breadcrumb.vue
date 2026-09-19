<template>
    <div
        v-if="showBreadcrumb"
        class="align-items-center"
        :class="isCustomerPortal ? 'customer-breadcrumb' : 'hidden lg:flex'"
    >

        <Breadcrumb v-if="breadcumbs.length > 0" :home="home" :model="breadcumbs">
            <template #item="{ item }">
                <router-link
                    :to="resolveTo(item)"
                    custom
                    v-slot="{ href, navigate, isActive, isExactActive }"
                >
                    <a
                        :href="href"
                        @click="navigate"
                        class="text-breadcrumb cursor-auto"
                        :class="{
                            'text-base': !isCustomerPortal,
                            'breadcrumb-link-active': !isActive || !isExactActive,
                        }"
                    >{{ resolveTitle(item) }}</a>
                </router-link>
            </template>
        </Breadcrumb>
    </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import Breadcrumb from 'primevue/breadcrumb';
import Divider from 'primevue/divider';

export default defineComponent({
    name: 'AppBreadcrumb',
    components: { Breadcrumb, Divider },
    setup() {
        const route = useRoute();
        const { t, te } = useI18n();
        const isCustomerPortal = computed(() => (
            route.path.startsWith('/customer')
            || route.name?.startsWith('customer')
            || route.name === 'customerDashboard'
        ));

        const home = computed(() => ({
            routeName: isCustomerPortal.value ? 'customerDashboard' : 'dashboard',
            to: { name: isCustomerPortal.value ? 'customerDashboard' : 'dashboard' },
            titleKey: 'common.home',
        }));

        const breadcumbs = computed(() => route.meta.breadcrumbs || []);

        const showBreadcrumb = computed(() => (
            route.name !== 'dashboard'
            && route.name !== 'customerDashboard'
        ));

        const resolveTitle = (item) => {
            if (item?.titleKey) {
                return t(item.titleKey);
            }

            if (item?.title && te(`routes.${item.title}`)) {
                return t(`routes.${item.title}`);
            }

            return item?.title || '';
        };

        const resolveTo = (item) => {
            if (item?.to) {
                return item.to;
            }

            const params = { ...(item?.params || {}) };

            if (item?.routeName === 'showRoom' && route.params?.id && !params.id) {
                params.id = route.params.id;
            }

            if (item?.routeName === 'invoiceDocument' && route.query?.invoice_id && !params.id) {
                params.id = route.query.invoice_id;
            }

            return {
                name: item.routeName,
                params,
                query: item?.query || {},
            };
        };

        return { breadcumbs, home, showBreadcrumb, resolveTitle, resolveTo, isCustomerPortal };
    },
});
</script>

<style scoped>
.p-breadcrumb {
    border: none !important;
    background-color: transparent !important;
}


.breadcrumb-link-active {
    cursor: pointer;
}

.text-breadcrumb:hover {
    color: var(--admin-primary) !important;
}
</style>
