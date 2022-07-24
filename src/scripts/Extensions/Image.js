import { Image } from '@tiptap/extension-image'
import { mergeAttributes, } from '@tiptap/core'

/**
 * Help texts.
 */
export const altTextPlaceholder = 'Describe the image with alt text';
export const altTextHelp = 'Alternative Text (Alt Text or Alt Tag) is intended to convey the context of the image';

/**
 * Extend default image, adding support for alt tag and link updates.
 *
 * @see BubbleMenuImage.vue
 */
export default Image.extend({

    /**
     * Add the `data-href` attribute, which if present, will wrap the rendered
     * html of an image in a `a` tag with `data-href` set to `href`
     */
    addAttributes() {
        return {
            ...this.parent?.(),
            'data-href': {
                default: null,
            }
        }
    },

    /**
     * Override setImage so it updates as well as creates.
     */
    addCommands() {
        return {
            setImage: (options) => ({ tr, commands }) => {
                if(tr.selection?.node?.type?.name === 'image') {
                    return commands.updateAttributes('image', options)
                }
                else {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options
                    })
                }
            },
        }
    },

    /**
     * This overrides the output within the editor, without this renderHTML would
     * get called and wrap a url around the image if set. This results in a poor
     * ux so we simply render the image wrapped in a div.
     */
    addNodeView() {
        return ({ node }) => {
            // Create a wrapper for the image.
            const wrapper = document.createElement('div')
            wrapper.className = 'wysiwyg-image-wrapper'

            // Create an image.
            const content = document.createElement('img')
            content.src = node.attrs.src

            // Wrap the image.
            wrapper.append(content)

            return {
                dom: wrapper,
                contentDOM: content,
            };
        }
    },

    /**
     * Override the html output. If data-href is set we wrap the image in an
     * `a` tag and apply the correct href.
     */
    renderHTML({ node, HTMLAttributes }) {
        const img = [
            'img',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
        ]

        return HTMLAttributes['data-href']
            ? ['a', {href: HTMLAttributes['data-href'], class: 'image-link'}, img]
            : img
    }
})

