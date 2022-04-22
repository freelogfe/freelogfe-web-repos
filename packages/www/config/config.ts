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
        { path: 'dashboard', component: '@/pages/dashboard/index' },
        { path: 'activity', component: '@/pages/activity/index' },
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
        // 'Cookie': JSON.parse(fs.readFileSync(authInfoPath, 'utf-8')).cookies
        // 'Cookie': cookie,
      },
    },
    '/v1': {
      target: 'http://qi.testfreelog.com',
      secure: false,
      changeOrigin: true,
      headers: {
        // 'Cookie': JSON.parse(fs.readFileSync(authInfoPath, 'utf-8')).cookies
        // 'Cookie': cookie,
      },
    },
  },
  hash: true,
  locale: {

  }
});
