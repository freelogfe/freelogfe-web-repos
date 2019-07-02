
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const baseConfig = require('./webpack.prod')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const merge = require('webpack-merge')
const path = require('path')

module.exports = merge(baseConfig, {
  mode: 'development',

  output: {
    filename: '[name].js',
  },

  plugins: [
    new BundleAnalyzerPlugin()
  ]
})
