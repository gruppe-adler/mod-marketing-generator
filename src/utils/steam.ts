import { blobToImage } from '.';

const BACKGROUND_COLOR = '#323232';

const IMAGE_SIZE = 512;
const ADLER_SIZE = IMAGE_SIZE - 8 * 2;

/**
 *
 * Generate overview image
 * @param {Blob} adler Adler
 * @returns {Promise<Blob>}
 */
export async function generateSteamLogo (adler: Blob): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.height = IMAGE_SIZE;
    canvas.width = IMAGE_SIZE;

    const ctx = canvas.getContext('2d');
    if (ctx === null) throw new Error('Couldn\'t get context');

    ctx.strokeStyle = 'transparent';
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawable = await blobToImage(adler);

    const drawableSize = Math.max(drawable.height, drawable.width);

    const factor = ADLER_SIZE / drawableSize;
    const height = drawable.height * factor;
    const width = drawable.width * factor;
    ctx.drawImage(drawable, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);

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
