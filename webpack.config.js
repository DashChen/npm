const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const StyleLintPlugin = require('stylelint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const rimraf = require('rimraf')
const merge = require('webpack-merge')

let webpackConfig = {
  entry: {
    app: './src/build.js'
  },
  module: {
    rules: [
      // 針對開發中的 js、vue 進行校驗
      // 請確保是作為一個 pre-loader 運用
      {
        enforce: "pre",
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      // sass-loader 預設使用沒有縮進的 scss
      // 普通的 .scss 文件和 *.vue 文件中的 `<style lang="scss">` 塊都會應用
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: "sass-loader",
            options: {
              // 處理縮進
              indentedSyntax: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // 確保 js 轉譯應用到 node_modules 的 vue SFC，使用一個排除函數加入白名單
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        )
      },
      {
        test: /\.(vue)$/,
        loader: 'vue-loader',
        options: {
          // mode === 'production' 時， 要關閉 熱重載
          hotReload: process.env.NODE_ENV === 'production' ? false : true
        }
      },
      {
        test: /\.css$/,
        use: [
          // 只在生產環境下提取出 css ， 是為了方便開發模式下的熱加載
          // 配合 html-webpack-plugin 會將 mini 產生的 css 包含在 head 的 <link> 內
          process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    // 提取後輸出檔案名稱為 style.css
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    // 以下副檔名都會進行style校驗
    // new StyleLintPlugin({
    //   files: ['**/*.{vue,htm,html,css,sss,less,scss,sass}']
    // })
    // 以下會產生一個 index.html 在輸出目錄中，並將相關打包後的 js css 放入相對位置
    // https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebpackPlugin({
      'title': 'Vue.js webpack .vue',
      'meta': {
        'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
        // response headers
        'set-cookie': { 'http-equiv': 'set-cookie', content: 'name=value; expires=date; path=url'}
      }
    })
  ],
  // VUE 術語
  // 完整版: 包含 編譯器 與 運行時 的版本
  // 編譯器: 將模板template 字符串 編譯成 javascript 渲染函數的 code
  // 運行時: 創建 vue instance, render handle visual DOM，除編譯器以外的一切
  // 使用 VUE 完整版(有編譯器)，給一個別名
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    // 引用模塊時，自動解析副檔名，預設是 ['.js', '.json']
    extensions: ['.vue', '.js', '.json']
  }
}

// 先將 dist 內的所有檔案刪除，rimraf 就是 UNIX command rm -rf
rimraf(path.join(__dirname, 'dist'), () => console.log('success remove'))

switch (process.env.NODE_ENV) {
  case 'dev':
    module.exports = webpackConfig
    break
  case 'prod':
    // 產出 source-map 檔，打包後的檔案通常都已進行壓縮或者醜化，在 debug 時相對困難，此功能就可以在瀏覽器上查找到對應原始檔
    webpackConfig.devtool = "#source-map"
    // 在打包過程中，排除指定依賴，如VUE 就是不要打包VUE
    webpackConfig.externals = {
      vue: 'vue'
    }
    module.exports = [
      merge(webpackConfig, {
        // 將 vue 檔，供 node 使用
        entry: './src/components/test.vue',
        output: {
          // 可以直接指定 輸出檔名
          // 或 使用 替換字符串
          // [hash] 模塊標識符的hash，預設編碼方式 hex 長度 20 散列算法 md5，建議開發模式下使用
          // [chunkhash] chunk 內容的 hash
          // [name] 模塊名稱，生產版可以使用
          // [id] 模塊標識符
          // [query] 模塊的 query，如文件名 ? 之後的字符串，沒有就可能會產生 .js
          filename: "[hash].js",
          // 默認是 var， 會將 entry 導出值 賦予到 library 提供的 變數名
          // assign : 會產生一個隱含的全局變數，也可能會分配到全局中已存在的變數(謹慎使用)
          // this : this[library 提供的 變數名] = entry 導出值
          // window : window[library 提供的 變數名] = entry 導出值
          // global : global[library 提供的 變數名] = entry 導出值
          // commonjs : exports[library 提供的 變數名] = entry 導出值， 之後用 require(library 提供的 變數名)
          // commonjs2 : module.exports = entry 導出值， library 提供的 變數名 忽略，
          // amd : 就是 AMD(Asynchronous Module Definition) 模塊，不深入
          // umd : CommonJS, AMD 或 global 下的變數
          libraryTarget: "umd",
          // 取決於 libraryTarget 的值
          // import 的名稱
          library: 'test',
          // 對 umd 構建過程中 AMD 模塊進行命名
          umdNamedDefine: true
        }
      }),
      merge(webpackConfig, {
        entry: path.resolve('./src/build.js'),
        output: {
          filename: "[hash].min.js",
          // 使用 window 變數
          libraryTarget: "window",
          // 註冊在 window 全局變數，可以在傳統網頁上使用
          // window["AaaTest"] = entry 導出值
          library: 'AaaTest'
        }
      })
    ]
    break
}