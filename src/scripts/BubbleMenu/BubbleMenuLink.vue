<template>
    <bubble-menu
        class="paper-wysiwyg-bubble-menu-link"
        :editor="editor"
        v-if="editor"
        :tippy-options="{placement: 'top'}"
        v-show="editor.isActive('link')"
        v-observer:subtree.childList="focusInput"
    >

        <div v-if="editor.isActive('link')" class="paper-wysiwyg-bubble-menu-inner">

            <input
                ref="url"
                class="paper-wysiwyg-bubble-menu-text-input"
                type="text"
                v-model="url"
                placeholder="Link url"
                @keydown.enter="updateLink(); close()"
            />

            <button
                @click="new_window = !new_window; updateLink()"
                class="paper-wysiwyg-bubble-menu-button"
                :class="{'paper-wysiwyg-bubble-menu-button--active': new_window}"
                title="Toggle if link opens in new window"
            >
                <paper-wysiwyg-icon icon="external_link" />
            </button>

            <button
                @click.prevent="destroy"
                class="paper-wysiwyg-bubble-menu-button"
                title="Remove link"
            >
                <paper-wysiwyg-icon icon="close" />
            </button>

        </div>

    </bubble-menu>
</template>

<script>
import { BubbleMenu } from '@tiptap/vue-2'
import { linkStyles } from "../Extensions/Link"
import { observer } from 'vue-mutation-observer'
import PaperWysiwygIcon from "../Icon";

export default {
    name: "paper-wysiwyg-bubble-menu-link",
    directives: { observer },
    components: {
        PaperWysiwygIcon,
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
            url: '',
            title: '',
            style: '',
            styleOptions: linkStyles,
            new_window: false,
            markChange: false,
        }
    },
    mounted() {
        /**
         * On selection change, update the mutable data values with the wysiwyg values.
         */
        this.editor.on('selectionUpdate', ({ editor }) => {
            const attrs = editor.getAttributes('link');
            this.url = attrs.href || ''
            this.title = attrs.title || null
            this.style = attrs.class || linkStyles[0].value
            this.new_window = attrs.target === '_blank'
        })
    },
    computed: {
        newWinButtonLabel() { return 'Open in ' + (this.new_window ? 'the same' : 'a new') + ' tab' },
        titleButtonLabel() { return (this.title ? 'Edit' : 'Add') + ' tooltip' },
    },
    methods: {
        /**
         * Update selected node and close edit form.
         */
        updateLink() {
            let attrs = {
                href: this.url,
                class: this.style,
                title: this.title,
                target: (this.new_window ? '_blank' : null),
            };
            this.editor.chain().focus().extendMarkRange('link').setLink(attrs).run()
        },
        /**
         * Toggle new window setting.
         */
        newWindowToggle() {
            this.new_window = !this.new_window
            this.updateLink();
        },
        /**
         * Remove the selected node.
         */
        destroy() {
            this.editor.chain().focus().unsetLink().run()
            this.close()
        },
        /**
         * Close link editor.
         */
        close() {
            this.editor.chain().focus().blur()
        },
        /**
         * Focus on text input.
         */
        focusInput() {
            setTimeout(() => {
                this.$refs.url?.focus()
            }, 100)
        }
    }
}
</script>
