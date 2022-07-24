<template>
    <bubble-menu
        class="paper-wysiwyg-bubble-menu-table"
        :editor="editor"
        v-if="editor"
        :tippy-options="{
            placement: 'top',
            arrow: arrow,
            getReferenceClientRect: getReferenceClientRect
        }"
        :shouldShow="shouldShow"
    >
        <span v-for="(item, action) in relevantMenu">
            <paper-wysiwyg-bubble-menu-button
                v-if="action !== 'divider'"
                :key="item.name"
                :icon="item.icon"
                :label="item.name"
                :disabled="cantDoAction(action)"
                @click="callAction(action)"
            />
            <span v-if="action === 'divider'" class="paper-wysiwyg-bubble-menu-divider"></span>
        </span>
    </bubble-menu>
</template>

<script>
import { BubbleMenu } from '@tiptap/vue-2'
import {CellSelection} from '@_ueberdosis/prosemirror-tables';
import {
    isNodeSelection,
    posToDOMRect,
} from '@tiptap/core'
import {
  isCellSelection
} from "prosemirror-utils";

import {roundArrow} from 'tippy.js';
import PaperWysiwygIcon from "../Icon";
import PaperWysiwygBubbleMenuButton from "./BubbleMenuButton";

export default {
    name: "paper-wysiwyg-bubble-menu-table",
    components: {
        BubbleMenu,
        PaperWysiwygIcon,
        PaperWysiwygBubbleMenuButton
    },
    props: {
        editor: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            arrow: roundArrow,
            menus: {
              table: {
                  toggleHeaderColumn: {
                      name: "Toggle header column",
                      icon: 'header_col'
                  },
                  toggleHeaderRow: {
                      name: "Toggle header row",
                      icon: 'header_row'
                  },
                  divider: true,
                  deleteTable: {
                      name: "Delete table",
                      icon: 'bin'
                  },
              },
              row: {
                  addRowBefore: {
                      name: "Add row before",
                      icon: "row_add_above"
                  },
                  addRowAfter: {
                      name: "Add row after",
                      icon: "row_add_below"
                  },
                  divider: true,
                  deleteRow: {
                      name: "Delete row",
                      icon: "bin"
                  },
              },
              col: {
                  addColumnBefore: {
                      name: "Add column before",
                      icon: "row_add_left"
                  },
                  addColumnAfter: {
                      name: "Add column after",
                      icon: "row_add_right"
                  },
                  divider: true,
                  deleteColumn: {
                      name: "Delete Column",
                      icon: "bin"
                  },
              },
            },
        }
    },
    computed: {
        // Return the relevant commands based on cell selection.
        relevantMenu() {
            const view = this.editor.view;
            const { state } = view;
            const { selection } = state
            const isColSelection = selection.isColSelection && selection.isColSelection();
            const isRowSelection = selection.isRowSelection && selection.isRowSelection();

            if (isColSelection && isRowSelection) {
                return this.menus.table
            }
            if (isRowSelection) {
                return this.menus.row
            }
            if (isColSelection) {
                return this.menus.col
            }

            return null;
        }
    },
    methods: {
        // Override the default positioning of the bubble menu.
        getReferenceClientRect() {
            const view = this.editor.view;
            const { state } = view;
            const { selection } = state

            if (isNodeSelection(view.state.selection)) {
                const node = view.nodeDOM(selection.from);
                if (node) {
                    return node.getBoundingClientRect()
                }
            }

            const isColSelection = selection.isColSelection && selection.isColSelection();
            const isRowSelection = selection.isRowSelection && selection.isRowSelection();

            const coords = posToDOMRect(view, selection.from, selection.to);
            if (isRowSelection) {
                coords.left = coords.left - 21;
                coords.width = 12;
                coords.right = coords.left + coords.width;
            }

            if (isColSelection) {
                coords.top -= 16;
            }

            return coords;
        },
        cantDoAction(action) {
            return !this.editor.can()[action]();
        },
        callAction(action) {
          this[action]();
        },
        shouldShow() {
            // Only show the bubble menu if the selection is a table cell.
            const view = this.editor.view;
            const { selection } = view.state;
            return isCellSelection(selection)
            //return selection instanceof CellSelection;
        },
        // Table commands
        addColumnBefore() {
            this.editor.chain().focus().addColumnBefore().run();
        },
        addColumnAfter() {
            this.editor.chain().focus().addColumnAfter().run();
        },
        deleteColumn() {
            this.editor.chain().focus().deleteColumn().run();
        },
        addRowBefore() {
            this.editor.chain().focus().addRowBefore().run();
        },
        addRowAfter() {
            this.editor.chain().focus().addRowAfter().run();
        },
        deleteRow() {
            this.editor.chain().focus().deleteRow().run();
        },
        deleteTable() {
            this.editor.chain().focus().deleteTable().run();
        },
        toggleHeaderColumn() {
            this.editor.chain().focus().toggleHeaderColumn().run();
        },
        toggleHeaderRow() {
            this.editor.chain().focus().toggleHeaderRow().run();
        },
        toggleHeaderCell() {
            this.editor.chain().focus().toggleHeaderCell().run();
        },
        // @todo find a way to incorporate these useful commands.
        fixTables() {},
        mergeCells() {},
        splitCell() {},
        mergeOrSplit() {},
    },
}
</script>
