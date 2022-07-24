import Table from '@tiptap/extension-table'
import { DecorationSet, Decoration } from "prosemirror-view";
import { Plugin } from "prosemirror-state";
import {
    columnResizing,
    tableEditing,
} from '@_ueberdosis/prosemirror-tables'
import {
    isTableSelected,
    getCellsInColumn,
    selectTable
} from "prosemirror-utils";

// Extend table so a role can be added on create.

const DistTable = Table.extend({

    defaultOptions: {
        ...Table.options,
        HTMLAttributes: {
            role: 'none',
        },
    },

    addAttributes() {
        return {
            role: {
                default: 'none',
            },
            class: {
                default: 'paper-table',
            },
        }
    },

    addProseMirrorPlugins() {
        const isResizable = this.options.resizable && this.editor.isEditable

        return [
            ...(isResizable ? [columnResizing({
                handleWidth: this.options.handleWidth,
                cellMinWidth: this.options.cellMinWidth,
                View: this.options.View,
                lastColumnResizable: this.options.lastColumnResizable,
            })] : []),
            tableEditing({
                allowTableNodeSelection: this.options.allowTableNodeSelection,
            }),
            new Plugin({
                props: {
                    decorations: state => {
                        const { doc, selection } = state;
                        const decorations = [];
                        const cells = getCellsInColumn(0)(selection);

                        if (cells) {
                            cells.forEach(({ pos }, index) => {
                                if (index === 0) {
                                    decorations.push(
                                        Decoration.widget(pos + 1, () => {
                                            let className = "grip-table";
                                            const selected = isTableSelected(selection);
                                            if (selected) {
                                                className += " selected";
                                            }
                                            const grip = document.createElement("a");
                                            grip.className = className;
                                            grip.addEventListener("mousedown", event => {
                                                event.preventDefault();
                                                event.stopImmediatePropagation();
                                                this.editor.view.dispatch(selectTable(state.tr));
                                            });
                                            return grip;
                                        })
                                    );
                                }

                            });
                        }

                        return DecorationSet.create(doc, decorations);
                    },
                },
            }),
        ];
    },

});

export default DistTable;

