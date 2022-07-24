import Vue from 'vue/dist/vue.js'
import axios from 'axios'

import PaperWysiwyg from "../dist/paper-wysiwyg.esm"
Vue.component('paper-wysiwyg', PaperWysiwyg)

new Vue({
  el: '#app',
  data: {
    content: '<p>Hello world</p>'
  }
})
