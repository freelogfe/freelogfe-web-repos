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
        // 'Cookie': 'locale=zh-cn; authInfo=eyJhbGciOiJSU0EtU0hBMjU2IiwidHlwIjoiSldUIn0=.eyJ1c2VySWQiOjUwMDE3LCJ1c2VybmFtZSI6Inl1bGlhbmciLCJ1c2VyVHlwZSI6MSwibW9iaWxlIjoiMTg5MjM4MDM1OTMiLCJlbWFpbCI6IjQ4OTY4MTlAcXEuY29tIiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5mcmVlbG9nLmNvbSIsInN1YiI6IjUwMDE3IiwiYXVkIjoiZnJlZWxvZy13ZWJzaXRlIiwiZXhwIjoxNjIwOTg1MzU5LCJpYXQiOjE2MTk2ODkzNTksImp0aSI6ImU3YmI5Yzc4YjIwNjQ0YmZiNzg5MzY4YzNkZDE0NTc0In0=.ae88b456ec2927790f13590ad422d00b497fea1167d6dc2e7db096916edba47c7e017cf302f7e278984af66eb7e7efebdf2ba61863e80c16af2fa04eaeca266c20c8347773a057d39c4a59a501d9e4f3807556249413950d48ea7a431ca487f1d7a2ba717ad958fba119a45174f60160aeb9e671cb6396098e07da6870f0f382; uid=50017',
      },
    },
    '/v1': {
      target: 'http://qi.testfreelog.com',
      secure: false,
      changeOrigin: true,
      headers: {
        'Cookie': JSON.parse(fs.readFileSync(authInfoPath, 'utf-8')).cookies
        // 'Cookie': 'locale=zh-cn; authInfo=eyJhbGciOiJSU0EtU0hBMjU2IiwidHlwIjoiSldUIn0=.eyJ1c2VySWQiOjUwMDE3LCJ1c2VybmFtZSI6Inl1bGlhbmciLCJ1c2VyVHlwZSI6MSwibW9iaWxlIjoiMTg5MjM4MDM1OTMiLCJlbWFpbCI6IjQ4OTY4MTlAcXEuY29tIiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5mcmVlbG9nLmNvbSIsInN1YiI6IjUwMDE3IiwiYXVkIjoiZnJlZWxvZy13ZWJzaXRlIiwiZXhwIjoxNjIwOTg1MzU5LCJpYXQiOjE2MTk2ODkzNTksImp0aSI6ImU3YmI5Yzc4YjIwNjQ0YmZiNzg5MzY4YzNkZDE0NTc0In0=.ae88b456ec2927790f13590ad422d00b497fea1167d6dc2e7db096916edba47c7e017cf302f7e278984af66eb7e7efebdf2ba61863e80c16af2fa04eaeca266c20c8347773a057d39c4a59a501d9e4f3807556249413950d48ea7a431ca487f1d7a2ba717ad958fba119a45174f60160aeb9e671cb6396098e07da6870f0f382; uid=50017',
      },
    },
  },
});
