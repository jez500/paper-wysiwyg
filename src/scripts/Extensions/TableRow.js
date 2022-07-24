import TableRow from '@tiptap/extension-table-row'
import { DecorationSet, Decoration } from "prosemirror-view";
import { Plugin } from "prosemirror-state";
import {
    isRowSelected,
    getCellsInColumn,
    selectRow
} from "prosemirror-utils";

// Extend table so a role can be added on create.
export default TableRow.extend({
    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    decorations: state => {
                        const { doc, selection } = state;
                        const decorations = [];
                        const cells = getCellsInColumn(0)(selection);

                        if (cells) {
                            cells.forEach(({ pos }, index) => {
                                decorations.push(
                                    Decoration.widget(pos + 1, () => {
                                        const rowSelected = isRowSelected(index)(selection);

                                        let className = "grip-row";
                                        if (rowSelected) {
                                            className += " selected";
                                        }
                                        if (index === 0) {
                                            className += " first";
                                        }
                                        if (index === cells.length - 1) {
                                            className += " last";
                                        }
                                        const grip = document.createElement("a");
                                        grip.className = className;
                                        grip.addEventListener("mousedown", event => {
                                            event.preventDefault();
                                            event.stopImmediatePropagation();
                                            // this.options.onSelectRow(index, state);
                                            this.editor.view.dispatch(selectRow(index)(state.tr));
                                        });
                                        return grip;
                                    })
                                );
                            });
                        }

                        return DecorationSet.create(doc, decorations);
                    },
                },
            }),
        ];
    }
})
