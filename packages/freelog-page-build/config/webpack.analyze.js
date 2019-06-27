
const baseConfig = require('./webpack.prod')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const merge = require('webpack-merge')

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    filename: '[name].js',
  },
  plugins: [
    new BundleAnalyzerPlugin()
  ]
})
