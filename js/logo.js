import { textToSVG } from "./textToSVG.js";

const EYE_PATH = '<path fill-rule="evenodd" clip-rule="evenodd" d="M93.5 19C97.9183 19 101.5 15.4183 101.5 11C101.5 6.58172 97.9183 3 93.5 3C89.0817 3 85.5 6.58172 85.5 11C85.5 15.4183 89.0817 19 93.5 19ZM93.5 16C96.2614 16 98.5 13.7614 98.5 11C98.5 8.23858 96.2614 6 93.5 6C90.7386 6 88.5 8.23858 88.5 11C88.5 13.7614 90.7386 16 93.5 16Z" fill="white"/>';
const BACKGROUND_PATH = '<path d="M2 10C2 5.58172 5.58172 2 10 2H118C122.418 2 126 5.58172 126 10V118C126 122.418 122.418 126 118 126H10C5.58172 126 2 122.418 2 118V10Z" fill="#010103"/>';
const BEAK_PATH = `
<!-- Beak Shadow -->
<path d="M61.0126 30.7283C61.0126 30.7283 73.9426 22.5037 82.0064 48.8044C87.4825 47.7823 97.4484 49.2599 100.053 53.2894C96.3911 53.5072 88.191 56.0581 85.7308 56.7783C83.9836 57.3428 81.9813 57.9332 79.8107 58.6438C68.4031 62.5206 61.3983 69.4629 57.1005 76.7911C53.041 82.9072 51.4253 89.9518 50.2164 91.0959L36.6803 61.4334C34.1158 55.739 33.1051 45.2976 38.7736 42.478L60.9923 30.782L60.9685 30.7283L61.0126 30.7283Z" fill="black" fill-opacity="0.4"/>

<!--Beak -->
<path d="M100.061 37.7463C100.282 37.6464 100.451 37.5262 100.606 37.2784C100.799 36.9071 100.891 36.5086 100.874 36.1037C95.416 36.6423 89.0041 39.0747 86.4336 39.8803L86.3424 39.9073C84.6364 40.4119 82.6672 40.9944 80.5874 41.7125C74.2076 43.8871 69.2832 47.0795 65.4841 50.7644L100.061 37.7463Z" fill="#854605"/>
<path d="M61.0126 11.4783C61.0126 11.4783 73.9426 3.25374 82.0064 29.5544C87.4825 28.5323 97.4484 30.0099 100.053 34.0394C96.3911 34.2572 88.191 36.8081 85.7308 37.5283C83.9836 38.0928 81.9813 38.6832 79.8107 39.3938C68.4031 43.2706 61.3983 50.2129 57.1005 57.5411C53.041 63.6572 51.4253 70.7018 50.2164 71.8459L36.6803 42.1834C34.1158 36.489 33.1051 26.0476 38.7736 23.228L60.9923 11.532L60.9685 11.4783L61.0126 11.4783Z" fill="#D18D1E"/>
<path d="M70.7642 27.5018C68.6659 28.6691 62.5433 21.1969 60.7657 18.9286C60.5586 18.6661 60.7545 18.3111 61.1169 18.3258C63.1972 18.5008 68.6058 18.956 70.4404 20.2646C72.7301 21.991 73.2324 26.1679 70.7642 27.5018Z" fill="#854205"/>
<path d="M69.718 25.5715C68.0301 26.4651 62.4625 19.6326 62.5844 19.3108C62.7267 18.9354 67.9467 19.5645 69.4799 20.6975C71.0871 21.7972 71.4263 24.6244 69.718 25.5715Z" fill="#010103"/>
`;

export const DEFAULT_LOGO_TEXT_SIZE = 27;

/**
 * Generate logo
 * @param {string} text Logo text
 * @param {Object} [options] Options
 * @param {boolean} [options.active] Whether t generate active state (hover state)
 * @param {number} [options.fontSize] Font size of logo (default 27)
 * @returns {Promise<Blob>}
 */
export async function generateLogo (text, options = {}) {
    const lines = text.split('\n').map(x => x.trim().toUpperCase());

    const svgOptions = {
        fontSize: options.fontSize ?? DEFAULT_LOGO_TEXT_SIZE,
        anchor: 'center bottom',
        attributes: { fill: 'white' }
    }

    let textPaths = [];
    if (lines.length === 2) {
        const [line1, line2] = lines;
        const { path: path1 } = await textToSVG(line1, { x: 64, y: 95, ...svgOptions });
        const { path: path2  } = await textToSVG(line2, { x: 64, y: 122, ...svgOptions });
        textPaths.push(path1, path2);
    } else {
        const line = lines[0];

        const { path } = await textToSVG(line, { x: 64, y: 110, ...svgOptions });
        textPaths.push(path);
    }

    const svgString = `
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${BACKGROUND_PATH}
        ${textPaths.join('\n')}
        ${BEAK_PATH}
        ${options.active ? EYE_PATH : ''}
    </svg>
    `;

    return new Blob([svgString], { type: 'image/svg+xml' });
}