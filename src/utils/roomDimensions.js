export function calculateAreaSqft(width, length) {
    const parsedWidth = Number(width);
    const parsedLength = Number(length);

    if (!Number.isFinite(parsedWidth) || !Number.isFinite(parsedLength)) {
        return null;
    }

    if (parsedWidth <= 0 || parsedLength <= 0) {
        return null;
    }

    return Math.round(parsedWidth * parsedLength * 100) / 100;
}

export function hasRoomDimensions(width, length) {
    return calculateAreaSqft(width, length) !== null;
}

export function formatRoomDimensions(width, length) {
    const parsedWidth = Number(width);
    const parsedLength = Number(length);

    if (!Number.isFinite(parsedWidth) || !Number.isFinite(parsedLength) || parsedWidth <= 0 || parsedLength <= 0) {
        return null;
    }

    return `${parsedWidth} × ${parsedLength} ft`;
}
