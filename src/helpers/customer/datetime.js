/**
 * Customer Portal date/time display helpers.
 * Prefer real created_at timestamps from the API.
 */

function parseCustomerDate(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    const raw = String(value).trim();
    const dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const dateTime = raw.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/);

    let date;

    if (dateOnly) {
        date = new Date(`${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}T00:00:00`);
    } else if (dateTime) {
        // Prefer native parsing for timezone-aware ISO / Laravel datetime strings.
        if (/[Zz]|[+-]\d{2}:?\d{2}$/.test(raw) || raw.includes('T') || raw.includes(' ')) {
            const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
            date = new Date(normalized);
        } else {
            date = new Date(
                Number(dateTime[1]),
                Number(dateTime[2]) - 1,
                Number(dateTime[3]),
                Number(dateTime[4]),
                Number(dateTime[5]),
                Number(dateTime[6] || 0),
            );
        }
    } else {
        date = new Date(raw.includes(' ') && !raw.includes('T') ? raw.replace(' ', 'T') : raw);
    }

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
}

function formatDayPart(date) {
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatTimePart(date) {
    return date
        .toLocaleTimeString('en-GB', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })
        .replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
}

/** Date only: "09 Jun 2026" */
export function formatCustomerDate(value) {
    const date = parseCustomerDate(value);

    if (!date) {
        return value ? String(value).trim() : null;
    }

    return formatDayPart(date);
}

/** Time only: "2:35 PM" */
export function formatCustomerTime(value) {
    const date = parseCustomerDate(value);

    if (!date) {
        return null;
    }

    return formatTimePart(date);
}

/**
 * Parts for LEFT/RIGHT list cards.
 * { date: "09 Jun 2026", time: "2:35 PM", display: "09 Jun 2026 · 2:35 PM" }
 */
export function formatCustomerDateTimeParts(value) {
    const date = parseCustomerDate(value);

    if (!date) {
        return null;
    }

    const dayPart = formatDayPart(date);
    const timePart = formatTimePart(date);

    return {
        date: dayPart,
        time: timePart,
        display: `${dayPart} · ${timePart}`,
    };
}

/** Full created timestamp: "09 Jun 2026 · 2:35 PM" */
export function formatCustomerDateTime(value) {
    return formatCustomerDateTimeParts(value)?.display ?? null;
}
