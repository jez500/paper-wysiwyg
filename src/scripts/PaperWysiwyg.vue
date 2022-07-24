<template>
    <div :class="wrapperClass" v-if="editor">
        <paper-wysiwyg-bubble-menu-inline :editor="editor" />
        <paper-wysiwyg-bubble-menu-link :editor="editor" />
        <paper-wysiwyg-bubble-menu-table :editor="editor" />
        <district-paper-wysiwyg-bubble-menu-image :editor="editor" />
        <paper-wysiwyg-block-menu :editor="editor" />
        <editor-content :class="`${wrapperClass}__editor`" :editor="editor" />
    </div>
</template>

<script>
import { Editor, EditorContent, FloatingMenu  } from '@tiptap/vue-2'
// General typography.
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Link from './Extensions/Link'
import Blockquote from '@tiptap/extension-blockquote'
// Task list.
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
// Table
import Table from './Extensions/Table'
import TableRow from './Extensions/TableRow'
import TableHeader from './Extensions/TableHeader'
import TableCell from '@tiptap/extension-table-cell'
// Utilities
import Gapcursor from '@tiptap/extension-gapcursor'
import Placeholder from "./Extensions/Placeholder";
import { TrailingNode } from "./Extensions/TrailingNode";
// Image.
import Image from './Extensions/Image'
import PasteDropImagePlugin from "./Extensions/PasteDropImagePlugin"
// Code and Codeblock.
import Code from '@tiptap/extension-code'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { lowlight } from 'lowlight'
// Custom.
import { Oembed } from './Extensions/Oembed'
// Bubble menus.
import PaperWysiwygBlockMenu from "./BlockMenu/BlockMenu";
import PaperWysiwygBubbleMenuInline from "./BubbleMenu/BubbleMenuInline";
import PaperWysiwygBubbleMenuLink from "./BubbleMenu/BubbleMenuLink";
import PaperWysiwygBubbleMenuTable from "./BubbleMenu/BubbleMenuTable";
import DistrictPaperWysiwygBubbleMenuImage from "./BubbleMenu/BubbleMenuImage";

export default {
    name: 'paper-wysiwyg',
    components: {
        DistrictPaperWysiwygBubbleMenuImage,
        PaperWysiwygBubbleMenuLink,
        PaperWysiwygBubbleMenuInline,
        PaperWysiwygBlockMenu,
        PaperWysiwygBubbleMenuTable,
        EditorContent,
        FloatingMenu,
    },
    props: {
        value: {
            type: String,
            default: null,
        },
        variant: {
            type: String,
            default: 'default',
        },
        emptyText: {
            type: String,
            default: 'Write something great...',
        },
        uploadUrl: {
            type: String,
            default: null,
        },
        dark: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            editor: null,
        }
    },
    mounted() {
        this.editor = new Editor({
            content: this.value,
            extensions: [
                StarterKit,
                Placeholder.configure({
                    placeholder: this.emptyText,
                }),
                Blockquote,
                Typography,
                TaskList,
                TaskItem,
                Code,
                CodeBlockLowlight.configure({
                    lowlight,
                }),
                Image.extend({
                    addProseMirrorPlugins() {
                        return [PasteDropImagePlugin()];
                    },
                }),
                Oembed,
                Link.configure({
                    openOnClick: false,
                }),
                Table.configure({
                    resizable: true,
                }),
                TableRow,
                TableHeader,
                TableCell,
                Gapcursor,
                TrailingNode,
            ],
            onUpdate: this.contentUpdated,
            editorProps: {
                showBlockMenu: false,
                uploadUrl: this.uploadUrl,
            },
        });
    },
    methods: {
        contentUpdated({ editor }) {
            this.$emit('input', editor.getHTML());
        },
        contentUpdatedRenderless({ editor }) {
            this.$emit('input', this.stripTags(editor.getHTML()));
        },
        stripTags(html) {
            return html.replace(/(<([^>]+)>)/gi, "");
        }
    },
    computed: {
        wrapperClass() {
            let classes = ['paper-wysiwyg'];
            if (this.dark) classes.push('dark-mode');
            return classes
        },
        showBlockMenu() {
            return this.editor && !! this.editor.options.editorProps.showBlockMenu
        },
    },
    beforeDestroy() {
        this.editor.destroy()
    },
}
</script>
