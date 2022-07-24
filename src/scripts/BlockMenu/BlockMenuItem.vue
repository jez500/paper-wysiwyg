<template>
    <li class="paper-wysiwyg-block-menu__item">
        <button @click.prevent="click">
            <span class="paper-wysiwyg-block-menu__item__icon">
                <paper-wysiwyg-icon v-if="icon" :icon="icon" />
                <slot name="icon" />
            </span>
            <span class="paper-wysiwyg-block-menu__item__label">
                {{ label }}
                <slot name="label" />
            </span>
            <span class="paper-wysiwyg-block-menu__item__help">
                 {{ help }}
                <slot name="help" />
            </span>
        </button>
    </li>
</template>

<script>
import PaperWysiwygIcon from "../Icon";
export default {
    name: "paper-wysiwyg-block-menu-item",
    components: {PaperWysiwygIcon},
    props: {
        icon: {
            type: String,
            default: null,
        },
        label: {
            type: String,
            default: null,
        },
        help: {
            type: String,
            default: null,
        }
    },
    methods: {
        click() {
            this.$emit('click')
        }
    }
}
</script>
