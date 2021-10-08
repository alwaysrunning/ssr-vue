const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const utils = require('./utils');
const vueConfig = require('./vue-loader.config');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  cache: true,
  devtool: isProd ? false : 'eval',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js',
    pathinfo: true
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
      public: path.resolve(__dirname, '../public'),
      '@': path.resolve(__dirname, '../src'),
      '@views': path.resolve(__dirname, '../src/views'),
      '@components': path.resolve(__dirname, '../src/components'),
      // '@util': path.resolve(__dirname, '../src/util'),
      // '@mixins': path.resolve(__dirname, '../src/mixins'),
      // '@config': path.resolve(__dirname, '../src/config')
    }
  },
  module: {
    noParse: [/es6-promise\.js$/, /es6-shim\.js$/], // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[ext]?[hash]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash].[ext]')
        }
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: isProd
    ? [
        new webpack.DefinePlugin({
          ...process.env,
          prd: true
        }),
        new webpack.optimize.UglifyJsPlugin({
          mangle: true,
          compress: {
            warnings: false,
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            screw_ie8: true
          },
          output: { comments: false }
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        // new BundleAnalyzerPlugin(),
        new ExtractTextPlugin({
          filename: utils.assetsPath('css/[name].[contenthash].css')
        })
        // new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en'),
      ]
    : [
        new FriendlyErrorsPlugin(),
        // new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en'),
        new webpack.DefinePlugin({
          ...process.env,
          prd: false
        })
      ]
};
