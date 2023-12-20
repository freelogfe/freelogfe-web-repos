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
    '/api': {
      target: 'https://api.testfreelog.com',
      secure: false,
      changeOrigin: true,
      headers: {},
      pathRewrite: {
        '^/api': 'https://api.testfreelog.com',
      },
    },
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
          name: 'markdownEditor_test', // 唯一 id
          entry: '//creator-tools.testfreelog.com', // html entry
          // entry: '//192.168.2.28:8080', // html entry
          // credentials: true,
        },
        {
          name: 'markdownEditor', // 唯一 id
          entry: '//creator-tools.freelog.com', // html entry
          // entry: '//192.168.2.28:8080', // html entry
          // credentials: true,
        },

        {
          name: 'Authorization', // 唯一 id
          entry: '//dependencies-declarator.testfreelog.com/', // html entry
          // entry: '//192.168.2.28:8080', // html entry
          // credentials: true,
          // sandbox: {
          //   strictStyleIsolation: true,
          // },
        },
      ],
      // sandbox: {
      //   strictStyleIsolation: true,
      // },
    },
  },
});
