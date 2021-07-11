import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js'
import { generateLogo } from './logo.js';
import { generateOverview } from './overview.js';
import { generateModCPP } from './modCPP.js';
import 'https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js';

var app3 = new Vue({
    el: document.getElementById('app'),
    data: {
        fullName: '',
        authors: [],
        gitHubRepo: '',
        description: '',
        author: '',
        logoText: '',
        logoFontSize: 27,
        customAdler: undefined
    },
    computed: {
        descriptionPlaceholder() {
            if (this.fullName.length === 0) return 'Gruppe Adler Sling Helmet...';

            return `Gruppe Adler ${this.fullName}...`;
        }
    },
    methods: {
        addAuthor() {
            this.authors.push(this.author);
            this.author = '';
        },
        removeAuthor(author) {
            this.authors = this.authors.filter(x => x !== author);
        },
        onFileChanged(e) {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            this.customAdler = files[0];
            this.redrawOverview();
        },
        redrawOverview() {
            generateOverview(this.customAdler);
        },
        redrawLogo() {
            generateLogo(this.logoText, { fontSize: this.logoFontSize })
        },
        async download() {
            const logoSmall = await fetch('/logo_small_ca.png').then(res => res.blob());
            const overview = await generateOverview(this.customAdler);
            const logo = await generateLogo(this.logoText, { fontSize: this.logoFontSize });
            const logoActive = await generateLogo(this.logoText, { fontSize: this.logoFontSize, active: true });
            const modCPP = generateModCPP({ 
                fullName: this.fullName,
                authors: this.authors,
                gitHubRepo: this.gitHubRepo,
                description: this.description,
            });

            const zip = new JSZip();
            zip.file('logo_small_ca.png', logoSmall);
            zip.file('overview_co.png', overview);
            zip.file('logo_ca.png', logo);
            zip.file('logo_active_ca.png', logoActive);
            zip.file('mod.cpp', modCPP);

            const blob = await zip.generateAsync({ type: 'blob' });

            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.download = 'gruppe_adler_mod_marketing.zip';
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            link.remove();
        
            // we revoke the url only after a delay because old Edge can't handle it otherwise
            window.setTimeout(() => URL.revokeObjectURL(url), 200);
        }
    },
    mounted() {
        this.redrawLogo();
        this.redrawOverview();
    },
    watch: {
        logoText() {
            this.redrawLogo();
        },
        logoFontSize() {
            this.redrawLogo();
        },
        customAdler() {
            this.redrawOverview();
        }
    }
});
