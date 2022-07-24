<template>
    <div class="paper-wysiwyg-bubble-menu__form">

        <div class="paper-wysiwyg-bubble-menu__form-input">
            <paper-wysiwyg-bubble-menu-button icon="arrow_left" @click="submit" />

            <select v-if="type === 'select'" v-model="valueMutable" @change="submit">
                <option v-for="option in options" :key="option.value" :value="option.value" v-text="option.label" />
            </select>

            <input
                v-else
                :type="type"
                v-model="valueMutable"
                class="paper-wysiwyg-bubble-menu-text-input"
                @keypress.prevent.enter="submit"
                :placeholder="placeholder"
                @blur="submit"
            />

        </div>

        <div class="paper-wysiwyg-bubble-menu__form-description">
            <slot name="description"></slot>
            <p v-if="description">{{ description }}</p>
        </div>

    </div>
</template>

<script>
// Provides a single form input used in bubble menus.
import PaperWysiwygBubbleMenuButton from "./BubbleMenuButton";
export default {
    name: "paper-wysiwyg-bubble-menu-form-input",
    components: {PaperWysiwygBubbleMenuButton},
    props: {
        value: {
            type: [String, Number],
            default: '',
        },
        type: {
            type: String,
            default: 'text',
        },
        options: {
            type: Array,
            default: () => [],
        },
        description: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: '',
        }
    },
    data() {
        return {
            valueMutable: this.value,
        }
    },
    methods: {
        submit() {
            this.$emit('input', this.valueMutable)
        }
    }
}
</script>
