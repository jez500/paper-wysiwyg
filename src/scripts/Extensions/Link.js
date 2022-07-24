import Link from '@tiptap/extension-link'
import { getMarkRange } from "@tiptap/core";
import { Plugin, TextSelection } from "prosemirror-state";

const DEFAULT_LINK_CLASS = 'paper-link';

// Available link styles.
export const linkStyles = [
    {value: DEFAULT_LINK_CLASS, label: 'Normal link'},
    {value: 'button', label: 'Button primary'},
    {value: 'button button-secondary', label: 'Button secondary'},
    {value: 'button button-tertiary', label: 'Button tertiary'},
]

// Extend default link based on preferences and adds ability to add
// a class when generating.
export default Link.extend({
    defaultOptions: {
        ...Link.options,
        openOnClick: false,
        HTMLAttributes: {
            rel: null,
            class: null,
            title: null,
        },
    },

    addAttributes() {
        return {
            ...this.parent(),
            class: {
                default: DEFAULT_LINK_CLASS,
            },
            title: {
                default: null,
            },
        }
    },

    /**
     * Select the link on click (required for bubble menu).
     */
    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handleClick(view, pos) {
                        const range = getMarkRange(view.state.doc.resolve(pos), view.state.schema.marks.link);
                        if (!range) return false;

                        const $start = view.state.doc.resolve(range.from);
                        const $end = view.state.doc.resolve(range.to);
                        const transaction = view.state.tr.setSelection(new TextSelection($start, $end));
                        view.dispatch(transaction);

                        return true;
                    },
                },
            }),
        ];
    },
})

