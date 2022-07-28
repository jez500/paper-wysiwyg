import Vue from 'vue/dist/vue.js'
import axios from 'axios'

import PaperWysiwyg from "../dist/paper-wysiwyg.esm"
Vue.component('paper-wysiwyg', PaperWysiwyg)

new Vue({
  el: '#app',
  data: {
    content: '<h3>This is Paper Wysiwyg 🧾✏️</h3><p>Select text to change formatting, or click below then <strong>+</strong> to add something</p><p></p>'
  }
})
