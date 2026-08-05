export function downloadBlob(filename, blob) {
    const fileBlob = blob instanceof Blob
        ? blob
        : new Blob([blob], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(fileBlob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function downloadTextFile(filename, content, mimeType = 'text/plain;charset=utf-8;') {
    downloadBlob(filename, new Blob([content], { type: mimeType }));
}
