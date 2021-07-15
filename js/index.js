import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js'
import { generateLogo } from './logo.js';
import { generateOverview } from './overview.js';
import { generatePseudoCustomAdler } from './pseudoCustomAdler.js';
import { generateModCPP } from './modCPP.js';
import { blobToImage, download } from './utils.js';
import 'https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js';
import { NAMES } from './const.js';

const extensionsByMimeType = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/svg+xml': 'svg',
    'image/webp	': 'webp',
};

new Vue({
    el: '#app',
    data: {
        fullName: '',
        authors: [],
        gitHubRepo: '',
        description: '',
        author: '',
        logo: {
            text: '',
            fontSize: 27,
        },
        logoPreviewURL: null,
        uploadedOverviewAdler: undefined,
        pseudoCustomAdler: undefined,
    },
    mounted() {
        this.redrawLogoPreview();
        this.redrawOverviewPreview();
        this.recalculatePseudoCustomAdler();
    },
    methods: {
        /**
         * Callback of "add"-button or KeyDown.Enter of
         * author input
         */
        addAuthor() {
            this.authors.push(this.author);
            this.author = '';
        },

        /**
         * Remove author from list
         * @param {string} author Author to remove
         */
        removeAuthor(author) {
            this.authors = this.authors.filter(x => x !== author);
        },

        /**
         * Change callback of adler file input
         * @param {InputEvent} e 
         */
        onAdlerFileChanged(e) {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            this.uploadedOverviewAdler = files[0];
            this.redrawOverviewPreview();
        },
    
        /**
         * Redraw overview picture preview
         */
        redrawOverviewPreview() {
            if (!this.overviewAdler) return;
            const canvas = document.getElementById('overview-preview');
            generateOverview(this.overviewAdler, { canvas, text: this.fullName });
        },

        recalculatePseudoCustomAdler() {
            const name = this.fullName;
            generatePseudoCustomAdler(name).then(blob => {
                if (this.fullName !== name) return;
                this.pseudoCustomAdler = blob;
            });
        },
        
        /**
         * Redraw logo preview
         */
        async redrawLogoPreview() {
            const logo = await generateLogo(this.logo.text, { fontSize: this.logo.fontSize });

            if (this.logoPreviewURL !== null) URL.revokeObjectURL(this.logoPreviewURL);
            this.logoPreviewURL = URL.createObjectURL(logo)
        },

        /**
         * Callback of "download"-button
         */
        async download() {
            const logoSmall = await fetch('./logo_small.svg').then(res => res.blob());
            const overview = await generateOverview(this.overviewAdler, { text: this.fullName });
            const logo = await generateLogo(this.logo.text, { fontSize: this.logo.fontSize });
            const logoActive = await generateLogo(this.logo.text, { fontSize: this.logo.fontSize, active: true });
            const modCPP = generateModCPP(this.fullName, this.authors, this.gitHubRepo, this.description);

            const zip = new JSZip();
            zip.file(`mod/${NAMES.logoSmall}.svg`, logoSmall);
            zip.file(`mod/${NAMES.overview}.png`, overview);
            zip.file(`mod/${NAMES.logo}.svg`, logo);
            zip.file(`mod/${NAMES.logoActive}.svg`, logoActive);
            zip.file('mod/mod.cpp', modCPP);
            zip.file(`logo.${extensionsByMimeType[this.overviewAdler.type]}`, this.overviewAdler);

            const blob = await zip.generateAsync({ type: 'blob' });
            
            download('gruppe_adler_mod_marketing.zip', blob)
        }
    },
    computed: {
        descriptionPlaceholder() {
            if (this.fullName.length === 0) return 'Gruppe Adler Sling Helmet...';

            return `Gruppe Adler ${this.fullName}...`;
        },
        hemttFilesExample() {
            const files = [
                'mod.cpp',
                `${NAMES.logoActive}.paa`,
                `${NAMES.logo}.paa`,
                `${NAMES.overview}.paa`,
                `${NAMES.logoSmall}.paa`
            ];

            return `files = [\n${files.map(f => `    "${f}"`).join(',\n')}\n]`
        },
        overviewAdler() {
            if (this.uploadedOverviewAdler) return this.uploadedOverviewAdler;
            return this.pseudoCustomAdler;
        }
    },
    watch: {
        logo: {
            deep: true,
            handler() {
                this.redrawLogoPreview();
            }
        },
        fullName() {
            this.redrawOverviewPreview();
            this.recalculatePseudoCustomAdler();
        },
        overviewAdler() {
            this.redrawOverviewPreview();
        }
    }
});
