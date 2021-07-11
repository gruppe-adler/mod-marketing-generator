import { blobToImage } from "./utils.js";

const BACKGROUND_COLOR = '#323232';

const ADLER_HEIGHT = 960;
const OVERVIEW_WIDTH = 2048;
const OVERVIEW_HEIGHT = 1024;

/**
 *
 * Generate overview image
 * @param {Blob} adler Logo text
 * @param {Object} [options] Options
 * @param {HTMLCanvasElement} [options.canvas] Canvas to draw overview image onto
 * @returns {Promise<Blob>}
 */
export async function generateOverview (adler, options = {}) {

    const canvas = options.canvas ?? document.createElement('canvas');
    canvas.height = OVERVIEW_HEIGHT;
    canvas.width = OVERVIEW_WIDTH

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.strokeStyle = 'transparent';
    
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (adler !== undefined) {
        const drawable = await blobToImage(adler);
        
        const factor = ADLER_HEIGHT / drawable.height;
        const width = drawable.width * factor;
        ctx.drawImage(drawable, (canvas.width - width) / 2, (canvas.height - ADLER_HEIGHT) / 2, width, ADLER_HEIGHT);
    }

    return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1);
    }).finally(() => {
        if (options.canvas === undefined) canvas.remove();
    });
}