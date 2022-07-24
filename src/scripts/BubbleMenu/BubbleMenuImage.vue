<template>
    <bubble-menu
        class="paper-wysiwyg-bubble-menu paper-wysiwyg-bubble-menu-image"
        :class="{'paper-wysiwyg-bubble-menu--form-open': formOpen}"
        :editor="editor"
        v-if="editor"
        :tippy-options="{placement: 'bottom'}"
        v-show="editor.isActive('image')"
    >
        <div>

            <div class="paper-wysiwyg-bubble-menu-toolbar" v-show="!formOpen">
                <paper-wysiwyg-bubble-menu-button icon="link" @click="formOpen = 'link'" />

                <span class="paper-wysiwyg-bubble-menu-divider" />
                <button class="paper-wysiwyg-bubble-menu-button-text" :title="altButtonLabel" @click.prevent="formOpen = 'alt'" v-text="altButtonLabel" />

                <span class="paper-wysiwyg-bubble-menu-divider" />
                <paper-wysiwyg-bubble-menu-button icon="bin" @click="destroy" />
            </div>

            <paper-wysiwyg-bubble-menu-form-input
                v-show="formOpen === 'link'"
                v-model="link"
                :key="link + 'url'"
                placeholder="https://example.com"
                description="A URL to open when a user clicks on this image"
                @input="update"
            />

            <paper-wysiwyg-bubble-menu-form-input
                v-show="formOpen === 'alt'"
                v-model="alt"
                :key="alt + 'alt'"
                :placeholder="altTextPlaceholder"
                :description="altTextHelp"
                @input="update"
            />

        </div>
    </bubble-menu>
</template>

<script>
import { BubbleMenu } from '@tiptap/vue-2'
import DistrictDistrictWysiwygBubbleMenuFormInput from "./BubbleMenuFormInput";
import { altTextHelp, altTextPlaceholder } from "../Extensions/Image";
import PaperWysiwygBubbleMenuFormInput from "./BubbleMenuFormInput";
import PaperWysiwygBubbleMenuButton from "./BubbleMenuButton";

export default {
    name: "district-paper-wysiwyg-bubble-menu-image",
    components: {
        PaperWysiwygBubbleMenuButton,
        PaperWysiwygBubbleMenuFormInput,
        DistrictDistrictWysiwygBubbleMenuFormInput,
        BubbleMenu
    },
    props: {
        editor: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            alt: '',
            link: '',
            formOpen: '', // Either null, link or alt.
            altTextHelp: altTextHelp,
            altTextPlaceholder: altTextPlaceholder,
        }
    },
    mounted() {
        /**
         * On selection change, update the mutable data values with the wysiwyg values.
         */
        this.editor.on('selectionUpdate', ({ editor }) => {
            if (editor.isActive('image')) {
                const attrs = editor.getAttributes('image');
                this.alt = attrs.alt;
                this.link = attrs['data-href'];
            }
        })
    },
    computed: {
        altButtonLabel() { return (this.alt ? 'Edit' : 'Add') + ' alt text' },
        linkButtonLabel() { return (this.link ? 'Edit' : 'Add') + ' link' },
    },
    methods: {
        /**
         * Update selected node and close edit form.
         */
        update() {
            this.editor
                .chain()
                .setImage({ alt: this.alt, 'data-href': this.link })
                .run()
            this.formOpen = '';
        },
        /**
         * Remove the selected node.
         */
        destroy() {
            this.editor
                .chain()
                .focus()
                .deleteSelection()
                .run()
        },
    },

}
</script>
