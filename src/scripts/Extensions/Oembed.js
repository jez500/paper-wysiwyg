import { Node, mergeAttributes, markPasteRule } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import oEmbedProviders from '../oEmbedProviders'

// This is really just an iframe, but specifically defining as oembed.
export const Oembed = Node.create({
    name: 'oembed',

    defaultOptions: {
        embedOnPaste: true,
        inline: false,
        HTMLAttributes: {},
    },

    group: 'block',

    draggable: true,

    atom: true,

    addAttributes() {
        return {
            html: {
                default: '',
                rendered: false,
            },
            src: {
                default: null,
            },
            title: {
                default: null,
            },
            frameborder: {
                default: '0',
            },
            allow: {
                default: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            },
            allowfullscreen: {
                default: 'allowfullscreen'
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: 'iframe[src]',
            },
        ]
    },

    // @todo change wrapper class based on aspect ratio.
    renderHTML({ HTMLAttributes }) {
        return ['div', {class: 'oembed-wrapper'}, ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]]
    },

    addCommands() {
        return {
            // Add iframe tag in html.
            setOembedContentFromHtml: (options) => ({ commands }) => {
                return commands.insertContent(options.html + '<p></p>');
            },
            // Add via iframe src only.
            setOembedContentFromAttrs: (options) => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                })
            },
        }
    },

    addProseMirrorPlugins() {
        const plugins = []

        // Turn Youtube urls into videos when pasted into the editor.
        if (this.options.embedOnPaste) {
            plugins.push(
                new Plugin({
                    key: new PluginKey('handlePasteLink'),
                    props: {
                        handlePaste: (view, event, slice) => {
                            let textContent = ''
                            let embedUrl = false

                            slice.content.forEach(node => {
                                textContent += node.textContent
                            })

                            if (!textContent) return false

                            oEmbedProviders.forEach((provider) => {
                                if (embedUrl) return
                                embedUrl = provider.buildEmbed(textContent)
                            })

                            if (! embedUrl) {
                                return false
                            }

                            this.editor.commands.setOembedContentFromAttrs({src: embedUrl});

                            return true
                        },
                    },
                }),
            )
        }

        return plugins
    },

})
