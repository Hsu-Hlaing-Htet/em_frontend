import { downloadBlob } from '@/utils/downloadFile';

export function filenameFromContentDisposition(header, fallback) {
    if (!header) {
        return fallback;
    }

    const utfMatch = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(header);
    if (utfMatch?.[1]) {
        try {
            return decodeURIComponent(utfMatch[1].trim().replace(/^"|"$/g, ''));
        } catch {
            return utfMatch[1].trim().replace(/^"|"$/g, '');
        }
    }

    const match = /filename\s*=\s*("?)([^";]+)\1/i.exec(header);
    if (match?.[2]) {
        return match[2].trim();
    }

    return fallback;
}

export function downloadPdfResponse(response, fallbackFilename = 'document.pdf') {
    const header = response?.headers?.['content-disposition']
        || response?.headers?.get?.('content-disposition');
    const filename = filenameFromContentDisposition(header, fallbackFilename);
    const blob = response?.data instanceof Blob
        ? response.data
        : new Blob([response?.data ?? response], { type: 'application/pdf' });

    downloadBlob(filename, blob);

    return filename;
}

export const PDF_DOWNLOAD_HEADERS = {
    Accept: 'application/pdf',
};
