import { blobToDrawable } from "./image.js";

const CANVAS_ID = 'overview';

const BACKGROUND_COLOR = '#323232';

const TARGET_HEIGHT = 960;

/**
 * 
 * @param {Blob} [customAdler]
 * @returns {Promise<Blob>}
 */
export async function generateOverview (customAdler) {

    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = document.getElementById(CANVAS_ID);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.strokeStyle = 'transparent';

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (customAdler !== undefined) {
        const drawable = await blobToDrawable(customAdler);
        
        const factor = TARGET_HEIGHT / drawable.height;
        const width = drawable.width * factor;
        ctx.drawImage(drawable, (canvas.width - width) / 2, (canvas.height - TARGET_HEIGHT) / 2, width, TARGET_HEIGHT);
    }

    // ctx.drawImage(await BELOW_DRAWABLE, 0, 0);

    return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1);
    });
}