
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')
const srcDir = path.resolve(__dirname, '../src')

const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))
const staticDomain = argv.env === 'prod' ? '//static.freelog.com' :  '//static.testfreelog.com'

module.exports = {
  entry: {
    // 'pagebuild-core': path.resolve(__dirname, '../src/_core/index.ts'),
    'pagebuild-app': path.resolve(__dirname, '../src/app/index.js')
  },

  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: `${staticDomain}/pagebuild/`,
  },

  node: {
    'fs': 'empty'
  },

  // externals : {
  //   '@freelog/freelog-common-lib': 'f_common_lib'
  // },

  resolve: {
    extensions: [ ".ts", ".tsx", '.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': srcDir,
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
        },{
          loader: 'source-map-loader',
        }]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@kazupon/vue-i18n-loader'
      },
      {
        test: /\.(png|jpg|gif|eot|woff|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'public/assets/[name].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
  ],
}
