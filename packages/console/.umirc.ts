import {IConfig} from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  routes: [
    {
      path: '/',
      // component: '../layouts/index',
      routes: [
        {exact: true, path: '/', component: '../pages/index'},
        {exact: true, path: '/ui-example', component: '../pages/ui-example'},
      ]
    }
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
  'theme': {
    'primary-color': '#2784FF',
    'height-base': '38px',
    'height-lg': '50px',
    'height-sm': '32px',
    'border-radius-base': '4px',
    'border-color-base': '#E4E7EB',
    'input-icon-color': '#8E8E93',
    'text-color': '#222',
    'input-placeholder-color': '#C4C4C4',
    'input-hover-border-color': '#CBCBCB',
    'input-icon-hover-color': '#B4B4B4',
    'disabled-bg': '#F7F7F7',
    'disabled-color': '#C4C4C4',
  },
};

export default config;
