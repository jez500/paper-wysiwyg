import {Plugin} from "prosemirror-state";
import {findParentNode} from "prosemirror-utils";
import {Decoration, DecorationSet} from "prosemirror-view";


const MAX_MATCH = 500;
const OPEN_REGEX = /^\/(\w+)?$/;
const CLOSE_REGEX = /(^(?!\/(\w+)?)(.*)$|^\/(([\w\W]+)\s.*|\s)$|^\/((\W)+)$)/;

// based on the input rules code in Prosemirror, here:
// https://github.com/ProseMirror/prosemirror-inputrules/blob/master/src/inputrules.js
export function run(view, from, to, regex, handler) {
    if (view.composing) {
        return false;
    }
    const state = view.state;
    const $from = state.doc.resolve(from);
    if ($from.parent.type.spec.code) {
        return false;
    }

    const textBefore = $from.parent.textBetween(
        Math.max(0, $from.parentOffset - MAX_MATCH),
        $from.parentOffset,
        null,
        "\ufffc"
    );

    const match = regex.exec(textBefore);
    return !! handler(state, match, match ? from - match[0].length : from, to);
}

export function closeMenu(editor) {
    editor.options.editorProps.showBlockMenu = false
}

export function openMenu(editor) {
    editor.options.editorProps.showBlockMenu = true
}

export function isMenuOpen(editor) {
    return !! editor.options.editorProps.showBlockMenu;
}

export const BlockMenuTriggerPlugin = (editor, options) => {
    const button = document.createElement("button");
    button.className = "block-menu-trigger";
    button.type = "button";
    const text = document.createTextNode('+');
    button.appendChild(text)

    return [
        new Plugin({
            props: {
                handleClick: () => {
                    closeMenu(editor);
                    return false;
                },
                handleKeyDown: (view, event) => {
                    // Prosemirror input rules are not triggered on backspace, however
                    // we need them to be evaluted for the filter trigger to work
                    // correctly. This additional handler adds inputrules-like handling.

                    // Handle backspace when only content is /
                    if (event.key === "Backspace") {
                        // timeout ensures that the delete has been handled by prosemirror
                        // and any characters removed, before we evaluate the rule.
                        setTimeout(() => {
                            const { pos } = view.state.selection.$from;
                            return run(view, pos, pos, OPEN_REGEX, (state, match) => {
                                if (match) {
                                    openMenu(editor)
                                    console.log(match)
                                    //this.options.onOpen(match[1]);
                                } else {
                                    closeMenu(editor)
                                }
                                return null;
                            });
                        });
                    }

                    // If the query is active and we're navigating the block menu then
                    // just ignore the key events in the editor itself until we're done
                    if (
                        event.key === "Enter" ||
                        event.key === "ArrowUp" ||
                        event.key === "ArrowDown" ||
                        event.key === "Tab"
                    ) {
                        const { pos } = view.state.selection.$from;

                        return run(view, pos, pos, OPEN_REGEX, (state, match) => {
                            // just tell Prosemirror we handled it and not to do anything
                            return match ? true : null;
                        });
                    }

                    return false;
                },
                decorations: state => {
                    const parent = findParentNode(
                        node => node.type.name === "paragraph"
                    )(state.selection);

                    if (!parent) {
                        return;
                    }

                    const decorations = [];
                    const isEmpty = parent && parent.node.content.size === 0;
                    const isTopLevel = state.selection.$from.depth === 1;

                    const classes = [options.emptyNodeClass]

                    if (editor.isEmpty) {
                        classes.push(options.emptyEditorClass)
                    }

                    if (isTopLevel) {
                        if (isEmpty) {
                            // Add menu button.
                            decorations.push(
                                Decoration.widget(parent.pos, () => {
                                    button.addEventListener("click", () => {
                                        openMenu(editor)
                                    });
                                    return button;
                                })
                            );

                            // Add placeholder text.
                            decorations.push(
                                Decoration.node(
                                    parent.pos,
                                    parent.pos + parent.node.nodeSize,
                                    {
                                        class: classes.join(' '),
                                        "data-placeholder": options.placeholder,
                                    }
                                )
                            );
                        }

                        return DecorationSet.create(state.doc, decorations);
                    }

                    return;
                },
            },
        }),
    ];
}
