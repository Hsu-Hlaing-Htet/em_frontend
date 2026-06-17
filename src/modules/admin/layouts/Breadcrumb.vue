<template>
    <div
        v-if="showBreadcrumb"
        class="align-items-center hidden lg:flex"
    >

        <Breadcrumb v-if="breadcumbs.length > 0" :home="home" :model="breadcumbs">
            <template #item="{ item }">
                <router-link
                    :to="{ name: item.routeName }"
                    custom
                    v-slot="{ href, navigate, isActive, isExactActive }"
                >
                    <a
                        :href="href"
                        @click="navigate"
                        class="text-breadcrumb text-base cursor-auto"
                        :class="{
                            'breadcrumb-link-active': !isActive || !isExactActive,
                        }"
                    >{{ item.title }}</a>
                </router-link>
            </template>
        </Breadcrumb>
    </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import Breadcrumb from 'primevue/breadcrumb';
import Divider from 'primevue/divider';

export default defineComponent({
    name: 'AppBreadcrumb',
    components: { Breadcrumb, Divider },
    setup() {
        const route = useRoute();
        const home = ref({
            routeName: 'dashboard',
            to: '/admin/dashboard',
            title: 'Home',
        });

        const breadcumbs = computed(() => route.meta.breadcrumbs || []);

        const showBreadcrumb = computed(() => route.name !== 'dashboard');

        return { breadcumbs, home, showBreadcrumb };
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
