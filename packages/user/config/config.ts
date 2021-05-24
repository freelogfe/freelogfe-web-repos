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
      exact: true,
      path: '/login',
      component: '@/pages/login/index',
    },
    {
      exact: true,
      path: '/logon',
      component: '@/pages/logon/index',
    },
    {
      path: '/logged',
      component: '@/pages/logged/index',
      routes: [
        {exact: true, path: '.', redirect: '/logged/wallet'},
        {
          exact: true,
          path: 'wallet',
          component: '@/pages/logged/wallet/index'
        },
        {
          exact: true,
          path: 'contract',
          component: '@/pages/logged/contract/index'
        },
        {
          exact: true,
          path: 'setting',
          component: '@/pages/logged/setting/index'
        }
      ]
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
