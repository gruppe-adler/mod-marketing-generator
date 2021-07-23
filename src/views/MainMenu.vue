<template>
    <div class="main-menu-logo">
        <div class="form-field" style="grid-area: text;">
            <label>Text</label>
            <textarea placeholder="CIVILIANS" rows="2" v-model="values.mainMenuLogo.text" style="resize: none;"></textarea>
            <small>Wenn möglich Modname in langer Form statt nur Abkürzung<br/>Bis zu zwei Zeilen</small>
        </div>
        <div class="form-field" style="grid-area: font;">
            <label>Schriftgröße</label>
            <input type="number" step="0.5" v-model="values.mainMenuLogo.fontSize" max="27" />
            <small>Nur verändern, wenn Platz nicht ausreicht!</small>
        </div>
        <img :src="previewURL" style="grid-area: logo; align-self: center;">
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { generateLogo } from '@/utils/logo';
import { Watch, Prop } from 'vue-property-decorator';
import { Values } from '@/Values';

@Options({})
export default class ManinMenu extends Vue {
    @Prop({ required: true })
    private values!: Values;

    private previewURL: string|null = null;

    public created (): void {
        this.redrawPreview();
    }

    public beforeUnmount (): void {
        if (this.previewURL) URL.revokeObjectURL(this.previewURL);
    }

    @Watch('values.mainMenuLogo', { deep: true })
    private async redrawPreview () {
        const { text, fontSize } = this.values.mainMenuLogo;

        const logo = await generateLogo(text, { fontSize });

        if (this.previewURL !== null) URL.revokeObjectURL(this.previewURL);
        this.previewURL = URL.createObjectURL(logo);
    }
}
</script>

<style lang="scss" scoped>
.main-menu-logo {
    display: grid;
    grid-column-gap: .25rem;
    align-content: flex-start;
    grid-template:
        "text logo" auto
        "font logo" auto / 1fr auto;
}
</style>
