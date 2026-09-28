/**
 * Shared Late Fee Rule selection helpers for Invoice Approval List + Detail.
 * Authoritative value is persisted on the Invoice via late_fee_selection.
 * Options are Active Late Fee Settings rules only (no "No Late Fee").
 */

export function buildLateFeeRuleOptions(rules = []) {
    return rules
        .filter((rule) => !rule.status || rule.status === 'active')
        .map((rule) => ({
            value: rule.id,
            label: rule.option_label || formatLateFeeRuleOptionLabel(rule),
        }));
}

export function formatLateFeeRuleOptionLabel(rule) {
    if (!rule) {
        return '';
    }

    const rate = formatLateFeeRate(rule.type, rule.value, rule.per);
    const grace = Number(rule.grace_days || 0);

    return `${rule.name} — ${rate} · ${grace} grace day${grace === 1 ? '' : 's'}`;
}

export function formatLateFeeRate(type, value, per) {
    if (type === 'percentage') {
        const formatted = Number(value).toFixed(2).replace(/\.?0+$/, '');
        return `${formatted}% / ${per}`;
    }

    return `MMK ${Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 })} / ${per}`;
}

export function normalizeLateFeeSelection(value) {
    if (value === null || value === undefined || value === '' || value === 'none') {
        return null;
    }

    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

export function lateFeeSelectionFromInvoice(invoice) {
    if (!invoice) {
        return null;
    }

    if (invoice.late_fee_selection != null && invoice.late_fee_selection !== '') {
        return normalizeLateFeeSelection(invoice.late_fee_selection);
    }

    if (invoice.late_fee_policy?.selection != null) {
        return normalizeLateFeeSelection(invoice.late_fee_policy.selection);
    }

    if (invoice.late_fee_rule_id) {
        return Number(invoice.late_fee_rule_id);
    }

    return null;
}
