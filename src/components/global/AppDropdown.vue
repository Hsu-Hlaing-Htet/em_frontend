<script setup>
import { computed, nextTick, ref, unref, useAttrs } from 'vue';
import PrimeDropdown from 'primevue/dropdown';

defineOptions({
    inheritAttrs: false,
    name: 'Dropdown',
});

const attrs = useAttrs();
const dropdownRef = ref(null);
const syncedPanelStyle = ref({});

/** PrimeVue Dropdown requires `options` to always be an array. */
const safeOptions = computed(() => {
    const value = unref(attrs.options);

    return Array.isArray(value) ? value : [];
});

const mergedPanelClass = computed(() => {
    const extra = attrs.panelClass;
    const base = 'app-dropdown-panel';

    if (!extra) {
        return base;
    }

    if (typeof extra === 'string') {
        return [base, extra];
    }

    if (Array.isArray(extra)) {
        return [base, ...extra];
    }

    return [base, extra];
});

const mergedPanelStyle = computed(() => ({
    ...syncedPanelStyle.value,
    ...(typeof attrs.panelStyle === 'object' && attrs.panelStyle ? attrs.panelStyle : {}),
}));

const dropdownBindings = computed(() => {
    const bindings = { ...attrs };

    delete bindings.options;
    delete bindings.panelClass;
    delete bindings.panelStyle;
    delete bindings.onShow;
    delete bindings.onHide;
    delete bindings.appendTo;

    return bindings;
});

function syncPanelWidth() {
    nextTick(() => {
        const root = dropdownRef.value?.$el;

        if (!root || !(root instanceof HTMLElement)) {
            return;
        }

        const width = Math.round(root.getBoundingClientRect().width);

        if (width <= 0) {
            return;
        }

        syncedPanelStyle.value = {
            width: `${width}px`,
            minWidth: `${width}px`,
            maxWidth: `${width}px`,
        };
    });
}

function onShow(event) {
    syncPanelWidth();

    if (typeof attrs.onShow === 'function') {
        attrs.onShow(event);
    }
}

function onHide(event) {
    syncedPanelStyle.value = {};

    if (typeof attrs.onHide === 'function') {
        attrs.onHide(event);
    }
}
</script>

<template>
    <PrimeDropdown
        ref="dropdownRef"
        v-bind="dropdownBindings"
        :options="safeOptions"
        :append-to="attrs.appendTo ?? 'body'"
        :panel-class="mergedPanelClass"
        :panel-style="mergedPanelStyle"
        @show="onShow"
        @hide="onHide"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps || {}" />
        </template>
    </PrimeDropdown>
</template>
