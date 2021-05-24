import {defineConfig} from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  antd: {},
  dva: {},
  dynamicImport: {},
  routes: [
    {exact: true, path: '/', redirect: '/login'},
    {
      path: '/login',
      component: '@/pages/login/index',
    },
    {
      path: '/logon',
      component: '@/pages/logon/index',
    },
    {
      path: '/logged',
      component: '@/pages/logged/index',
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
