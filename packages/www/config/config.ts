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
      path: '/guideFreelog',
      component: '@/pages/guideFreelog/index',
      title: '去正式环境 - Freelog',
      exact: true
    },
    {
      path: '/',
      component: '@/layouts/FBaseLayout/index',
      routes: [
        { exact: true, path: '.', redirect: '/home' },
        {
          path: 'home',
          component: '@/pages/home/index',
          title: 'Freelog - 创作盛放之地',
        },
        {
          path: 'activities',
          component: '@/pages/activities/index',
          title: '活动中心 - Freelog',
        },
        {
          path: 'activity/:id',
          component: '@/pages/activity/$id/index',
          title: '活动详情 - Freelog',
        },
        {
          path: '/invite',
          component: '@/pages/invite/index',
          title: '邀请 - Freelog',
        },

        { component: '@/pages/exception/404/index' },
      ],
    },

    { component: '@/pages/exception/404/index' },
  ],
  fastRefresh: {},
  devServer: {},
  proxy: {
    '/v2': {
      target: 'http://qi.testfreelog.com',
      secure: false,
      changeOrigin: true,
      headers: {},
    },
    '/v1': {
      target: 'http://qi.testfreelog.com',
      secure: false,
      changeOrigin: true,
      headers: {},
    },
  },
  hash: true,
  locale: {},
  favicon: '//static.freelog.com/static/favicon.ico',
});
