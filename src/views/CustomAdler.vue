<template>
    <div style="display: flex; flex-direction: column;">
        <label>Vorschau</label>
        <img :src="previewURL">
        <button v-if="values.uploadedAdler === null" @click="$refs.input.click()">
            <span class="material-icons">add_photo_alternate</span>
            <span>Eigenen Adler hochladen</span>
        </button>
        <button v-else @click="values.uploadedAdler = null;">
            <span class="material-icons">delete</span>
            <span>Eigenen Adler entfernen</span>
        </button>
        <p>Dein Adler sollte folgende Anforderungen erfüllen:</p>
        <ul>
            <li>Transparenter Hintergrund</li>
            <li>Schriftzug im Bild zentriert</li>
            <li>Höhe mindestens 960px</li>
            <li>Oben und unten keine Ränder</li>
        </ul>
        <p><i>Der Adler oben dient als gutes Beispiel all dieser Anforderungen.</i></p>
        <input type="file" accept="image/*" @change="onAdlerFileChanged" style="visibility: hidden; height: 0;" ref="input" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Values } from '@/Values';
import { Prop, Watch } from 'vue-property-decorator';
import { generatePseudoCustomAdler } from '@/utils/pseudoCustomAdler';

@Options({})
export default class CustomAdler extends Vue {
    @Prop({ required: true })
    private values!: Values;

    private previewURL: string|null = null;

    public created (): void {
        this.redrawPreview();
    }

    public beforeUnmount (): void {
        if (this.previewURL) URL.revokeObjectURL(this.previewURL);
    }

    private onAdlerFileChanged (e: Event) {
        const input = e.target as HTMLInputElement;
        if (!input.files) return;

        const files = Array.from(input.files);
        if (files.length === 0) return;

        this.values.uploadedAdler = files[0];
    }

    @Watch('values.fullName')
    @Watch('values.uploadedAdler')
    private async redrawPreview () {
        const logo = this.values.uploadedAdler ?? await generatePseudoCustomAdler(this.values.fullName);

        if (this.previewURL !== null) URL.revokeObjectURL(this.previewURL);
        this.previewURL = URL.createObjectURL(logo);
    }
}
</script>

<style lang="scss" scoped>
img {
    $checkColor: rgba(var(--color-text), 0.1);

    width: 100%;
    max-width: 30rem;
    align-self: center;
    margin-top: 1rem;
    margin-bottom: 2rem;
    background-image:
        linear-gradient(45deg, $checkColor 25%, transparent 25%),
        linear-gradient(-45deg, $checkColor 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, $checkColor 75%),
        linear-gradient(-45deg, transparent 75%, $checkColor 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

ul {
    margin: 0;
}

li {
    margin: .25rem 0;
}
</style>
