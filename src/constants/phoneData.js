/**
 * Country calling codes for Admin account phone inputs.
 * Default for this project is Myanmar (+95).
 */
export const DEFAULT_PHONE_COUNTRY_CODE = '+95';

export const PHONE_COUNTRY_OPTIONS = [
    { label: '+95', value: '+95', name: 'Myanmar' },
];

/** Digits-only country codes, longest first, for reliable parsing. */
export const PHONE_COUNTRY_DIGITS = PHONE_COUNTRY_OPTIONS
    .map((option) => option.value.replace(/\D/g, ''))
    .sort((a, b) => b.length - a.length);
