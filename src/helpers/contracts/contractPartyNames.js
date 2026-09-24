/**
 * Compact Admin list label for contract parties.
 * Single: "Daw Su Su"
 * Joint:  "Daw Su Su + U Aung Ye"
 */
export function formatContractPartyNames(primaryName, secondName) {
    const primary = typeof primaryName === 'string' ? primaryName.trim() : '';
    const second = typeof secondName === 'string' ? secondName.trim() : '';

    if (primary && second) {
        return `${primary} + ${second}`;
    }

    return primary || second || '';
}

/**
 * Resolve party names from API contract payload / mapped draft state.
 */
export function resolveContractPartyNames(data = {}) {
    const primary = data.customer_name
        || data.user_name
        || data.customer?.name
        || '';
    const second = data.second_customer_name
        || data.second_customer?.name
        || '';

    return {
        primaryName: typeof primary === 'string' ? primary.trim() : '',
        secondName: typeof second === 'string' ? second.trim() : '',
        displayName: formatContractPartyNames(primary, second),
    };
}
