<!--
可以使用 src 引入外部檔案
以 "." 開頭，則以相對模塊請求，依據文件系統上的目錄結構解析
以 "~" 開頭，則將其后的作為模塊請求，可以引入 node_modules 中的資源
以 "@" 開頭，則其后內容也作為模塊請求， vue-cli 默認指向 "/src"
EX:
<template src="./template.html">
-->
<template>
  <div class="message">
    <span>{{ message }}</span>
  </div>
</template>

<!--
可以使用 src 引入外部檔案
以 "." 開頭，則以相對模塊請求，依據文件系統上的目錄結構解析
以 "~" 開頭，則將其后的作為模塊請求，可以引入 node_modules 中的資源
以 "@" 開頭，則其后內容也作為模塊請求， vue-cli 默認指向 "/src"
EX:
<script src="./script.js">
-->
<script>
  // export default 命令，為模塊指定默認輸出
  // 其他模塊加載此模塊時，import 命令可以為該匿名函數指定任意名字
  export default {
    name: 'test',
    data() {
      return {
        message: 'Hello, .vue file'
      }
    }
  }
</script>

<!--
可以 import 'style.scss'
或
<style lang="scss">
...
</style>
scoped: 代表指作用於this component內的Element
可以同時使用 全局與本地
希望本地style 作用更深，請使用 >>> 操作浮
可以使用 src 引入外部檔案
以 "." 開頭，則以相對模塊請求，依據文件系統上的目錄結構解析
以 "~" 開頭，則將其后的作為模塊請求，可以引入 node_modules 中的資源
以 "@" 開頭，則其后內容也作為模塊請求， vue-cli 默認指向 "/src"
EX:
<style src="./style.css">
或
node_modules package 資源
EX:
<style src="todomvc-app-css/index.css">
-->
<style>
  span {
    color: red;
  }
</style>
<style scoped>
  .message {
    background-color: #00C48D;
  }
</style>


