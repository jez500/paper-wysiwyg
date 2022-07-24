import Placeholder from '@tiptap/extension-placeholder'
import { BlockMenuTriggerPlugin } from "./BlocckMenuTrigger";

export default Placeholder.extend({
    defaultOptions: {
        ...Placeholder.options,
        placeholder: 'Write something great...',
    },

    addProseMirrorPlugins() {
        return BlockMenuTriggerPlugin(this.editor, this.options)
    },
});
