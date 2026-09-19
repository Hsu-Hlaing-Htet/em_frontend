<template>
    <header
        class="customer-page-header"
        :class="{ 'customer-page-header--actions': $slots.actions }"
    >
        <div class="customer-page-header__text">
            <h1 class="customer-page-heading">{{ title }}</h1>
            <p v-if="subtitle" class="customer-page-lead">{{ subtitle }}</p>
        </div>
        <div v-if="$slots.actions" class="customer-page-header__actions">
            <slot name="actions" />
        </div>
    </header>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CustomerPageHeader',
    props: {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            default: '',
        },
    },
});
</script>
