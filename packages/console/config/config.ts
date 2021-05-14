import {IConfig} from 'umi-types';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import routes from './routes';

const freelogDir = path.resolve(os.homedir(), '.freelog/');
const authInfoPath = path.resolve(freelogDir, 'authInfo.json');
if (!fs.existsSync(authInfoPath)) {
  throw new Error('请登录');
}

// ref: https://umijs.org/config/
const config: IConfig | any = {
  treeShaking: true,
  routes: routes,
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
    // 'shadow-1-up': 'none',
    // 'shadow-1-down': 'none',
    // 'shadow-1-left': 'none',
    // 'shadow-1-right': 'none',
    // 'shadow-2': 'none',
    // 'shadow-color': 'transparent',
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

    // 'tabs-horizontal-margin': '0 100px 0 0',
    // 'tabs-horizontal-margin-rtl': '0 0 0 100px',
    // 'tabs-horizontal-padding-lg': '18px 0',
    // 'tabs-bar-margin': 0,

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
    // 'table-border-color': 'red',
  },
  devServer: {
    headers: {},
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
      }
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
