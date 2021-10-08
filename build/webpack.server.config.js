const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const utils = require('./utils')
const options = process.env.NODE_ENV === 'production' ? { sourceMap: true, extract: true } : {}

module.exports = merge(base, {
  target: 'node', // target 由于 webpack 默认打包是在浏览器端运行，这里需要修改一下默认值
  devtool: '#source-map',
  entry: './src/entry-server.js',
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2' // 服务端代码是运行在 node 中的，node 的引用方式还是 commonjs 所以这里也需要改一下默认
  },
  resolve: {
    alias: {
      'create-api': './create-api-server.js'
    }
  },
  module: {
    rules: utils.styleLoaders(options)
  },
  // https://webpack.js.org/configuration/externals/#externals
  // https://github.com/liady/webpack-node-externals
   // externals 服务器端不需要像浏览器端那样，把依赖的包全打进 bundle 里，服务器只需要在运行时获取就可以，
   // 所以这里需要把 node_modules 中的模块从打包 bundle 中排除出去。而服务端又不能处理 CSS 文件，所以 CSS 文件还是要打包进 bundle 中的
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /\.css$/
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"server"'
    }),
    new VueSSRServerPlugin()
  ]
})
