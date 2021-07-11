
/**
 * @param {Blob} blob
 * @returns {Promise<HTMLImageElement|ImageBitmap>} Drawable
 */
export async function blobToDrawable(blob) {
    const url = URL.createObjectURL(blob);
    try {
        const img = new Image();
        img.decoding = 'async';
        img.src = url;
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
        return img;
    } finally {
        URL.revokeObjectURL(url);
    }
}