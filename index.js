import Vue from 'vue'
// *.vue 文件內部模板會在建構時預編譯成 JavaScript
import Test from './src/components/test.vue'

// 使用此種方式在開發期間需要 VUE 完整版(就是包含編譯器)
new Vue({
  el: '#app',
  components: { Test }
})

// 不需要編譯器
/*
  new Vue({
    render (h) {
      return h('div', this.hi)
    }
  })
 */