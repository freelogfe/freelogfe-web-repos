const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.base')
const merge = require('webpack-merge')
const path = require('path')

const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))

const commonLibPkgJson = require('@freelog/freelog-common-lib/package.json')
const staticDomain = argv.env === 'prod' ? '//static.freelog.com' :  '//static.testfreelog.com'
const tmpName = 'freelog-common'

module.exports = merge(baseConfig, {
  mode: 'production',

  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: 'public/js/[name].[chunkhash].js',
    crossOriginLoading: 'anonymous',
    path: path.resolve(__dirname, '../dist'),
    publicPath: `${staticDomain}/console/`,
  },

  module: {
    rules: [{
      test: /\.(less|css)$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'less-loader',
      ]
    }]
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
      template: path.resolve(__dirname, '../public/index.html'),
      excludeChunks: [ tmpName ],
      commonLibUrl: function getUrl() {
        var fileName = `${tmpName}.js`
        if(commonLibPkgJson && commonLibPkgJson.main) {
          fileName = commonLibPkgJson.main.split('/').pop()
        }else {
          throw new Error('wrong freelog-common-lib package.json')
        }
        return `${staticDomain}/${tmpName}/${fileName}`
      }(),
    }),
  ],
})

