/**
 * Rosewood Royale project timezone.
 *
 * API policy: Laravel `APP_TIMEZONE=Asia/Yangon` serializes datetimes as
 * naive `Y-m-d H:i:s` / `Y-m-d` wall-clock values in Asia/Yangon.
 * Frontend display formatters treat naive values as Asia/Yangon (no browser-local shift).
 * Instant values with `Z` / offsets are converted into Asia/Yangon for display.
 *
 * Date-only values (`Y-m-d`) are formatted from calendar parts and never timezone-shifted.
 */
export const APP_TIMEZONE = 'Asia/Yangon';

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const NAIVE_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?$/;
const HAS_ZONE = /(?:[Zz]|[+-]\d{2}:?\d{2})$/;

const MONTHS_SHORT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTHS_LONG = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

function pad2(value) {
    return String(value).padStart(2, '0');
}

function formatDayMonthYear(year, month, day) {
    return `${pad2(day)} ${MONTHS_SHORT[month - 1]} ${year}`;
}

function formatClock(hour, minute) {
    const h24 = Number(hour);
    const suffix = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;

    return `${h12}:${pad2(minute)} ${suffix}`;
}

function partsFromYangonInstant(date) {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: APP_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
    });
    const bag = Object.fromEntries(
        formatter.formatToParts(date)
            .filter((part) => part.type !== 'literal')
            .map((part) => [part.type, part.value]),
    );

    return {
        year: Number(bag.year),
        month: Number(bag.month),
        day: Number(bag.day),
        hour: Number(bag.hour),
        minute: Number(bag.minute),
        second: Number(bag.second),
    };
}

/**
 * Parse a server/API value into calendar/time parts in Asia/Yangon.
 * Date-only → calendar parts only.
 * Naive datetime → treated as Asia/Yangon wall clock.
 * Zoned ISO → converted into Asia/Yangon.
 */
export function parseProjectDateTimeParts(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) {
            return null;
        }

        return { ...partsFromYangonInstant(value), dateOnly: false };
    }

    const raw = String(value).trim();

    if (!raw || raw === '—' || raw === '-') {
        return null;
    }

    const dateOnly = raw.match(DATE_ONLY);

    if (dateOnly) {
        return {
            year: Number(dateOnly[1]),
            month: Number(dateOnly[2]),
            day: Number(dateOnly[3]),
            hour: 0,
            minute: 0,
            second: 0,
            dateOnly: true,
        };
    }

    if (HAS_ZONE.test(raw)) {
        const instant = new Date(raw);

        if (Number.isNaN(instant.getTime())) {
            return null;
        }

        return { ...partsFromYangonInstant(instant), dateOnly: false };
    }

    const naive = raw.match(NAIVE_DATE_TIME);

    if (naive) {
        return {
            year: Number(naive[1]),
            month: Number(naive[2]),
            day: Number(naive[3]),
            hour: Number(naive[4]),
            minute: Number(naive[5]),
            second: Number(naive[6] || 0),
            dateOnly: false,
        };
    }

    const normalized = raw.includes(' ') && !raw.includes('T') ? raw.replace(' ', 'T') : raw;
    const fallback = new Date(normalized);

    if (Number.isNaN(fallback.getTime())) {
        return null;
    }

    return { ...partsFromYangonInstant(fallback), dateOnly: false };
}

/** Date-only display: "25 Sep 2026" (no timezone shift). */
export function formatProjectDate(value) {
    const parts = parseProjectDateTimeParts(value);

    if (!parts) {
        return value ? String(value).trim() : '';
    }

    return formatDayMonthYear(parts.year, parts.month, parts.day);
}

/** Date + time display: "25 Sep 2026, 3:19 PM" in Asia/Yangon. */
export function formatProjectDateTime(value) {
    const parts = parseProjectDateTimeParts(value);

    if (!parts) {
        return value ? String(value).trim() : '';
    }

    if (parts.dateOnly) {
        return formatDayMonthYear(parts.year, parts.month, parts.day);
    }

    return `${formatDayMonthYear(parts.year, parts.month, parts.day)}, ${formatClock(parts.hour, parts.minute)}`;
}

/** Time-only: "3:19 PM" */
export function formatProjectTime(value) {
    const parts = parseProjectDateTimeParts(value);

    if (!parts || parts.dateOnly) {
        return '';
    }

    return formatClock(parts.hour, parts.minute);
}

export function formatProjectDateTimeParts(value) {
    const parts = parseProjectDateTimeParts(value);

    if (!parts) {
        return null;
    }

    const date = formatDayMonthYear(parts.year, parts.month, parts.day);
    const time = parts.dateOnly ? null : formatClock(parts.hour, parts.minute);

    return {
        date,
        time,
        display: time ? `${date} · ${time}` : date,
    };
}

/** Month label for billing periods: "September 2026" */
export function formatProjectMonthYear(value) {
    const parts = parseProjectDateTimeParts(value);

    if (!parts) {
        return value ? String(value).trim() : '';
    }

    return `${MONTHS_LONG[parts.month - 1]} ${parts.year}`;
}

/**
 * Instant for relative-time helpers.
 * Naive API datetimes are interpreted as Asia/Yangon wall clock.
 */
export function toProjectDate(value) {
    const parts = parseProjectDateTimeParts(value);

    if (!parts) {
        return null;
    }

    // Treat Yangon wall-clock components as if UTC, then correct by the zone offset.
    const asUtc = Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
        parts.second || 0,
    );
    const guess = new Date(asUtc);
    const seenInZone = partsFromYangonInstant(guess);
    const seenAsUtc = Date.UTC(
        seenInZone.year,
        seenInZone.month - 1,
        seenInZone.day,
        seenInZone.hour,
        seenInZone.minute,
        seenInZone.second,
    );
    const instant = new Date(asUtc - (seenAsUtc - asUtc));

    return Number.isNaN(instant.getTime()) ? null : instant;
}
