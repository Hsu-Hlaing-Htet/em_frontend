<script setup>
import { computed, onBeforeUnmount, ref, unref, useAttrs } from 'vue';
import PrimeDropdown from 'primevue/dropdown';

defineOptions({
    inheritAttrs: false,
    name: 'Dropdown',
});

/**
 * Shared Rosewood dropdown — single implementation for Admin / Customer / Public.
 * Searchable and non-searchable modes share the same overlay width lock + styles.
 *
 * Preferred search API: `searchable` (+ optional `filter-placeholder`).
 * Legacy PrimeVue `filter` still works for backward compatibility.
 */
const props = defineProps({
    searchable: {
        type: Boolean,
        default: undefined,
    },
    filterPlaceholder: {
        type: String,
        default: undefined,
    },
});

const attrs = useAttrs();
const dropdownRef = ref(null);
let resizeObserver = null;
let resizeListenerBound = false;

/**
 * Exact trigger width locked before the overlay mounts (PrimeVue before-show).
 * Applied as width + minWidth + maxWidth so long option labels cannot expand
 * the panel past the trigger (minWidth alone still allows content growth).
 */
const lockedPanelWidth = ref('');

/** PrimeVue Dropdown requires `options` to always be an array. */
const safeOptions = computed(() => {
    const value = unref(attrs.options);

    return Array.isArray(value) ? value : [];
});

const isSearchable = computed(() => {
    if (props.searchable !== undefined) {
        return props.searchable;
    }

    const filterAttr = attrs.filter;

    return filterAttr === '' || filterAttr === true || filterAttr === 'true';
});

const resolvedFilterPlaceholder = computed(() => {
    if (props.filterPlaceholder !== undefined) {
        return props.filterPlaceholder;
    }

    const fromAttrs = attrs.filterPlaceholder ?? attrs['filter-placeholder'];

    return typeof fromAttrs === 'string' ? fromAttrs : undefined;
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

/**
 * Exact trigger-width lock — applied on overlay create (same tick as open).
 * Do not update this reactively while open (Vue :style re-application can
 * fight PrimeVue inline top/left and cause position jitter).
 */
const mergedPanelStyle = computed(() => {
    const style = {};

    if (lockedPanelWidth.value) {
        style.width = lockedPanelWidth.value;
        style.minWidth = lockedPanelWidth.value;
        style.maxWidth = lockedPanelWidth.value;
    }

    const extra = attrs.panelStyle;

    if (extra && typeof extra === 'object' && !Array.isArray(extra)) {
        Object.assign(style, extra);
    }

    return Object.keys(style).length ? style : undefined;
});

const dropdownBindings = computed(() => {
    const bindings = { ...attrs };

    delete bindings.options;
    delete bindings.panelClass;
    delete bindings.panelStyle;
    delete bindings.onShow;
    delete bindings.onHide;
    delete bindings.onBeforeShow;
    delete bindings['onBefore-show'];
    delete bindings.appendTo;
    delete bindings.filter;
    delete bindings.filterPlaceholder;
    delete bindings['filter-placeholder'];
    delete bindings.searchable;

    return bindings;
});

function resolveTriggerEl() {
    const root = dropdownRef.value?.$el;

    return root instanceof HTMLElement ? root : null;
}

function lockTriggerWidth() {
    const root = resolveTriggerEl();

    if (!root) {
        return;
    }

    const width = Math.round(root.getBoundingClientRect().width);

    if (width <= 0) {
        return;
    }

    const viewportCap = Math.max(160, window.innerWidth - 16);
    lockedPanelWidth.value = `${Math.min(width, viewportCap)}px`;
}

function bindResizeTracking() {
    const root = resolveTriggerEl();

    // Track trigger size for the *next* open only — never mutate panel width while open.
    if (typeof ResizeObserver !== 'undefined' && root && !resizeObserver) {
        resizeObserver = new ResizeObserver(() => {
            if (dropdownRef.value?.overlayVisible) {
                return;
            }

            lockTriggerWidth();
        });
        resizeObserver.observe(root);
    }

    if (!resizeListenerBound) {
        window.addEventListener('resize', onWindowResize, { passive: true });
        resizeListenerBound = true;
    }
}

function onWindowResize() {
    if (dropdownRef.value?.overlayVisible) {
        return;
    }

    lockTriggerWidth();
}

function unbindResizeTracking() {
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }

    if (resizeListenerBound) {
        window.removeEventListener('resize', onWindowResize);
        resizeListenerBound = false;
    }
}

/**
 * Fires synchronously in PrimeVue show() BEFORE overlayVisible = true.
 * Panel therefore mounts with the correct width on the first frame.
 */
function onBeforeShow(event) {
    lockTriggerWidth();
    bindResizeTracking();

    if (typeof attrs.onBeforeShow === 'function') {
        attrs.onBeforeShow(event);
    }
}

function onShow(event) {
    // Intentionally no late width/position sync — that caused stretch + jitter.
    if (typeof attrs.onShow === 'function') {
        attrs.onShow(event);
    }
}

function onHide(event) {
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
        :filter="isSearchable"
        :filter-placeholder="resolvedFilterPlaceholder"
        :append-to="attrs.appendTo ?? 'body'"
        :panel-class="mergedPanelClass"
        :panel-style="mergedPanelStyle"
        @before-show="onBeforeShow"
        @show="onShow"
        @hide="onHide"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps || {}" />
        </template>
    </PrimeDropdown>
</template>
