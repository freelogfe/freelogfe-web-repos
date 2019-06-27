
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')
const srcDir = path.resolve(__dirname, '../src')


module.exports = {
  entry: {
    'pagebuild-core': path.resolve(__dirname, '../src/core/index.js'),
    'pagebuild-app': path.resolve(__dirname, '../src/views/index.js')
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, '../dist')
  },

  node: {
    'fs': 'empty'
  },

  externals : {
    '@freelog/freelog-common-lib': 'f_common_lib'
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': srcDir,
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(png|jpg|gif|eot|woff|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/[name].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'plubic/css/pagebuild.css'
    }),
    new VueLoaderPlugin(),
  ],
}
