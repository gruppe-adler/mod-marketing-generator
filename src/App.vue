<template>
    <div class="steps">
        <template v-for="(step, id) of steps" :key="id">
            <router-link
                :to="`/${id}`"
                :style="`--step-text: '${step.text}';`"
                :class="stepClasses(id)"
            >
                <span class="material-icons">{{ step.icon }}</span>
            </router-link>
            <div class="steps__line"></div>
        </template>
    </div>
    <router-view :values="values"></router-view>
    <div class="buttons">
        <button v-if="previousShown" @click="previous">Zurück</button>
        <button v-if="nextShown"  @click="next">Weiter</button>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Values } from '@/Values';

interface Step {
    icon: string;
    text: string;
    done: boolean;
}

@Options({})
export default class App extends Vue {
    private steps: { [key: string]: Step|undefined } = {
        general: {
            icon: 'edit',
            text: 'Allgemeines',
            done: false
        },
        main_menu: {
            icon: 'image',
            text: 'Hauptmenü',
            done: false
        },
        custom_adler: {
            icon: 'add_photo_alternate',
            text: 'Adler',
            done: false
        },
        verify: {
            icon: 'rule',
            text: 'Überprüfen',
            done: false
        },
        done: {
            icon: 'check',
            text: 'Fertig',
            done: false
        }
    };

    private values: Values = {
        fullName: '',
        gitHubRepo: '',
        description: '',
        authors: [] as string[],
        uploadedAdler: null,
        mainMenuLogo: {
            text: '',
            fontSize: 27
        }
    };

    private currentStep = 'general';

    public created (): void {
        this.$router.afterEach((to) => {
            this.currentStep = to.path.substr(1);
        });
    }

    private stepClasses (id: string): string {
        if (this.currentStep === id) return 'steps--active';
        if (this.steps[id]?.done) return 'steps--done';

        return '';
    }

    private get previousShown (): boolean {
        const keys = Object.keys(this.steps);
        return keys.indexOf(this.currentStep) !== 0;
    }

    private get nextShown (): boolean {
        const keys = Object.keys(this.steps);
        return keys.indexOf(this.currentStep) !== keys.length - 1;
    }

    private previous () {
        const keys = Object.keys(this.steps);
        const index = keys.indexOf(this.currentStep);
        const previousStep = keys[index - 1];
        this.$router.push(previousStep);
    }

    private next () {
        const keys = Object.keys(this.steps);
        const index = keys.indexOf(this.currentStep);
        const nextStep = keys[index + 1];
        this.$router.push(nextStep);
    }
}
</script>

<style lang="scss">
body, html {
    margin: 0;
    font-size: 16px;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    font-family: Soruce Sans Pro, sans-serif;

    --color-text: 0, 0, 0;
    --color-primary: 47, 128, 237;
    --color-background: 255, 255, 255;
}

h1, h2, h3, h4, h5, h6 {
    font-family: Oswald, sans-serif;
}

textarea, input, pre, code {
    font-family: Source Code Pro, monospace;
}

#app {
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100vh;
    width: 100vw;
    padding: 2rem;
    box-sizing: border-box;
    justify-content: center;
    justify-items: center;
    row-gap: 1rem;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    > *:nth-child(2) {
        width: 40rem;
        box-sizing: border-box;
        padding: 0 1rem;
        max-width: 100vw;
        overflow-y: auto;
    }
}
</style>

<style lang="scss" scoped>
.buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;

    > * {
        font-size: 1.25rem;
    }
}

.steps {
    $textLineHeihgt: 2rem;

    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    max-width: calc(100vw - 3rem);

    > a {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        border-radius: 50%;
        width: 1.2em;
        height: 1.2em;
        --step-color: grey;

        background-color: var(--step-color);
        color: white;
        text-decoration: none;

        &::before {
            content: var(--step-text, '');
            display: block;
            position: absolute;
            top: 100%;
            color: var(--step-color);
            line-height: $textLineHeihgt;

            @media (max-width: 600px) {
                color: transparent;
            }
        }

        &.steps--active {
            --step-color: #2F80ED;

            @media (max-width: 600px) {
                &::before {
                    color: var(--step-color);
                }
            }
        }

        &.steps--done {
            --step-color: #66AA66;
        }

    }
    &__line {
        display: flex;
        content: '';
        width: 6rem;
        height: 2px;
        background-color: grey;

        &:last-child {
            display: none;
        }
    }
}
</style>

<style lang="scss">
.form-field {
    display: flex;
    flex-direction: column;
    row-gap: .125rem;
    margin-bottom: 1.5rem;

    > * {
        transition: background-color .1s ease-in-out;
    }

    &:focus-within {
        > label, > small {
            color: rgba(var(--color-text), 1);
        }
    }
}

label {
    font-size: 1.125rem;
}

label, small {
    color: rgba(var(--color-text), 0.7);
}

textarea, input {
    border: none;
    outline: none;
    border-radius: .25rem;
    padding: .5rem;
    color: rgba(var(--color-text), 1);
    background-color: rgba(var(--color-text), .05);

    &:focus {
        background-color: rgba(var(--color-text), .1);
    }

    &::placeholder {
        color: rgba(var(--color-text), 0.4);
    }
}

button {
    border: none;
    outline: none;
    border-radius: .25em;
    background-color: rgba(var(--color-primary), 1);
    color: rgba(var(--color-background), 1);
    cursor: pointer;
    font-weight: bold;
    padding: .5em 1em;
    transition: background-color .1s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .25rem;
    font-size: 1.05rem;

    &:hover,
    &:focus {
        background-color: rgba(var(--color-primary), .8);
    }
}
</style>
