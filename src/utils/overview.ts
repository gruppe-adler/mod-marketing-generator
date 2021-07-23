import { blobToImage } from '.';

const BACKGROUND_COLOR = '#323232';

const ADLER_HEIGHT = 960;
const OVERVIEW_WIDTH = 2048;
const OVERVIEW_HEIGHT = 1024;

/**
 *
 * Generate overview image
 * @param {Blob} adler Adler
 * @returns {Promise<Blob>}
 */
export async function generateOverview (adler: Blob): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.height = OVERVIEW_HEIGHT;
    canvas.width = OVERVIEW_WIDTH;

    const ctx = canvas.getContext('2d');
    if (ctx === null) throw new Error('Couldn\'t get context');

    ctx.strokeStyle = 'transparent';
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawable = await blobToImage(adler);

    const factor = ADLER_HEIGHT / drawable.height;
    const width = drawable.width * factor;
    ctx.drawImage(drawable, (canvas.width - width) / 2, (canvas.height - ADLER_HEIGHT) / 2, width, ADLER_HEIGHT);

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob === null) {
                reject(new Error('Couldn\'t generate Blob'));
                return;
            }
            resolve(blob);
        }, 'image/png', 1);
    }).finally(() => {
        canvas.remove();
    });
}
