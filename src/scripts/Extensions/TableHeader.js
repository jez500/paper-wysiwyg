import TableHeader from '@tiptap/extension-table-header'
import { DecorationSet, Decoration } from "prosemirror-view";
import { Plugin } from "prosemirror-state";
import {
    getCellsInRow,
    isColumnSelected,
    selectColumn
} from "prosemirror-utils";

// Extend table so a role can be added on create.
export default TableHeader.extend({
    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    decorations: state => {
                        const { doc, selection } = state;
                        const decorations = [];
                        const cells = getCellsInRow(0)(selection);

                        if (cells) {
                            cells.forEach(({ pos }, index) => {
                                decorations.push(
                                    Decoration.widget(pos + 1, () => {
                                        const colSelected = isColumnSelected(index)(selection);
                                        let className = "grip-column";
                                        if (colSelected) {
                                            className += " selected";
                                        }
                                        if (index === 0) {
                                            className += " first";
                                        } else if (index === cells.length - 1) {
                                            className += " last";
                                        }
                                        const grip = document.createElement("a");
                                        grip.className = className;
                                        grip.addEventListener("mousedown", event => {
                                            event.preventDefault();
                                            event.stopImmediatePropagation();
                                            this.editor.view.dispatch(selectColumn(index)(state.tr));
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
    },
})
