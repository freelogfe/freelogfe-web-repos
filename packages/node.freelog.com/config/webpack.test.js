
const baseConfig = require('./webpack.prod')
const merge = require('webpack-merge')

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    publicPath: '//static.testfreelog.com/',
  },
})
