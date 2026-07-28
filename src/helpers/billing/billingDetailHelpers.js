export const hasBillingValue = (value) => {
    if (value === null || value === undefined) {
        return false;
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();

        return trimmed !== '' && trimmed !== '—' && trimmed !== '-';
    }

    return true;
};

export const compactBillingValues = (values = []) => values.filter((value) => hasBillingValue(value));

export const formatBillingDocumentDate = (value) => {
    if (!hasBillingValue(value)) {
        return '';
    }

    const normalized = String(value).includes('T')
        ? value
        : String(value).replace(' ', 'T');

    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

export const billingDetailTableClasses = {
    wrap: 'overflow-x-auto',
    table: 'w-full border-collapse',
    th: 'border-b border-[var(--admin-border)] px-2 py-3 text-left text-sm font-semibold whitespace-nowrap text-[var(--admin-text-muted)]',
    thNumeric: 'border-b border-[var(--admin-border)] px-2 py-3 text-right text-sm font-semibold whitespace-nowrap text-[var(--admin-text-muted)]',
    td: 'border-b border-[var(--admin-border)] px-2 py-3 text-left text-sm text-[var(--admin-text)]',
    tdNumeric: 'border-b border-[var(--admin-border)] px-2 py-3 text-right text-sm whitespace-nowrap text-[var(--admin-text)]',
    tdEmpty: 'border-b border-[var(--admin-border)] px-2 py-3 text-center text-sm text-[var(--admin-text-muted)]',
    totalLabel: 'pt-4 text-right text-sm font-semibold text-[var(--admin-text)]',
    totalValue: 'pt-4 text-right text-sm font-semibold whitespace-nowrap text-[var(--admin-primary)]',
    summary: 'mt-10 text-sm leading-relaxed text-[var(--admin-text-muted)]',
    link: 'font-medium text-[var(--admin-primary)] hover:underline',
};
