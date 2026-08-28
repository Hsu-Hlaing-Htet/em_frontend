import {
    NRC_NUMBER_LENGTH,
    NRC_STATE_OPTIONS,
    NRC_TYPE_OPTIONS,
    isValidNrcTownship,
} from '@/constants/nrcData';

/** Stored API format: 12/YaKaNa(N)123456 */
export const NRC_VALUE_PATTERN = /^(\d{1,2})\/([A-Za-z]+)\(([A-Za-z])\)(\d{6})$/;

export function emptyNrcParts() {
    return {
        stateCode: null,
        townshipCode: null,
        type: 'N',
        number: '',
    };
}

/**
 * @param {string|null|undefined} value
 * @returns {{ stateCode: string|null, townshipCode: string|null, type: string|null, number: string }}
 */
export function parseNrcValue(value) {
    const trimmed = String(value || '').trim();

    if (!trimmed) {
        return emptyNrcParts();
    }

    const match = trimmed.match(NRC_VALUE_PATTERN);

    if (!match) {
        return emptyNrcParts();
    }

    return {
        stateCode: String(Number(match[1])),
        townshipCode: match[2],
        type: match[3].toUpperCase(),
        number: match[4],
    };
}

/**
 * @param {{ stateCode?: string|null, townshipCode?: string|null, type?: string|null, number?: string|null }} parts
 * @returns {string}
 */
export function formatNrcValue(parts) {
    const stateCode = parts?.stateCode != null && parts.stateCode !== ''
        ? String(parts.stateCode)
        : '';
    const townshipCode = String(parts?.townshipCode || '').trim();
    const type = String(parts?.type || '').trim().toUpperCase();
    const number = String(parts?.number || '').replace(/\D/g, '');

    if (!stateCode || !townshipCode || !type || number.length !== NRC_NUMBER_LENGTH) {
        return '';
    }

    return `${stateCode}/${townshipCode}(${type})${number}`;
}

export function sanitizeNrcNumber(value) {
    return String(value || '').replace(/\D/g, '').slice(0, NRC_NUMBER_LENGTH);
}

/**
 * @param {string|null|undefined} value
 * @returns {string|null} Error message or null when valid
 */
export function validateNrcValue(value) {
    const trimmed = String(value || '').trim();

    if (!trimmed) {
        return 'NRC is required.';
    }

    const parts = parseNrcValue(trimmed);

    if (!parts.stateCode || !parts.townshipCode || !parts.type || !parts.number) {
        return 'Please enter a valid NRC.';
    }

    const stateExists = NRC_STATE_OPTIONS.some((state) => state.code === parts.stateCode);

    if (!stateExists) {
        return 'Please select a valid state/region code.';
    }

    if (!isValidNrcTownship(parts.stateCode, parts.townshipCode)) {
        return 'Please select a valid township NRC code for the selected state/region.';
    }

    const typeExists = NRC_TYPE_OPTIONS.some((option) => option.value === parts.type);

    if (!typeExists) {
        return 'Please select a valid NRC type.';
    }

    if (!/^\d+$/.test(parts.number) || parts.number.length !== NRC_NUMBER_LENGTH) {
        return `NRC number must be ${NRC_NUMBER_LENGTH} digits.`;
    }

    // Reject values that parse but do not round-trip to the canonical stored format.
    if (formatNrcValue(parts) !== trimmed) {
        return 'Please enter a valid NRC.';
    }

    return null;
}
