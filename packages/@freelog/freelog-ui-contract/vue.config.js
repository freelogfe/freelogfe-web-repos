module.exports = {
  indexPath: './examples/index.html',
  devServer: {
    port: 9180,
    disableHostCheck: true,
    historyApiFallback: true,
    hot: false,
  },
  crossorigin: 'anonymous',
  configureWebpack: {
    entry: "./examples/main.json",
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
      },
    },

  }
}