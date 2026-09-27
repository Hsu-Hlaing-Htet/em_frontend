/**
 * Customer Portal date/time display helpers.
 * All display uses Asia/Yangon via the shared project timezone helpers.
 */
import {
    formatProjectDate,
    formatProjectDateTime,
    formatProjectDateTimeParts,
    formatProjectTime,
    toProjectDate,
} from '@/utils/timezone';

/** Date only: "09 Jun 2026" */
export function formatCustomerDate(value) {
    const formatted = formatProjectDate(value);

    return formatted || null;
}

/** Time only: "2:35 PM" */
export function formatCustomerTime(value) {
    const formatted = formatProjectTime(value);

    return formatted || null;
}

/**
 * Parts for LEFT/RIGHT list cards.
 * { date: "09 Jun 2026", time: "2:35 PM", display: "09 Jun 2026 · 2:35 PM" }
 */
export function formatCustomerDateTimeParts(value) {
    return formatProjectDateTimeParts(value);
}

/** Full created timestamp: "09 Jun 2026 · 2:35 PM" */
export function formatCustomerDateTime(value) {
    return formatProjectDateTimeParts(value)?.display
        ?? (formatProjectDateTime(value) || null);
}

export { toProjectDate as parseCustomerDate };
