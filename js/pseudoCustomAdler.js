import { blobToImage, waitOnImageLoad } from "./utils.js";

const DEFAULT_ADLER = fetch('./default_adler.svg').then(res => res.blob()).then(blob => blobToImage(blob));

const DESIRED_HEIGHT = 2048;

const TEXT_HEIGHT = 256;
const SHADOW_OFFSET = 16;
const MIN_BOX_WIDTH = 1536;

/**
 * @param {string} text Text
 * @returns {Promise<Blob>}
 */
export async function generatePseudoCustomAdler(text = '') {
    const adler = await DEFAULT_ADLER;
    const adlerWidth = adler.width * (DESIRED_HEIGHT / adler.height);

    const canvas = document.createElement('canvas');
    canvas.height = 2048;
    canvas.width = adlerWidth;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(adler, 0, (canvas.width - adlerWidth) / 2, adler.width * (canvas.height / adler.height), canvas.height);

    if (text !== '') {
        const textImg = await generateText(text);

        const angle = -15 * Math.PI / 180;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        ctx.drawImage(textImg, - textImg.width / 2, - textImg.height / 2);
    }

    return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png', 1);
    }).finally(() => {
        canvas.remove();
    });
}


/**
 * @param {string} text
 * @returns {HTMLImageElement} Image
 */
async function generateText(text) {
    const canvas = document.createElement('canvas');
    canvas.height = TEXT_HEIGHT + SHADOW_OFFSET;
    canvas.width = 2000;
    document.body.append(canvas);

    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    text = text.toUpperCase();

    ctx.font = `220px Oswald`;

    const textWidth = ctx.measureText(text)
    
    const boxWidth = Math.max(textWidth.width + 192, MIN_BOX_WIDTH);

    canvas.width = boxWidth + SHADOW_OFFSET;

    ctx.font = `220px Oswald`;
    ctx.fillStyle = '#D18D1F';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowOffsetX = SHADOW_OFFSET;
    ctx.shadowOffsetY = SHADOW_OFFSET;
    ctx.fillRect(0, 0, boxWidth, TEXT_HEIGHT);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'transparent';
    ctx.fillText(text, boxWidth / 2, (TEXT_HEIGHT / 2) * 1.15);


    const url = canvas.toDataURL('image/png', 1);

    canvas.remove();

    const img = new Image();
    img.src = url;
    await waitOnImageLoad(img);

    return img;
}