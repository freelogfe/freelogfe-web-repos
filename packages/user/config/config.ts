import {defineConfig} from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  antd: {},
  dva: {},
  dynamicImport: {},
  routes: [
    {
      path: '/',
      component: '@/pages/index',
    },
  ],
  fastRefresh: {},
  devServer: {},
  proxy: {
    '/api': {
      'target': 'http://jsonplaceholder.typicode.com/',
      'changeOrigin': true,
      'pathRewrite': {'^/api': ''},
    },
  },
});
