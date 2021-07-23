import { blobToImage } from '.';

const BACKGROUND_COLOR = '#323232';

const IMAGE_WIDTH = 1280;
const IMAGE_HEIGHT = 640;
const ADLER_HEIGHT = IMAGE_HEIGHT - 160; // GitHub recommends a margin of 80px on each size

/**
 *
 * Generate overview image
 * @param {Blob} adler Adler
 * @returns {Promise<Blob>}
 */
export async function generateGitHubSocialPreview (adler: Blob): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = IMAGE_WIDTH;
    canvas.height = IMAGE_HEIGHT;

    const ctx = canvas.getContext('2d');
    if (ctx === null) throw new Error('Couldn\'t get context');

    ctx.strokeStyle = 'transparent';
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawable = await blobToImage(adler);

    const factor = ADLER_HEIGHT / drawable.height;
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
