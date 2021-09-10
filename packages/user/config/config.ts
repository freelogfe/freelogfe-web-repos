import { defineConfig } from 'umi';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

// const freelogDir = path.resolve(os.homedir(), '.freelog/');
// const authInfoPath = path.resolve(freelogDir, 'authInfo.json');
// if (!fs.existsSync(authInfoPath)) {
//   throw new Error('请登录');
// }

const cookies = 'locale=zh-cn; authInfo=eyJhbGciOiJSU0EtU0hBMjU2IiwidHlwIjoiSldUIn0=.eyJ1c2VySWQiOjUwMDI4LCJ1c2VybmFtZSI6IjEyMzQ1Njc2Nzg5IiwidXNlclR5cGUiOjEsIm1vYmlsZSI6IjE4NTY1Njg0MDkwIiwiZW1haWwiOiIiLCJpc3MiOiJodHRwczovL2lkZW50aXR5LmZyZWVsb2cuY29tIiwic3ViIjoiNTAwMjgiLCJhdWQiOiJmcmVlbG9nLXdlYnNpdGUiLCJleHAiOjE2MzIxOTE3MDksImlhdCI6MTYzMDg5NTcwOSwianRpIjoiNTdkODAxNGZiOGFhNGIwMWE4YjQ4NDVlZTFlOGNmMjMifQ==.9f01cac8a8754781dd6e057b421325ccfb3a7591e8854e515d3df65040fe6872d1359034a903b60aa530c3828c34c6d1e4ed23f13b8beaf26672885e8398dfe90199f8773a8b721475eab8480fb5d0c0c7b37434040644cfee755c3ca99abd026f6905648e806cab5531791926f1d556f25a9c3925ab73dbac72b69379122d45; uid=50028';
// const cookies = 'locale=en-us; authInfo=eyJhbGciOiJSU0EtU0hBMjU2IiwidHlwIjoiSldUIn0=.eyJ1c2VySWQiOjUwMDYxLCJ1c2VybmFtZSI6IkxpdUthaSIsInVzZXJUeXBlIjowLCJtb2JpbGUiOiIiLCJlbWFpbCI6ImxpdWthaWRpbmd5dWVoYW9AMTYzLmNvbSIsImlzcyI6Imh0dHBzOi8vaWRlbnRpdHkuZnJlZWxvZy5jb20iLCJzdWIiOiI1MDA2MSIsImF1ZCI6ImZyZWVsb2ctd2Vic2l0ZSIsImV4cCI6MTYzMjQ2NTcxMSwiaWF0IjoxNjMxMTY5NzExLCJqdGkiOiI4OGIxMzQ1MDcyODc0YjU2OGQ3YjVjMjIxOWQzY2UzOCJ9.068755f625eab201a1cb1474b2f7f0a17812be53277c6f751ce0779b98226d8952948f9a17e299076f966e17d574b303125dd868e421e81adf0216229c8f6a097e9e57c5bb9dd6b77aa567a094a8f716b9e874fdcc14f7880652bac20ed91bc54e8f3c186153c36227f9e5e04f666a4da18c83cd1d8ed5dc01375e43ae47154e; uid=50061';

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
      redirect: '/login',
    },
    {
      exact: true,
      path: '/login',
      component: '@/pages/login/index',
      title: '登录freelog',
    },
    {
      exact: true,
      path: '/logon',
      component: '@/pages/logon/index',
      title: '注册freelog帐户',
    },
    {
      exact: true,
      path: '/retrieve',
      component: '@/pages/retrieve/index',
      title: '找回密码',
    },
    // {
    //   exact: true,
    //   path: '/result/resetPassword/success',
    //   title: '重置密码成功',
    //   component: '@/pages/result/resetPassword/success/index',
    // },
    // {
    //   path: '/result',
    //   routes: [
    //     {
    //       path: 'resetPassword',
    //       route: [
    //         {
    //           exact: true,
    //           path: 'success',
    //           title: '重置密码成功',
    //           component: '@/pages/result/resetPassword/success/index',
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      path: '/logged',
      component: '@/pages/logged/index',
      routes: [
        { exact: true, path: '.', redirect: '/logged/wallet' },
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
        },
      ],
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
        // 'Cookie': JSON.parse(fs.readFileSync(authInfoPath, 'utf-8')).cookies
        'Cookie': cookies,
      },
    },
    '/v1': {
      target: 'http://qi.testfreelog.com',
      secure: false,
      changeOrigin: true,
      headers: {
        // 'Cookie': JSON.parse(fs.readFileSync(authInfoPath, 'utf-8')).cookies
        'Cookie': cookies,
      },
    },
  },
  hash: true,
});
