import { blobToImage } from "./utils.js";
import { generatePseudoCustomAdler } from "./pseudoCustomAdler.js";

const BACKGROUND_COLOR = '#323232';

const ADLER_HEIGHT = 960;
const OVERVIEW_WIDTH = 2048;
const OVERVIEW_HEIGHT = 1024;

/**
 *
 * Generate overview image
 * @param {Blob} adler Adler
 * @param {Object} [options] Options
 * @param {HTMLCanvasElement} [options.canvas] Canvas to draw overview image onto
 * @param {string} [options.text] Text to use for pseudo custom adler
 * @returns {Promise<Blob>}
 */
export async function generateOverview (adler, options = {}) {

    const canvas = options.canvas ?? document.createElement('canvas');
    canvas.height = OVERVIEW_HEIGHT;
    canvas.width = OVERVIEW_WIDTH;

    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'transparent';
    
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawable = await blobToImage(adler);
    
    const factor = ADLER_HEIGHT / drawable.height;
    const width = drawable.width * factor;
    ctx.drawImage(drawable, (canvas.width - width) / 2, (canvas.height - ADLER_HEIGHT) / 2, width, ADLER_HEIGHT);

    return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1);
    }).finally(() => {
        if (options.canvas === undefined) canvas.remove();
    });
}
