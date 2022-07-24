<template>
    <floating-menu
        :editor="editor"
        :tippy-options="tippyOptions"
        v-if="editor"
        v-show="visible"
        class="paper-wysiwyg-block-menu"
    >
        <ul>
            <paper-wysiwyg-block-menu-item
                v-for="blockTypeSetting in sets.heading"
                :key="blockTypeSetting.name + blockTypeSetting.label"
                :icon="blockTypeSetting.icon"
                :label="blockTypeSetting.label"
                @click="toggleStyle(blockTypeSetting)"
            />
            <paper-wysiwyg-block-menu-item-divider />
            <paper-wysiwyg-block-menu-item
                v-for="blockTypeSetting in sets.list"
                :key="blockTypeSetting.name"
                :icon="blockTypeSetting.icon"
                :label="blockTypeSetting.label"
                @click="toggleStyle(blockTypeSetting)"
            />
            <paper-wysiwyg-block-menu-item-divider />
            <paper-wysiwyg-block-menu-item
                v-for="blockTypeSetting in sets.other"
                :key="blockTypeSetting.name"
                :icon="blockTypeSetting.icon"
                :label="blockTypeSetting.label"
                @click="toggleStyle(blockTypeSetting)"
            />
        </ul>
        <input type="file" ref="upload" @change.prevent="upload" v-show="false" />
    </floating-menu>
</template>

<script>
import { FloatingMenu  } from '@tiptap/vue-2'
import PaperWysiwygBlockMenuItem from "./BlockMenuItem";
import PaperWysiwygBlockMenuItemDivider from "./BlockMenuItemDivider";
import MenuMixin from "../MenuMixin";

export default {
    name: "paper-wysiwyg-block-menu",
    components: {
        PaperWysiwygBlockMenuItemDivider,
        PaperWysiwygBlockMenuItem,
        FloatingMenu
    },
    mixins: [MenuMixin],
    props: {
        editor: {
            type: Object,
            required: true,
        },
        tippyOptions: {
            type: Object,
            default: () => {
                return { duration: 100, placement: 'bottom-start' }
            },
        }
    },
    data() {
        return {
            menuKey: null
        }
    },
    computed: {
        wrapperClass() {
            return 'paper-wysiwyg-block-menu'
        },
        visible() {
            return this.editor.options.editorProps.showBlockMenu
        },
    },
    methods: {
        closeMenu() {
            this.editor.options.editorProps.showBlockMenu = false
        },
    }
}
</script>

