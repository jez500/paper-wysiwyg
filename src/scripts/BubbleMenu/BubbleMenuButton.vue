<template>
    <button
        class="paper-wysiwyg-bubble-menu-button"
        @click.prevent="click"
        :title="label"
    >
        <paper-wysiwyg-icon :icon="icon" />
    </button>
</template>

<script>
import PaperWysiwygIcon from "../Icon";
export default {
    name: "paper-wysiwyg-bubble-menu-button",
    components: {PaperWysiwygIcon},
    props: {
        icon: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            default: null,
        },
    },
    methods: {
        click() {
            this.$emit('click')
        }
    }
}
</script>
