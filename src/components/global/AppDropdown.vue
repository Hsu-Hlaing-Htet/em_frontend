<script setup>
import { computed, nextTick, onBeforeUnmount, ref, unref, useAttrs } from 'vue';
import PrimeDropdown from 'primevue/dropdown';

defineOptions({
    inheritAttrs: false,
    name: 'Dropdown',
});

const attrs = useAttrs();
const dropdownRef = ref(null);
const syncedPanelStyle = ref({});
let resizeObserver = null;
let resizeListenerBound = false;

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

function resolveTriggerEl() {
    const root = dropdownRef.value?.$el;

    return root instanceof HTMLElement ? root : null;
}

function buildPanelWidthStyle(widthPx) {
    const viewportCap = Math.max(160, window.innerWidth - 16);
    const width = Math.min(widthPx, viewportCap);

    return {
        '--app-dropdown-width': `${width}px`,
        width: `${width}px`,
        minWidth: `${width}px`,
        maxWidth: `${width}px`,
    };
}

function syncPanelWidth() {
    nextTick(() => {
        const root = resolveTriggerEl();

        if (!root) {
            return;
        }

        const width = Math.round(root.getBoundingClientRect().width);

        if (width <= 0) {
            return;
        }

        syncedPanelStyle.value = buildPanelWidthStyle(width);
    });
}

function bindResizeTracking() {
    const root = resolveTriggerEl();

    if (typeof ResizeObserver !== 'undefined' && root && !resizeObserver) {
        resizeObserver = new ResizeObserver(() => {
            syncPanelWidth();
        });
        resizeObserver.observe(root);
    }

    if (!resizeListenerBound) {
        window.addEventListener('resize', syncPanelWidth, { passive: true });
        resizeListenerBound = true;
    }
}

function unbindResizeTracking() {
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }

    if (resizeListenerBound) {
        window.removeEventListener('resize', syncPanelWidth);
        resizeListenerBound = false;
    }
}

function onShow(event) {
    syncPanelWidth();
    bindResizeTracking();

    if (typeof attrs.onShow === 'function') {
        attrs.onShow(event);
    }
}

function onHide(event) {
    syncedPanelStyle.value = {};
    unbindResizeTracking();

    if (typeof attrs.onHide === 'function') {
        attrs.onHide(event);
    }
}

onBeforeUnmount(() => {
    unbindResizeTracking();
});
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
