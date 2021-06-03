import {defineConfig} from 'umi';
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

const freelogDir = path.resolve(os.homedir(), '.freelog/');
const authInfoPath = path.resolve(freelogDir, 'authInfo.json');
if (!fs.existsSync(authInfoPath)) {
  throw new Error('请登录');
}

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
    '/v2': {
      target: 'http://qi.testfreelog.com',
      secure: false,
      changeOrigin: true,
      headers: {
        'Cookie': JSON.parse(fs.readFileSync(authInfoPath, 'utf-8')).cookies
      },
    },
    '/v1': {
      target: 'http://qi.testfreelog.com',
      secure: false,
      changeOrigin: true,
      headers: {
        'Cookie': JSON.parse(fs.readFileSync(authInfoPath, 'utf-8')).cookies
      },
    },
  },
  hash: true,
});
