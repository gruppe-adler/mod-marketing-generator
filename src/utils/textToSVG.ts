import TextToSVG from 'text-to-svg';

const loadFont = new Promise<TextToSVG>((resolve, reject) => {
    TextToSVG.load('/Oswald-Medium.ttf', (err, instance) => {
        if (err) {
            reject(err);
            return;
        }

        if (instance === null) {
            reject(new Error('Instance is null'));
            return;
        }

        resolve(instance);
    });
});

export function textToSVG (text: string, options: TextToSVG.GenerationOptions): Promise<{ metrics: TextToSVG.Metrics, path: string }> {
    return loadFont.then(instance => {
        const path = instance.getPath(text, options);
        const metrics = instance.getMetrics(text, options);
        return { path, metrics };
    });
}
