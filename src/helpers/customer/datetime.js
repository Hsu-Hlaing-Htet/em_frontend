/**
 * Customer Portal date/time display helpers.
 * All display uses Asia/Yangon via the shared project timezone helpers.
 */
import { formatProjectDateTimeParts } from '@/utils/timezone';

/**
 * Parts for LEFT/RIGHT list cards.
 * { date: "09 Jun 2026", time: "2:35 PM", display: "09 Jun 2026 · 2:35 PM" }
 */
export function formatCustomerDateTimeParts(value) {
    return formatProjectDateTimeParts(value);
}
