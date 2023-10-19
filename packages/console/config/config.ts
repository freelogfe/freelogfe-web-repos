import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  // esbuild: {},
  nodeModulesTransform: {
    type: 'none',
  },
  antd: {},
  dva: {},
  // dynamicImport: {
  //   loading: '@/components/FGlobalLoading',
  // },
  routes: routes,
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
  qiankun: {
    master: {
      // 注册子应用信息
      apps: [
        {
          name: 'markdownEditor', // 唯一 id
          entry: '//localhost:7100', // html entry
          // entry: '//192.168.2.28:8080', // html entry
          // credentials: true,
        },
        // {
        //   name: 'app2', // 唯一 id
        //   entry: '//localhost:7002', // html entry
        // },
      ],
    },
  },
});
