/**
 * Convert Blob to Image
 * @param {Blob} blob
 * @returns {Promise<HTMLImageElement>} Image
 */
export async function blobToImage(blob) {
    const url = URL.createObjectURL(blob);
    try {
        const img = new Image();
        img.src = url;

        await waitOnImageLoad(img);
        return img;
    } finally {
        URL.revokeObjectURL(url);
    }
}

/**
 * Download a file
 * @param {string} name Name of file
 * @param {Blob} blob Blob to download
 */
export function download(name, blob) {
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.remove();

    // we revoke the url only after a delay because old Edge can't handle it otherwise
    window.setTimeout(() => URL.revokeObjectURL(url), 200);
}

/**
 * Wait until given image is loaded so it can be used with drawImage etc.
 * @param {Image} img Image
 */
export async function waitOnImageLoad(img) {
    img.decoding = 'async';
    const loaded = new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(Error('Image loading error'));
    });

    if (img.decode) {
        // Nice off-thread way supported in Safari/Chrome.
        // Safari throws on decode if the source is SVG.
        // https://bugs.webkit.org/show_bug.cgi?id=188347
        await img.decode().catch(() => null);
    }

    // Always await loaded, as we may have bailed due to the Safari bug above.
    await loaded;
}