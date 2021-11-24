import { defineConfig } from 'umi';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

// const freelogDir = path.resolve(os.homedir(), '.freelog/');
// const authInfoPath = path.resolve(freelogDir, 'authInfo.json');
// if (!fs.existsSync(authInfoPath)) {
//   throw new Error('请登录');
// }

// const cookies: string = 'locale=zh-cn; authInfo=eyJhbGciOiJSU0EtU0hBMjU2IiwidHlwIjoiSldUIn0=.eyJ1c2VySWQiOjUwMDI4LCJ1c2VybmFtZSI6IjEyMzQ1Njc2Nzg5IiwidXNlclR5cGUiOjEsIm1vYmlsZSI6IjE4NTY1Njg0MDkwIiwiZW1haWwiOiJsaXVrYWlkaW5neXVlaGFvQDE2My5jb20iLCJpc3MiOiJodHRwczovL2lkZW50aXR5LmZyZWVsb2cuY29tIiwic3ViIjoiNTAwMjgiLCJhdWQiOiJmcmVlbG9nLXdlYnNpdGUiLCJleHAiOjE2MzU1NzkxMTIsImlhdCI6MTYzNDI4MzExMiwianRpIjoiYWI2YzEyMzAyZDE3NDFiZDg3Yjg5NWYxMDcyMWNkMDMifQ==.3bb32bece175daf9f2949efa0f73e9b01c93f2a179d0269b8fa5b4935ca6b3f59fb6d6396719840a91712e28b62141cee475316f15a156008f7d2b984cbb317895be18f8a80530b37888aaac7d8b7875d7f6d8b172868eaecd439c10956fe45ad0c63671e2473826f9035ccf55bd8e210016ae7f58a05f9f274e0c3c0741cb59; uid=50028';
const cookies: string = 'locale=zh-cn; authInfo=eyJhbGciOiJSU0EtU0hBMjU2IiwidHlwIjoiSldUIn0=.eyJ1c2VySWQiOjUwMDIyLCJ1c2VybmFtZSI6ImNodGVzIiwidXNlclR5cGUiOjEsIm1vYmlsZSI6IiIsImVtYWlsIjoibGl1LnFpYW5jZW5AZnJlZWxvZy5jb20iLCJpc3MiOiJodHRwczovL2lkZW50aXR5LmZyZWVsb2cuY29tIiwic3ViIjoiNTAwMjIiLCJhdWQiOiJmcmVlbG9nLXdlYnNpdGUiLCJleHAiOjE2MzkwMzYxMDgsImlhdCI6MTYzNzc0MDEwOCwianRpIjoiYmZiMDBmYTk5ZDliNDFjNmIwYmYwYWQxYzY0ZWJhMDEifQ==.a14c55e66d379623f06c355c4e251b2a1772de6e1842aac08a82a7a128ce9652542d59f18405db9e685c97ae1ed03514d175570b0a68ac521e63603aa6ce833c9242a48603fa102f7d8f06a1ff6210364891f0bbdba49ab650caf3f6b675b7cde8a4395dac5e90c727db3ef64885e1cb89199ad96155de4c48c946c01cdbd25c; uid=50022';
// const cookies: string = 'locale=en-us; authInfo=eyJhbGciOiJSU0EtU0hBMjU2IiwidHlwIjoiSldUIn0=.eyJ1c2VySWQiOjUwMDYxLCJ1c2VybmFtZSI6IkxpdUthaSIsInVzZXJUeXBlIjowLCJtb2JpbGUiOiIiLCJlbWFpbCI6ImxpdWthaWRpbmd5dWVoYW9AMTYzLmNvbSIsImlzcyI6Imh0dHBzOi8vaWRlbnRpdHkuZnJlZWxvZy5jb20iLCJzdWIiOiI1MDA2MSIsImF1ZCI6ImZyZWVsb2ctd2Vic2l0ZSIsImV4cCI6MTYzMjQ2NTcxMSwiaWF0IjoxNjMxMTY5NzExLCJqdGkiOiI4OGIxMzQ1MDcyODc0YjU2OGQ3YjVjMjIxOWQzY2UzOCJ9.068755f625eab201a1cb1474b2f7f0a17812be53277c6f751ce0779b98226d8952948f9a17e299076f966e17d574b303125dd868e421e81adf0216229c8f6a097e9e57c5bb9dd6b77aa567a094a8f716b9e874fdcc14f7880652bac20ed91bc54e8f3c186153c36227f9e5e04f666a4da18c83cd1d8ed5dc01375e43ae47154e; uid=50061';

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
      title: '登录freelog - Freelog',
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
  locale: {

  }
});
