import { IConfig } from 'umi-types';
import routes from './routes';

// const cookie: string = 'locale=en-us; authInfo=eyJhbGciOiJSU0EtU0hBMjU2IiwidHlwIjoiSldUIn0=.eyJ1c2VySWQiOjUwMDI4LCJ1c2VybmFtZSI6IjEyMzQ1Njc2Nzg5IiwidXNlclR5cGUiOjEsIm1vYmlsZSI6IjE4NTY1Njg0MDkwIiwiZW1haWwiOiIiLCJpc3MiOiJodHRwczovL2lkZW50aXR5LmZyZWVsb2cuY29tIiwic3ViIjoiNTAwMjgiLCJhdWQiOiJmcmVlbG9nLXdlYnNpdGUiLCJleHAiOjE2Mjg2NjgyNjYsImlhdCI6MTYyNzM3MjI2NiwianRpIjoiNTdkODAxNGZiOGFhNGIwMWE4YjQ4NDVlZTFlOGNmMjMifQ==.03dd6615a2312dcc07012dba520d942585b1ebd28dc90f6cfc380b73e62ce42a319f3ed212790f0e6fa2627b3b81564bad9bb44c199214a0ebf8373e03aeddd11fa257769ee710ee4f08170860f1c941c5f5cdf1e856dadda24d15ed51d5a4c8943d317e45359e9dac6278d660e2c2bd29c88607ec0147c44b8cecba72ea42f3; uid=50028';
// const cookie: string = 'locale=zh-cn; authInfo=eyJhbGciOiJSU0EtU0hBMjU2IiwidHlwIjoiSldUIn0=.eyJ1c2VySWQiOjUwMDI4LCJ1c2VybmFtZSI6IjEyMzQ1Njc2Nzg5IiwidXNlclR5cGUiOjEsIm1vYmlsZSI6IjE4NTY1Njg0MDkwIiwiZW1haWwiOiIiLCJpc3MiOiJodHRwczovL2lkZW50aXR5LmZyZWVsb2cuY29tIiwic3ViIjoiNTAwMjgiLCJhdWQiOiJmcmVlbG9nLXdlYnNpdGUiLCJleHAiOjE2MzQxMTU4MDUsImlhdCI6MTYzMjgxOTgwNSwianRpIjoiYWI2YzEyMzAyZDE3NDFiZDg3Yjg5NWYxMDcyMWNkMDMifQ==.c35172b39bc1c9e239bb10922060a02eec67ceb9e81eaefb612d3958cab0d2dad2bf9fa9af0b4c894e0936a5eab659a83c729f41648b39dcfd49fc0cf7b5a96840db5162041f025ffceb1d64868020478d22f3d83261a24bb0fc04ff693f615cd67971cceb430d15cbc04b98ee777b2f400d0fc6d01dcb0ef36b17af0a0aaaeb; uid=50028';
// const cookie: string = 'locale=zh-cn; authInfo=eyJhbGciOiJSU0EtU0hBMjU2IiwidHlwIjoiSldUIn0=.eyJ1c2VySWQiOjUwMDIyLCJ1c2VybmFtZSI6ImNodGVzIiwidXNlclR5cGUiOjEsIm1vYmlsZSI6IiIsImVtYWlsIjoibGl1LnFpYW5jZW5AZnJlZWxvZy5jb20iLCJpc3MiOiJodHRwczovL2lkZW50aXR5LmZyZWVsb2cuY29tIiwic3ViIjoiNTAwMjIiLCJhdWQiOiJmcmVlbG9nLXdlYnNpdGUiLCJleHAiOjE2MzkwMzYxMDgsImlhdCI6MTYzNzc0MDEwOCwianRpIjoiYmZiMDBmYTk5ZDliNDFjNmIwYmYwYWQxYzY0ZWJhMDEifQ==.a14c55e66d379623f06c355c4e251b2a1772de6e1842aac08a82a7a128ce9652542d59f18405db9e685c97ae1ed03514d175570b0a68ac521e63603aa6ce833c9242a48603fa102f7d8f06a1ff6210364891f0bbdba49ab650caf3f6b675b7cde8a4395dac5e90c727db3ef64885e1cb89199ad96155de4c48c946c01cdbd25c; uid=50022';
const cookie: string = 'locale=zh-cn; authInfo=eyJhbGciOiJSU0EtU0hBMjU2IiwidHlwIjoiSldUIn0=.eyJ1c2VySWQiOjUwMDIyLCJ1c2VybmFtZSI6ImNodGVzIiwidXNlclR5cGUiOjEsIm1vYmlsZSI6IiIsImVtYWlsIjoibGl1LnFpYW5jZW5AZnJlZWxvZy5jb20iLCJpc3MiOiJodHRwczovL2lkZW50aXR5LmZyZWVsb2cuY29tIiwic3ViIjoiNTAwMjIiLCJhdWQiOiJmcmVlbG9nLXdlYnNpdGUiLCJleHAiOjE2MzkwMzYxMDgsImlhdCI6MTYzNzc0MDEwOCwianRpIjoiYmZiMDBmYTk5ZDliNDFjNmIwYmYwYWQxYzY0ZWJhMDEifQ==.a14c55e66d379623f06c355c4e251b2a1772de6e1842aac08a82a7a128ce9652542d59f18405db9e685c97ae1ed03514d175570b0a68ac521e63603aa6ce833c9242a48603fa102f7d8f06a1ff6210364891f0bbdba49ab650caf3f6b675b7cde8a4395dac5e90c727db3ef64885e1cb89199ad96155de4c48c946c01cdbd25c; uid=50022';


// ref: https://umijs.org/config/
const config: IConfig | any = {
  treeShaking: true,
  routes: routes,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'console',
      dll: false,
      locale: {
        enable: true,
        default: 'en-US',
      },
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  theme: {
    'primary-color': '#2784FF',
    'height-lg': '50px',
    'height-base': '38px',
    'height-sm': '32px',
    'outline-blur-size': 0,
    'outline-width': 0,
    'outline-color': 'transparent',
    'outline-fade': 0,
    'disabled-bg': '#F7F7F7',
    'disabled-color': '#C4C4C4',
    'border-radius-base': '4px',
    'border-color-base': '#E4E7EB',
    'animation-duration-slow': '.2s',
    // 'box-shadow-base': '0 2px 5px 0 rgba(0,0,0,0.2)',
    'text-color': '#222',
    'body-background': '#FAFBFC',
    // 'shadow-1-up': 'none',
    // 'shadow-1-down': 'none',
    // 'shadow-1-left': 'none',
    // 'shadow-1-right': 'none',
    // 'shadow-2': 'none',
    // 'shadow-color': 'transparent',
    // 'line-height-base': 10 / 7,

    'layout-body-background': '#FAFBFC',
    'layout-header-background': '#FFF',
    'layout-header-height': '70px',
    'layout-header-padding': '0 40px',

    'input-icon-color': '#8E8E93',
    'input-placeholder-color': '#C4C4C4',
    'input-hover-border-color': '#CBCBCB',
    'input-icon-hover-color': '#B4B4B4',
    'input-bg': 'transparent',

    'menu-item-vertical-margin': 0,
    'menu-item-boundary-margin': 0,
    'menu-item-padding': '0 70px 0 20px',
    'menu-item-active-bg': '#2784FF',
    'menu-highlight-color': '#fff',

    // 'tabs-horizontal-margin': '0 100px 0 0',
    // 'tabs-horizontal-margin-rtl': '0 0 0 100px',
    // 'tabs-horizontal-padding-lg': '18px 0',
    // 'tabs-bar-margin': 0,

    'btn-shadow': 'none',
    'btn-primary-shadow': 'none',
    'btn-text-shadow': 'none',

    // 'pagination-font-weight-active': 400,
    // 'pagination-item-size': '32px',
    // 'agination-item-size-sm': '32px',
    // 'pagination-item-bg-active': '#2784FF',
    'select-item-selected-font-weight': 400,
    'select-item-selected-bg': 'inherit',
    'select-item-active-bg': '#2784FF',

    // 'alert-success-border-color': '#BDECD8',
    // 'alert-success-bg-color': '#E5F6EF',
    // 'alert-warning-border-color': '#F6DCA6',
    // 'alert-warning-bg-color': '#FBF5EA',
    // 'alert-error-border-color': '#FFD2D2',
    // 'alert-error-bg-color': '#FDEBEC',
    // 'table-border-color': 'red',
  },
  devServer: {
    headers: {},
    proxy: {
      '/v2': {
        target: 'http://qi.testfreelog.com',
        // target: 'http://api.testfreelog.com',
        secure: false,
        changeOrigin: true,
        headers: {
          // 'Cookie': JSON.parse(fs.readFileSync(authInfoPath, 'utf-8')).cookies
          'Cookie': cookie,
        },
      },
      '/v1': {
        target: 'http://qi.testfreelog.com',
        // target: 'http://api.testfreelog.com',
        secure: false,
        changeOrigin: true,
        headers: {
          // 'Cookie': JSON.parse(fs.readFileSync(authInfoPath, 'utf-8')).cookies
          'Cookie': cookie,
        },
      },
    },
  },
  hash: true,
  // locale: {
  //   default: 'zh-CN',
  //   antd: false,
  //   title: true,
  //   baseNavigator: true,
  //   baseSeparator: '-',
  // }
};

export default config;
