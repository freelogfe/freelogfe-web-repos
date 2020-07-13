import {IConfig} from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  routes: [
    // {
    // path: '/',
    // component: '../layouts/index',
    // routes: [
    {exact: true, path: '/', component: '../pages/index'},
    {exact: true, path: '/ui-example', component: '../pages/ui-example'},
    {
      path: '/resource',
      // exact: true,
      routes: [
        {exact: true, path: '.', component: '../pages/resource'},
        {
          path: 'creator',
          routes: [
            {exact: true, path: '.', component: '../pages/resource/creator'},
            {exact: true, path: 'success', component: '../pages/resource/creator/success'},
          ]
        },
        {exact: true, path: 'info', component: '../pages/resource/info'},
        {exact: true, path: 'auth', component: '../pages/resource/auth'},
        {
          path: 'version',
          routes: [
            {exact: true, path: '.', component: '../pages/resource/version'},
            {exact: true, path: 'success', component: '../pages/resource/version/success'},
            {exact: true, path: ':version', component: '../pages/resource/version/[version]'},
          ]
        },
      ]
    },
    // ]
    // }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: {webpackChunkName: true},
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
    'shadow-1-up': 'none',
    'shadow-1-down': 'none',
    'shadow-1-left': 'none',
    'shadow-1-right': 'none',
    'shadow-2': 'none',
    'shadow-color': 'transparent',
    'line-height-base': 10 / 7,

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

    'tabs-horizontal-margin': '0 100px 0 0',
    'tabs-horizontal-margin-rtl': '0 0 0 100px',
    'tabs-horizontal-padding-lg': '18px 0',
    'tabs-bar-margin': 0,

    'btn-shadow': 'none',
    'btn-primary-shadow': 'none',
    'btn-text-shadow': 'none',

    'pagination-font-weight-active': 400,
    'pagination-item-size': '32px',
    // 'agination-item-size-sm': '32px',
    'pagination-item-bg-active': '#2784FF',
    'select-item-selected-font-weight': 400,
    'select-item-selected-bg': 'inherit',
    'select-item-active-bg': '#2784FF',

    'alert-success-border-color': '#BDECD8',
    'alert-success-bg-color': '#E5F6EF',
    'alert-warning-border-color': '#F6DCA6',
    'alert-warning-bg-color': '#FBF5EA',
    'alert-error-border-color': '#FFD2D2',
    'alert-error-bg-color': '#FDEBEC',

  },
  devServer: {
    headers: {
      // 'authorization': 'Bearer eyJhbGciOiJSU0EtU0hBMjU2IiwidHlwIjoiSldUIn0=.eyJ1c2VySWQiOjUwMDI4LCJ1c2VybmFtZSI6IjEyMzQ1Njc2Nzg5IiwidXNlclR5cGUiOjEsIm1vYmlsZSI6IjE4NTY1Njg0MDkwIiwiZW1haWwiOiIiLCJpc3MiOiJodHRwczovL2lkZW50aXR5LmZyZWVsb2cuY29tIiwic3ViIjoiNTAwMjgiLCJhdWQiOiJmcmVlbG9nLXdlYnNpdGUiLCJleHAiOjE1OTU5MzEyOTksImlhdCI6MTU5NDYzNTI5OSwianRpIjoiNTdkODAxNGZiOGFhNGIwMWE4YjQ4NDVlZTFlOGNmMjMifQ==.0c0bd65d4a425826f2111f09fa3a6ccba3af2ffde8f7fc20fdca35f7054883804185147df0af69c3302e9365c61552b742a78be6adbcbe6d3a91af2b357f4a3815003ca147af2c406becb2deb7ffa79ce275e6598cff6f0bd2df897a9f439cce4f8da344e837c14b7503ee1085a69464e3ca824a972a14136de911119b461bec',
      'Cookie': 'authInfo=eyJhbGciOiJSU0EtU0hBMjU2IiwidHlwIjoiSldUIn0=.eyJ1c2VySWQiOjUwMDI4LCJ1c2VybmFtZSI6IjEyMzQ1Njc2Nzg5IiwidXNlclR5cGUiOjEsIm1vYmlsZSI6IjE4NTY1Njg0MDkwIiwiZW1haWwiOiIiLCJpc3MiOiJodHRwczovL2lkZW50aXR5LmZyZWVsb2cuY29tIiwic3ViIjoiNTAwMjgiLCJhdWQiOiJmcmVlbG9nLXdlYnNpdGUiLCJleHAiOjE1OTU5MzE0NzQsImlhdCI6MTU5NDYzNTQ3NCwianRpIjoiNTdkODAxNGZiOGFhNGIwMWE4YjQ4NDVlZTFlOGNmMjMifQ==.41815b1053e96eabaefced581209a55f891e62fb92975b9a14f49ebc830537fac8486a855affb2fbea9e282ffc4086b75d0ec61df9957df6f6b50d3b9f8d9d9b0fd5b1ba4c2f1fc470edfdee550fff035db7448afb22f94d829e22e895db58fd62346aefa0522c4eb054e209bf3b10a0fe61ed87814fa6dfe358c01749793e73; path=/; domain=testfreelog.com',
    },
    proxy: {
      '/v2': {
        target: 'http://qi.testfreelog.com',
        // secure: false,
        changeOrigin: true,
      }
    },
  },


};

export default config;
