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

module.exports = merge(baseConfig, {
  mode: 'production',

  output: {
    filename: '[name].[contenthash].js',
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
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      filename: 'index.html',
      template: path.resolve(__dirname, '../public/index.html'),
      chunks: ['pagebuild-app']
      // excludeChunks: [ tmpName ],
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
    //   // inline: ['pagebuild-core'],  
    //   prefetch: ['pagebuild-app', 'pagebuild-core']
    // })
  ],
})

