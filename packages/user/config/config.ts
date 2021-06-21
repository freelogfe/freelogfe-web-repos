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
  dynamicImport: {
    loading: '@/components/FGlobalLoading'
  },
  routes: [
    {
      exact: true,
      path: '/',
      redirect: '/login',
    },
    {
      exact: true,
      path: '/login',
      component: '@/pages/login/index',
      title: '登录',
    },
    {
      exact: true,
      path: '/logon',
      component: '@/pages/logon/index',
      title: '注册',
    },
    {
      path: '/logged',
      component: '@/pages/logged/index',
      routes: [
        {exact: true, path: '.', redirect: '/logged/wallet'},
        {
          exact: true,
          path: 'wallet',
          component: '@/pages/logged/wallet/index',
          title: '钱包',
        },
        {
          exact: true,
          path: 'contract',
          component: '@/pages/logged/contract/index',
          title: '合约',
        },
        {
          exact: true,
          path: 'setting',
          component: '@/pages/logged/setting/index',
          title: '设置',
        }
      ]
    },
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
