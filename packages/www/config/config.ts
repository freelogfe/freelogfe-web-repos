import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  antd: {},
  dva: {},
  dynamicImport: {
    loading: '@/components/FGlobalLoading',
  },
  routes: [
    {
      path: '/',
      component: '@/layouts/FBaseLayout/index',
      routes: [
        { exact: true, path: '.', redirect: '/home' },
        { path: 'home', component: '@/pages/home/index' },
        { path: 'activities', component: '@/pages/activities/index' },
        { path: 'activity/:id', component: '@/pages/activity/$id/index' },
        { path: 'invite', component: '@/pages/invite/index' },
      ]
    }
  ],
  fastRefresh: {},
  devServer: {},
  proxy: {
    '/v2': {
      target: 'http://qi.testfreelog.com',
      secure: false,
      changeOrigin: true,
      headers: {
      },
    },
    '/v1': {
      target: 'http://qi.testfreelog.com',
      secure: false,
      changeOrigin: true,
      headers: {
      },
    },
  },
  hash: true,
  locale: {

  }
});
