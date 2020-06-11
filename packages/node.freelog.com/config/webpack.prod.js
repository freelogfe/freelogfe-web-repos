const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin')
const baseConfig = require('./webpack.base')
const merge = require('webpack-merge')
const path = require('path')

const APP_PAGEBUILD_AUTH = 'pagebuild-auth'
const appOutputFilenames = {}
module.exports = merge(baseConfig, {
  mode: 'production',

  output: {
    // filename: '[name].[contenthash].js',
    filename(pathData, assetInfo) {
      const { contentHashType, chunk: { name, contentHash } } = pathData
      const _contentHash = JSON.parse(JSON.stringify(contentHash))
      appOutputFilenames[name] = contentHash['javascript']
      return '[name].[contenthash].js'
    },
    chunkFilename: 'public/[name].[chunkhash].js',
    crossOriginLoading: 'anonymous',
  },

  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        exclude: [
          /src\/app\/styles/,
        ],
        use: [
          'style-loader',
          'vue-style-loader',
          'css-loader',
          'less-loader',
        ]
      },
      {
        test: /\.(less|css)$/,
        include: [
          /src\/app\/styles/,
        ],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ]
      }
    ]
  },

  optimization: {
    concatenateModules: true,
    nodeEnv: 'production',
    minimizer: [
      new TerserPlugin(),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          minChunks: 2
        }
      }
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      filename: 'index.html',
      template: path.resolve(__dirname, '../public/index.html'),
      chunks: [ 'pagebuild-app', 'vendors' ],
      templateParameters: fnTplParameters,
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      filename: 'index.dev.html',
      template: path.resolve(__dirname, '../public/index.dev.html'),
      chunks: ['pagebuild-app', 'vendors' ],
      templateParameters: fnTplParameters,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: 'public/[id].[contenthash].css',
    }),
    new StyleExtHtmlWebpackPlugin({
      minify: true,
      chunks: ['pagebuild-app']
    }),
    // new ResourceHintWebpackPlugin(),
    // new ScriptExtHtmlWebpackPlugin({
    //   inline: ['pagebuild-core'],
    //   prefetch: ['pagebuild-app', 'pagebuild-core']
    // })
  ],
})

function fnTplParameters(compilation, assets, assetTags, options) {
  const str = JSON.stringify(appOutputFilenames)
  return { appOutputFilenames: Buffer.from(str, 'utf-8').toString('base64') }
}

