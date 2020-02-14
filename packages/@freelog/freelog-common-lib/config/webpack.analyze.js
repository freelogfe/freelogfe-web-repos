
const baseConfig = require('./webpack.base')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const merge = require('webpack-merge')

module.exports = merge(baseConfig, {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
})
