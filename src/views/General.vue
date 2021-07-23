<template>
    <form>
        <div class="form-field">
            <label>Modname in langer Form</label>
            <input type="text" placeholder="Sling Helmet" v-model="values.fullName"/>
            <small>Ohne "Gruppe Adler" / "GRAD"<br/>Keine Abkürzung (also "Civilians" und nicht "Civs")<br/>Leerzeichen bei mehreren Wörtern</small>
        </div>
        <div class="form-field">
            <label>Autoren</label>
            <div style="display: grid; grid-template-columns: 1fr auto; grid-gap: .25rem;">
                <input type="text" placeholder="DerZade" v-model="author" @keydown.enter="addAuthor" />
                <button @click="addAuthor" type="button">Hinzufügen</button>
            </div>
            <ul v-if="values.authors.length > 0">
                <li v-for="(a, i) in values.authors" :key="i">
                    <span style="vertical-align: middle;">{{ a }}</span>
                    <span @click="removeAuthor(a)" class="material-icons" style="color: rgba(var(--color-primary), 1); cursor: pointer; vertical-align: middle; margin-left: .25rem;">delete</span>
                </li>
            </ul>
            <i v-else>Keine Autoren hinzugefügt</i>
        </div>
        <div class="form-field">
            <label>GitHub Repository Name</label>
            <input type="text" placeholder="grad_slingHelmet" v-model="values.gitHubRepo" />
            <small>Nur Repository Name (<pre style="display: inline">github.com/gruppe-adler/</pre> wird automatisch vorgestellt)</small>
        </div>
        <div class="form-field">
            <label>Kurzbeschreibung</label>
            <textarea :placeholder="descriptionPlaceholder" rows="5" v-model="values.description"></textarea>
            <small>Anfangend mit <i>"Gruppe Adler"</i> + Modname in langer Form<br/>(z.B.: "Gruppe Adler Sling Helmet is da SHIT.")<br/>unterstützt <a href="https://community.bistudio.com/wiki/Structured_Text" target="_blank">Structured Text</a></small>
        </div>
    </form>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Values } from '@/Values';
import { Prop } from 'vue-property-decorator';

@Options({})
export default class General extends Vue {
    @Prop({ required: true })
    private values!: Values;

    private author = '';

    /**
     * Callback of "add"-button or KeyDown.Enter of
     * author input
     */
    private addAuthor () {
        this.values.authors.push(this.author);
        this.author = '';
    }

    /**
     * Remove author from list
     * @param {string} author Author to remove
     */
    private removeAuthor (author: string) {
        this.values.authors = this.values.authors.filter(x => x !== author);
    }

    private get descriptionPlaceholder () {
        if (this.values.fullName.length === 0) return 'Gruppe Adler Sling Helmet...';

        return `Gruppe Adler ${this.values.fullName}...`;
    }
}
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
}
</style>
