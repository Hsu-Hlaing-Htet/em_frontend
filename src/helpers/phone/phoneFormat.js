import {
    DEFAULT_PHONE_COUNTRY_CODE,
    PHONE_COUNTRY_DIGITS,
    PHONE_COUNTRY_OPTIONS,
} from '@/constants/phoneData';

export const PHONE_REQUIRED_MESSAGE = 'Phone number is required.';
export const PHONE_INVALID_MESSAGE = 'Please enter a valid phone number.';
export const PHONE_LOCAL_DIGIT_LENGTH = 9;

/**
 * @returns {{ countryCode: string, localNumber: string }}
 */
export function emptyPhoneParts() {
    return {
        countryCode: DEFAULT_PHONE_COUNTRY_CODE,
        localNumber: '',
    };
}

function digitsOnly(value) {
    return String(value || '').replace(/\D/g, '');
}

/**
 * Strip trunk 0 and accidental country-code prefixes from the local number.
 * Example: country +95 + local "95912345678" → "912345678"
 * Does not strip legitimate local numbers that merely share a digit prefix
 * (e.g. Myanmar locals like 9420... must stay intact).
 */
export function sanitizeLocalPhoneNumber(localNumber, countryCode = DEFAULT_PHONE_COUNTRY_CODE) {
    let digits = digitsOnly(localNumber);
    const countryDigits = digitsOnly(countryCode);

    while (digits.startsWith('0')) {
        digits = digits.slice(1);
    }

    // Duplicate country prefix only when the remainder still looks like a full local number.
    if (
        countryDigits
        && digits.startsWith(countryDigits)
        && digits.length >= countryDigits.length + 7
    ) {
        const remainder = digits.slice(countryDigits.length);

        // For +95, national mobiles continue with 9 (e.g. typed 959xxxxxxxx).
        if (countryDigits === '95') {
            if (remainder.startsWith('9')) {
                digits = remainder;
            }
        } else {
            digits = remainder;
        }
    }

    return digits.slice(0, PHONE_LOCAL_DIGIT_LENGTH);
}

/**
 * Payment-method wallet phones (canonical local 09xxxxxxxxx).
 *
 * Accepts (spaces/punctuation ignored):
 * - 09779959901
 * - 09 779 959 901
 * - +959779959901
 * - +95 9779959901
 * - 9779959901
 *
 * @param {string|null|undefined} value
 * @returns {string|null}
 */
export function normalizePaymentMethodWalletPhone(value) {
    const trimmed = String(value || '').trim();

    if (!trimmed) {
        return null;
    }

    const digits = digitsOnly(trimmed);

    if (!digits) {
        return null;
    }

    // Local 09xxxxxxxxx (11 digits).
    if (/^09\d{9}$/.test(digits)) {
        return digits;
    }

    // National without trunk 0: 9xxxxxxxxx (10 digits).
    if (/^9\d{9}$/.test(digits)) {
        return `0${digits}`;
    }

    // Country code 95 + national 9xxxxxxxxx (12 digits).
    if (/^959\d{9}$/.test(digits)) {
        return `0${digits.slice(2)}`;
    }

    return null;
}

/**
 * @param {string|null|undefined} value
 * @returns {boolean}
 */
export function isValidPaymentMethodWalletPhone(value) {
    return normalizePaymentMethodWalletPhone(value) !== null;
}

/**
 * Shared validation for payment-method Wallet phone fields.
 *
 * @param {string|null|undefined} value
 * @returns {string|null}
 */
export function validatePaymentMethodWalletPhone(value) {
    if (!String(value || '').trim()) {
        return PHONE_REQUIRED_MESSAGE;
    }

    return isValidPaymentMethodWalletPhone(value) ? null : PHONE_INVALID_MESSAGE;
}

/**
 * Normalize for API storage: +959xxxxxxxxx (no spaces).
 *
 * @param {string|null|undefined} countryCode
 * @param {string|null|undefined} localNumber
 * @returns {string}
 */
export function formatPhoneValue(countryCode, localNumber) {
    const code = String(countryCode || DEFAULT_PHONE_COUNTRY_CODE).trim() || DEFAULT_PHONE_COUNTRY_CODE;
    const normalizedCode = code.startsWith('+') ? code : `+${digitsOnly(code)}`;
    const local = sanitizeLocalPhoneNumber(localNumber, normalizedCode);

    if (!local) {
        return '';
    }

    return `${normalizedCode}${local}`;
}

/**
 * Split a saved phone into country code + local number for editing.
 *
 * @param {string|null|undefined} value
 * @returns {{ countryCode: string, localNumber: string }}
 */
export function parsePhoneValue(value) {
    const trimmed = String(value || '').trim();

    if (!trimmed) {
        return emptyPhoneParts();
    }

    const allDigits = digitsOnly(trimmed);

    if (!allDigits) {
        return emptyPhoneParts();
    }

    const hasExplicitCountry = trimmed.startsWith('+') || trimmed.startsWith('00');

    // Bare local numbers (e.g. 9xxxxxxxxx) must not be matched as other country codes
    // such as +91 from a leading "91...".
    if (!hasExplicitCountry) {
        return {
            countryCode: DEFAULT_PHONE_COUNTRY_CODE,
            localNumber: sanitizeLocalPhoneNumber(allDigits, DEFAULT_PHONE_COUNTRY_CODE),
        };
    }

    let matchedCountry = null;

    for (const countryDigits of PHONE_COUNTRY_DIGITS) {
        if (allDigits.startsWith(countryDigits) && allDigits.length > countryDigits.length) {
            matchedCountry = PHONE_COUNTRY_OPTIONS.find(
                (option) => digitsOnly(option.value) === countryDigits,
            );
            break;
        }
    }

    const countryCode = matchedCountry?.value || DEFAULT_PHONE_COUNTRY_CODE;
    const localSource = matchedCountry
        ? allDigits.slice(digitsOnly(countryCode).length)
        : allDigits;

    return {
        countryCode,
        localNumber: sanitizeLocalPhoneNumber(localSource, countryCode),
    };
}

/**
 * @param {string|null|undefined} value
 * @returns {boolean}
 */
export function isNormalizedPhoneValid(value) {
    const trimmed = String(value || '').trim();

    if (!trimmed) {
        return false;
    }

    if (!/^\+\d+$/.test(trimmed)) {
        return false;
    }

    const parts = parsePhoneValue(trimmed);
    const rebuilt = formatPhoneValue(parts.countryCode, parts.localNumber);

    if (rebuilt !== trimmed) {
        return false;
    }

    const local = parts.localNumber;

    return parts.countryCode === DEFAULT_PHONE_COUNTRY_CODE
        && local.length === PHONE_LOCAL_DIGIT_LENGTH;
}

/**
 * Shared phone validation used by formValidation and PhoneInput.
 *
 * @param {string|null|undefined} value
 * @returns {string|null}
 */
export function validatePhoneValue(value) {
    if (!String(value || '').trim()) {
        return PHONE_REQUIRED_MESSAGE;
    }

    return isNormalizedPhoneValid(value) ? null : PHONE_INVALID_MESSAGE;
}
