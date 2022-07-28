import uploader from "./Extensions/WysiwygUpload"
const uploadImage = uploader.uploadImage;

export default {
    data() {
        return {
            /**
             * Map of buttons/commands.
             */
            sets: {
                heading: [
                    {name: 'heading', icon: 'h1', args: {level: 1}, label: 'Big heading', method: 'toggleHeading', key: 'Ctrl+Alt+1'},
                    {name: 'heading', icon: 'h2', args: {level: 2}, label: 'Medium heading', method: 'toggleHeading', key: 'Ctrl+Alt+2'},
                    {name: 'heading', icon: 'h3', args: {level: 3}, label: 'Small heading', method: 'toggleHeading', key: 'Ctrl+Alt+3'},
                ],
                list: [
                    {name: 'unordered', icon: 'list', label: 'Bulleted list', method: 'toggleBulletList', key: 'Ctrl+Shift+8'},
                    {name: 'ordered', icon: 'ordered_list', label: 'Ordered list', method: 'toggleOrderedList', key: 'Ctrl+Shift+7'},
                    {name: 'task', icon: 'task_list', label: 'Task list', method: 'toggleTaskList', key: 'Ctrl+Shift+9'},
                ],
                other: [
                    {name: 'code', icon: 'code_block', label: 'Code block', method: 'toggleCodeBlock', key: '```'},
                    {name: 'blockquote', icon: 'quote', label: 'Quote', method: 'toggleBlockquote', key: '>'},
                    {name: 'divider', icon: 'divider', label: 'Divider', method: 'setHorizontalRule', key: '---'},
                    {name: 'link', icon: 'link', label: 'Link', callback: 'setLink', key: '---'},
                    {name: 'image', icon: 'image', label: 'Image', callback: 'addImage', key: '', visibility: this.canUpload},
                    {name: 'table', icon: 'table', label: 'Table', method: 'insertTable', args: {rows: 3, cols: 3, withHeaderRow: true}, key: ''},
                ],
                inline: [
                    {name: 'bold', label: 'Bold', icon: 'bold', method: 'toggleBold'},
                    {name: 'italic', label: 'Italic', icon: 'italic', method: 'toggleItalic'},
                    {name: 'strike', label: 'Strikethrough', icon: 'strike', method: 'toggleStrike'},
                    {name: 'code', label: 'Code', icon: 'code_block', method: 'toggleCode'},
                ]
            },
            uploadType: 'image',
        }
    },
    methods: {
        /**
         * Generic callback to toggle a style/mark/block.
         */
        toggleStyle(item) {
            const args = item.args || {}
            if (item.callback) return this[item.callback](args)
            this.editor.chain().focus()[item.method](args).run();
            this.closeMenu();
        },
        /**
         * Close current bubble/float menu.
         */
        closeMenu() {
            this.$emit('close')
        },
        /**
         * Either add a fresh link if no selection or turn selection into link.
         */
        setLink() {
            const selection = this.getSelectionRange(this.editor)
            if (selection.from === selection.to) {
                this.closeMenu()
                const url = prompt('Link Url')
                this.editor.commands.insertContentAt(selection.to, `<p><a href="${url}">${url}</a></p>`)
            } else {
                this.editor.chain().focus().extendMarkRange('link').setLink({ href: '' }).run()
                this.closeMenu()
            }
        },
        /**
         * Can upload an image.
         *
         * @returns {boolean}
         */
        canUpload() {
            return !! this.editor.options.editorProps.uploadUrl
        },
        /**
         * Generic upload wrapper.
         */
        upload() {
            if (this.uploadType === 'image') return this.uploadImage()
        },
        /**
         * Trigger upload dialog for image.
         */
        addImage() {
            this.uploadType = 'image'
            this.$refs.upload.click()
            this.closeMenu()
        },
        /**
         * Upload an image.
         */
        uploadImage() {
            const file = this.$refs.upload.files[0];
            uploadImage(file, this.editor.options.editorProps).then(src => {
                this.editor.chain().focus().setImage({ src: src }).run()
            }).catch((error) => {
                console.log(error)
                alert(`Unable to upload file`);
            });
        },
        /**
         * Get positions for current selection range.
         */
        getSelectionRange(editor) {
            const ranges = editor.view.state?.selection?.ranges;
            return ranges ? {from: ranges[0].$from.pos, to: ranges[0].$to.pos} : {from: 1, to: 1}
        },
        /**
         * Is a given menu link visible.
         *
         * @param item
         * @returns {boolean|*}
         */
        itemVisible(item) {
            if (typeof item.visibility === 'function') return item.visibility()
            return item.visibility !== false;
        }
    }
}
