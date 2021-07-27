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
            <!-- TODO: Proper Steps -->
            <li v-if="!values.uploadedAdler"><code>pseudo_custom_adler.svg</code> ist nur eine hochauflösende Kopie des Adlers für dich</li>
            <li><code>github_social_preview.png</code> kannst du <a :href="`https://github.com/gruppe-adler/${values.gitHubRepo}/settings`" target="_blank">hier</a> als "Social preview" einstellen</li>
            <li><code>steam_logo.png</code> dient als Logo für den Workshop (kann mit dem Arma 3 Publisher verändert werden)</li>
            <li>Alle Dateien im Verzeichnis <code>mod/</code> gehören in das Hauptverzeichnis deines Mods</li>
            <li>
                <span>Falls du deinen Mod mit HEMTT baust sollten alle generierten Dateien in dem "files"-Feld in der "hemtt.toml" stehen:</span>
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
import { blobToImage, download } from '@/utils';
import initAFF from '@/utils/aff';

const affPromise = initAFF();

@Options({})
export default class Done extends Vue {
    @Prop({ required: true })
    private values!: Values;

    private promise!: Promise<Blob[]>;
    private state = 'pending';

    private async download () {
        const [logoSmall, logo, logoActive, overview, steamLogo, githubSocialPreview, modCPP, customAdler] = await this.promise;

        const zip = new JSZip();
        zip.file(`mod/${NAMES.logoSmall}.paa`, logoSmall);
        zip.file(`mod/${NAMES.overview}.paa`, overview);
        zip.file(`mod/${NAMES.logo}.paa`, logo);
        zip.file(`mod/${NAMES.logoActive}.paa`, logoActive);
        zip.file('mod/mod.cpp', modCPP);

        zip.file('steam_logo.png', steamLogo);
        zip.file('github_social_preview.png', githubSocialPreview);

        if (!this.values.uploadedAdler) zip.file('pseudo_custom_adler.svg', customAdler);

        const blob = await zip.generateAsync({ type: 'blob' });
        download('gruppe_adler_mod_marketing.zip', blob);
    }

    public created (): void {
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

    private async blobToImageData (blob: Blob): Promise<ImageData> {
        const img = await blobToImage(blob);

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (ctx === null) throw new Error('Counldn\'t get context');

        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, img.width, img.height);

        canvas.remove();

        return data;
    }

    private async convertToPAA (blob: Blob): Promise<Blob> {
        const data = await this.blobToImageData(blob);
        const arr = (await affPromise).encode(data);
        return new Blob([arr], { type: 'image/vnd.paa' });
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
