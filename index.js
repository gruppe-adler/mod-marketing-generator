import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js'
import { generateLogo } from './logo.js';
import { generateOverview } from './overview.js';
import { generateModCPP } from './modCPP.js';
import { download } from './utils.js';
import 'https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js';
import { NAMES } from './const.js';

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
        overviewAdler: undefined
    },
    computed: {
        descriptionPlaceholder() {
            if (this.fullName.length === 0) return 'Gruppe Adler Sling Helmet...';

            return `Gruppe Adler ${this.fullName}...`;
        }
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

            this.overviewAdler = files[0];
            this.redrawOverviewPreview();
        },
    
        /**
         * Redraw overview picture preview
         */
        redrawOverviewPreview() {
            const canvas = document.getElementById('overview-preview');
            generateOverview(this.overviewAdler, { canvas });
        },
        
        /**
         * Redraw logo preview
         */
        redrawLogoPreview() {
            const canvas = document.getElementById('logo-preview');
            generateLogo(this.logo.text, { fontSize: this.logo.fontSize, canvas })
        },

        /**
         * Callback of "download"-button
         */
        async download() {
            const logoSmall = await fetch('./logo_small.png').then(res => res.blob());
            const overview = await generateOverview(this.overviewAdler);
            const logo = await generateLogo(this.logo.text, { fontSize: this.logo.fontSize });
            const logoActive = await generateLogo(this.logo.text, { fontSize: this.logo.fontSize, active: true });
            const modCPP = generateModCPP(this.fullName, this.authors, this.gitHubRepo, this.description);

            const zip = new JSZip();
            zip.file(`${NAMES.logoSmall}.png`, logoSmall);
            zip.file(`${NAMES.overview}.png`, overview);
            zip.file(`${NAMES.logo}.png`, logo);
            zip.file(`${NAMES.logoActive}.png`, logoActive);
            zip.file('mod.cpp', modCPP);

            const blob = await zip.generateAsync({ type: 'blob' });
            
            download('gruppe_adler_mod_marketing.zip', blob)
        }
    },
    mounted() {
        this.redrawLogoPreview();
        this.redrawOverviewPreview();
    },
    created() {
        fetch('./default_adler.png').then(res => res.blob()).then(blob => this.overviewAdler = blob);
    },
    watch: {
        logo: {
            deep: true,
            handler() {
                this.redrawLogoPreview();
            }
        },
        overviewAdler() {
            this.redrawOverviewPreview();
        }
    }
});
