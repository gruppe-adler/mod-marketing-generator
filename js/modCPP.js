import { NAMES } from './const.js';

const OVERVIEW_PREFIX = `<br/><t align='center' size='0.75'>Visit Gruppe Adler on <t href='https://gruppe-adler.de/'>our Website</t> | <t href='http://discord.gruppe-adler.de'>Discord</t> | <t href='https://www.youtube.com/user/gruppeadler'>YouTube</t> | <t href='https://twitter.com/Gruppe_Adler'>Twitter</t></t><br/><br/>`

/**
 * @param {string} fullName Modname in langer Form (keine Abkürzung also "Civilians" und nicht "Civs"; Spaces bei mehreren Wörtern)
 * @param {string[]} authors Authors
 * @param {string} gitHubRepo GitHub Repository 
 * @param {string} description Description
 */
export function generateModCPP(fullName, authors, gitHubRepo, description) {

    /**
     * @type {Map<string, string|number|unknown[]>}
     */
    const attributes = new Map();
    const prefixedName = `Gruppe Adler ${fullName}`;

    attributes.set('name', prefixedName);
    attributes.set('author', authors.join(', '));
    attributes.set('logo', `${NAMES.logo}.paa`);
    attributes.set('logoOver', `${NAMES.logoActive}.paa`);
    attributes.set('tooltip', prefixedName);
    attributes.set('tooltipOwned', prefixedName);
    attributes.set('picture', `${NAMES.overview}.paa`);
    attributes.set('actionName', 'GitHub');
    attributes.set('action', `https://github.com/gruppe-adler/${gitHubRepo}`);
    attributes.set('overview', `${OVERVIEW_PREFIX}${description}`);
    attributes.set('hideName', 0);
    attributes.set('hidePicture', 0);
    attributes.set('dlcColor[]', [0.8196, 0.5529, 0.1216, 1]);
    attributes.set('logoSmall', `${NAMES.logoSmall}.paa`);
    
    const content = Array.from(attributes.entries()).map(([name, value]) => `${name} = ${encodeAttributeValue(value)};`).join('\n');

    return new Blob([content], { type: 'text/x-c' });
}

/**
 * @param {unknown} value Value to encode
 * @returns {string} Encoded value
 */
function encodeAttributeValue(value) {
    switch (typeof value) {
        case 'string':
            return `"${value}"`;
        case 'number':
            return `${value}`;
        case 'boolean':
            return value ? '1' : '0';
        case 'object':
            if (Array.isArray(value)) {
                return `{${value.map(encodeAttributeValue).join(', ')}}`;
            }
            break;
    }

    throw new Error(`Couldn\'t encode value (${value}) of type ${typeof value}`)
}