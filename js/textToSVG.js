import TextToSVG from './libs/text-to-svg.js';

const loadFont = new Promise((resolve, reject) => {
    TextToSVG.load('./Oswald-Medium.ttf',  (err, textToSVG) => {
        if (err) {
            reject(err);
            return;
        }

        resolve(textToSVG);
    });
});

export function textToSVG(text, options) {
    return loadFont.then(textToSVG => {
        const path = textToSVG.getPath(text, options);
        const metrics = textToSVG.getMetrics(text, options);
        return { path, metrics };
    })
}