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
      exact: true,
      path: '/',
      redirect: '/logged',
    },
    {
      exact: true,
      path: '/login',
      component: '@/pages/login/index',
      title: '登录freelog - Freelog',
    },
    {
      exact: true,
      path: '/bind',
      component: '@/pages/bind/index',
      title: '绑定账户 - Freelog',
    },
    {
      exact: true,
      path: '/logon',
      component: '@/pages/logon/index',
      title: '注册freelog帐户 - Freelog',
    },
    {
      exact: true,
      path: '/retrieve',
      component: '@/pages/retrieve/index',
      title: '找回密码 - Freelog',
    },
    {
      exact: true,
      path: '/retrievePayPassword',
      component: '@/pages/retrievePayPassword/index',
      title: '找回支付密码 - Freelog',
    },
    {
      exact: true,
      path: '/freeze',
      component: '@/pages/freeze/index',
      title: '用户封禁 - Freelog',
    },
    {
      path: '/logged',
      wrappers: ['@/layouts/FBaseLayout/index'],
      component: '@/pages/logged/index',
      routes: [
        { exact: true, path: '.', redirect: '/logged/wallet' },
        {
          exact: true,
          path: 'wallet',
          component: '@/pages/logged/wallet/index',
          title: '钱包 - Freelog',
        },
        {
          exact: true,
          path: 'reward',
          component: '@/pages/logged/reward/index',
          title: '钱包 - Freelog',
        },
        {
          exact: true,
          path: 'contract',
          component: '@/pages/logged/contract/index',
          title: '合约 - Freelog',
        },
        {
          exact: true,
          path: 'setting',
          component: '@/pages/logged/setting/index',
          title: '设置 - Freelog',
        },
        { component: '@/pages/exception/404/index' },
      ],
    },
    { component: '@/pages/exception/404/index' },
  ],
  // dynamicImport: {
  //   loading: '@/components/Loading',
  // },
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
  favicon: '//static.freelog.com/static/favicon.ico',
});
