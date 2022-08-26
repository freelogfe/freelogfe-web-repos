import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  antd: {},
  dva: {},
  // dynamicImport: {
  //   loading: '@/components/FGlobalLoading',
  // },
  routes: routes,
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  // ],
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
