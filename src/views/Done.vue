<template>
    <div v-if="state === 'pending'">
        Loading...
    </div>
    <div v-else-if="state === 'fulfilled'">
        <button
            @click="download"
            style="font-size: 1.5rem; margin: 2rem; margin-right: auto; margin-left: auto;"
        >
            <span class="material-icons">download</span>
            <span>Downlad</span>
        </button>
        <h2>Nächste Schritte</h2>
        <ol>
            <li>ZIP enpacken</li>
                <!-- <li><code>logo.png</code> ist nur eine hochauflösende Kopie des Logos</li> -->
                <li>Alle Bilder im Verzeichnis "mod" zu PAA konvertieren (z.B. mit <a href="https://paa.gruppe-adler.de" target="_blank">paa.gruppe-adler.de</a>)</li>
                <li>Die konvertieren PAAs + die mod/mod.cpp in das Hauptverzeichnis deiner Mod schieben</li>
                <li>
                    <span>Falls du deinen Mod mit HEMTT baust sollten alle generierten Dateien in dem "files"-Feld in der "hemtt.toml"stehen:</span>
                    <pre v-html="hemttFilesExample"></pre>
                </li>
        </ol>
    </div>
    <div v-else>
        An error occured :/
    </div>
</template>

<script lang="ts">
import JSZip from 'jszip';
import { Options, Vue } from 'vue-class-component';
import { Values } from '@/Values';
import { Prop } from 'vue-property-decorator';
import { generateLogo } from '@/utils/logo';
import { generatePseudoCustomAdler } from '@/utils/pseudoCustomAdler';
import { generateModCPP } from '@/utils/modCPP';
import { NAMES } from '@/utils/const';
import { generateOverview } from '@/utils/overview';
import { generateSteamLogo } from '@/utils/steam';
import { generateGitHubSocialPreview } from '@/utils/gitHubSocialPreview';
import { download } from '@/utils';

@Options({})
export default class Done extends Vue {
    @Prop({ required: true })
    private values!: Values;

    private promise!: Promise<Blob[]>;
    private state = 'pending';

    private async download () {
        const [logoSmall, logo, logoActive, overview, steamLogo, githubSocialPreview, modCPP, customAdler] = await this.promise;

        const zip = new JSZip();
        // TODO: Change file extensiosn to .paa
        zip.file(`mod/${NAMES.logoSmall}.svg`, logoSmall);
        zip.file(`mod/${NAMES.overview}.png`, overview);
        zip.file(`mod/${NAMES.logo}.svg`, logo);
        zip.file(`mod/${NAMES.logoActive}.svg`, logoActive);
        zip.file('mod/mod.cpp', modCPP);

        zip.file('steam_logo.png', steamLogo);
        zip.file('github_social_preview.png', githubSocialPreview);

        if (!this.values.uploadedAdler) zip.file('pseudo_custom_adler.svg', customAdler);

        const blob = await zip.generateAsync({ type: 'blob' });
        download('gruppe_adler_mod_marketing.zip', blob);
    }

    public created () {
        const customAdlerPromise = this.values.uploadedAdler ? Promise.resolve(this.values.uploadedAdler) : generatePseudoCustomAdler(this.values.fullName);

        this.promise = Promise.all([
            fetch('/logo_small_ca.svg').then(res => res.blob()).then(this.convertToPAA),
            generateLogo(this.values.mainMenuLogo.text, { fontSize: this.values.mainMenuLogo.fontSize }).then(this.convertToPAA),
            generateLogo(this.values.mainMenuLogo.text, { fontSize: this.values.mainMenuLogo.fontSize, active: true }).then(this.convertToPAA),
            customAdlerPromise.then(customAdler => generateOverview(customAdler)).then(this.convertToPAA),
            customAdlerPromise.then(customAdler => generateSteamLogo(customAdler)),
            customAdlerPromise.then(customAdler => generateGitHubSocialPreview(customAdler)),
            generateModCPP(this.values.fullName, this.values.authors, this.values.gitHubRepo, this.values.description),
            customAdlerPromise
        ]);

        this.promise.then(() => { this.state = 'fulfilled'; });
        this.promise.catch(() => { this.state = 'rejected'; });
    }

    private get hemttFilesExample (): string {
        const files = [
            'mod.cpp',
            `${NAMES.logoActive}.paa`,
            `${NAMES.logo}.paa`,
            `${NAMES.overview}.paa`,
            `${NAMES.logoSmall}.paa`
        ];

        return `files = [\n${files.map(f => `    <span style="color: #a5d6ff;">"${f}"</span>`).join(',\n')}\n]`;
    }

    private async convertToPAA (blob: Blob): Promise<Blob> {
        // TODO
        return blob;
    }
}
</script>

<style lang="scss" scoped>
li {
    margin: .5rem 0;
    line-height: 1.5em;
}

pre {
    border-radius: .5rem;
    background-color: #0d1117;
    color: white;
    padding: 1rem;
    margin-top: .25rem;
}
</style>
