/**
 * Shared Admin Portal helper: block accidental Enter-key form submission.
 * Allows Enter in textareas, on buttons/links, and in overlay panels (dropdowns, menus).
 */

const ALLOW_ENTER_SELECTOR = [
    'textarea',
    'button',
    'a',
    '[role="button"]',
    '[contenteditable="true"]',
    '.p-dropdown-panel',
    '.p-multiselect-panel',
    '.p-autocomplete-panel',
    '.p-datepicker',
    '.p-overlaypanel',
    '.p-cascadeselect-panel',
    '.p-treeselect-panel',
    '[role="listbox"]',
    '[role="menu"]',
    '[role="menuitem"]',
    '[role="option"]',
].join(', ');

/**
 * @param {EventTarget | null} target
 * @returns {boolean} true when Enter should proceed normally
 */
export function shouldAllowEnterKey(target) {
    if (!(target instanceof Element)) {
        return true;
    }

    if (!target.closest('form')) {
        return true;
    }

    if (target.closest(ALLOW_ENTER_SELECTOR)) {
        return true;
    }

    const tag = target.tagName?.toLowerCase();

    if (tag === 'textarea') {
        return true;
    }

    if (target.isContentEditable) {
        return true;
    }

    return false;
}

/**
 * Call from a keydown listener (preferably capture) on an Admin layout or form.
 * Prevents the browser's implicit form submit on Enter without affecting button clicks.
 *
 * @param {KeyboardEvent} event
 */
export function preventEnterFormSubmit(event) {
    if (event.key !== 'Enter') {
        return;
    }

    if (event.isComposing || event.keyCode === 229) {
        return;
    }

    if (shouldAllowEnterKey(event.target)) {
        return;
    }

    event.preventDefault();
}
