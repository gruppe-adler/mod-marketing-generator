<template>
    <div>
        <h1>Gruppe Adler {{ values.fullName }}</h1>
        <h2>Autoren</h2>
        <ul>
            <li v-for="(a, i) in values.authors" :key="i">{{a}}</li>
        </ul>
        <h2>Beschreibung</h2>
        <p>{{ values.description }}</p>
        <h2>Hauptmenü Logo</h2>
        <img :src="urls.logo" />
        <img :src="urls.logoActive" />
        <h2>Kleines Logo</h2>
        <img :src="urls.logoSmall" />
        <h2>Overview Bild</h2>
        <img :src="urls.overview" />
        <h2>Steam WS Logo</h2>
        <img :src="urls.steam" />
        <h2>GitHub Social Preview</h2>
        <img :src="urls.github" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Values } from '@/Values';
import { Prop } from 'vue-property-decorator';
import { generateLogo } from '@/utils/logo';
import { generateOverview } from '@/utils/overview';
import { generatePseudoCustomAdler } from '@/utils/pseudoCustomAdler';
import { generateGitHubSocialPreview } from '@/utils/gitHubSocialPreview';
import { generateSteamLogo } from '@/utils/steam';

@Options({})
export default class Verify extends Vue {
    @Prop({ required: true })
    private values!: Values;

    private urls: { [key: string]: string } = {};

    public created (): void {
        this.setup();
    }

    public beforeUnmount (): void {
        for (const key in this.urls) {
            if (Object.prototype.hasOwnProperty.call(this.urls, key)) URL.revokeObjectURL(this.urls[key]);
        }
    }

    private async setup () {
        const { text, fontSize } = this.values.mainMenuLogo;

        const resolve = (key: string) => (blob: Blob) => {
            this.urls[key] = URL.createObjectURL(blob);
        };

        const customAdler = this.values.uploadedAdler ?? await generatePseudoCustomAdler(this.values.fullName);

        generateLogo(text, { fontSize }).then(resolve('logo'));
        generateLogo(text, { fontSize, active: true }).then(resolve('logoActive'));
        fetch('/logo_small_ca.svg').then(res => res.blob()).then(resolve('logoSmall'));
        generateOverview(customAdler).then(resolve('overview'));
        generateSteamLogo(customAdler).then(resolve('steam'));
        generateGitHubSocialPreview(customAdler).then(resolve('github'));
    }
}
</script>

<style lang="scss" scoped>

h2 {
    margin-top: 1rem;
    margin-bottom: .25rem;
}

img {
    max-width: 100%;
}
</style>
