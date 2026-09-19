import { useRouter } from 'vue-router';

const INTERACTIVE_SELECTOR = [
    'a',
    'button',
    'input',
    'select',
    'textarea',
    'label',
    '[role="button"]',
    '.p-checkbox',
    '.p-checkbox-box',
    '.p-radiobutton',
    '.p-radiobutton-box',
    '.p-button',
    '.p-inputtext',
    '.admin-selection-delete',
].join(', ');

export function shouldIgnoreListRowClick(originalEvent) {
    if (!originalEvent?.target?.closest) {
        return false;
    }

    return Boolean(originalEvent.target.closest(INTERACTIVE_SELECTOR));
}

export function useClickableListRow(routeName, options = {}) {
    const router = useRouter();
    const {
        getParams = (data) => ({ id: data.id }),
        canNavigate = (data) => Boolean(data?.id),
    } = options;

    const onRowClick = ({ data, originalEvent }) => {
        if (shouldIgnoreListRowClick(originalEvent)) {
            return;
        }

        if (!canNavigate(data)) {
            return;
        }

        router.push({ name: routeName, params: getParams(data) });
    };

    return { onRowClick };
}
