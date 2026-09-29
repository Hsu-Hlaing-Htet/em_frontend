<template>
    <div class="customer-portal-page customer-resource-not-found">
        <StatusPage
            code="404"
            icon="pi pi-compass"
            :title="copy.title"
            :message="copy.message"
            embedded
            :primary-cta="primaryCta"
            :secondary-cta="null"
        />
    </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import StatusPage from '@/components/global/StatusPage.vue';
import { getCustomerResourceNotFound } from '@/helpers/customer/resourceNotFound';

export default defineComponent({
    name: 'CustomerResourceNotFound',
    components: { StatusPage },
    props: {
        resource: {
            type: String,
            default: 'page',
        },
    },
    setup(props) {
        const copy = computed(() => getCustomerResourceNotFound(props.resource));
        const primaryCta = computed(() => ({
            label: copy.value.backLabel,
            to: copy.value.backRoute,
            icon: 'pi pi-arrow-left',
        }));

        return {
            copy,
            primaryCta,
        };
    },
});
</script>
