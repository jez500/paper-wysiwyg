<template>
    <bubble-menu
        class="paper-wysiwyg-bubble-menu-inline"
        :editor="editor"
        :tippy-options="tippyOptions"
        v-show="visible"
    >
        <paper-wysiwyg-bubble-menu-button
            :class="buttonClass(type)"
            v-for="type in sets.inline"
            :key="type.name"
            :icon="type.icon"
            @click="toggleStyle(type)"
        />
        <span class="paper-wysiwyg-bubble-menu-divider" />
        <paper-wysiwyg-bubble-menu-button
            :class="buttonClass(type)"
            v-for="type in headingTypes"
            :key="type.name + type.label"
            :icon="type.icon"
            @click="toggleStyle(type)"
        />
        <paper-wysiwyg-bubble-menu-button
            :class="buttonClass(type)"
            v-for="type in getTypes('other')"
            :key="type.name"
            :icon="type.icon"
            @click="toggleStyle(type)"
        />
        <span class="paper-wysiwyg-bubble-menu-divider" />
        <paper-wysiwyg-bubble-menu-button
            :class="buttonClass(type)"
            v-for="type in getTypes('list')"
            :key="type.name"
            :icon="type.icon"
            @click="toggleStyle(type)"
        />
        <span class="paper-wysiwyg-bubble-menu-divider" />
        <paper-wysiwyg-bubble-menu-button
            :class="buttonClass(linkType)"
            :icon="linkType.icon"
            @click="toggleStyle(linkType)"
        />

    </bubble-menu>
</template>

<script>
import { BubbleMenu } from '@tiptap/vue-2'
import { isTextSelection, isNodeSelection } from '@tiptap/core';
import PaperWysiwygBubbleMenuButton from "./BubbleMenuButton";
import MenuMixin from "../MenuMixin";

export default {
    name: "paper-wysiwyg-bubble-menu-inline",
    components: {
        PaperWysiwygBubbleMenuButton,
        BubbleMenu
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
                return {placement: 'top', appendTo: document.body}
            },
        }
    },
    data() {
        return {
            visible: false,
            exclude: ['image', 'link', 'table'],
            activeClass: 'paper-wysiwyg-bubble-menu-button--active',
            heading: [2, 3],
            other: ['quote'],
            list: ['unordered', 'ordered']
        }
    },
    mounted() {
        this.editor.on('selectionUpdate', ({ editor }) => {
            const isExcluded = this.exclude.filter(type => editor.isActive(type)).length !== 0
            this.visible = this.shouldShow(this.editor) && !isExcluded
        })
        this.$on('close', () => {
            this.visible = false
        })
    },
    methods: {
        getTypes(name) {
            return this.sets[name].filter(type => this[name].includes(type.name))
        },
        buttonClass(type) {
            type.args = type.args || {}
            return this.editor.isActive(type.name, type.args) ? this.activeClass : ''
        },
        shouldShow (editor)  {
            try {
                const ranges = this.getSelectionRange(editor)
                return ranges.to > ranges.from;
            } catch (err) {}
            return false
        }
    },
    computed: {
        headingTypes() {
            return this.sets.heading.filter(type => this.heading.includes(type.args.level))
        },
        linkType() {
            return this.sets.other.filter(type => type.name === 'link')[0]
        }
    }
}
</script>
