import axios, {AxiosRequestConfig} from 'axios';
// import NProgress from 'nprogress';
// import "nprogress/nprogress.css";
import {completeUrlByDomain} from "./format";
import * as LinkTo from './linkTo';
// import {CommonReturn, RequestParamsType} from "../service-API/tools";
import FServiceAPI from "../service-API";
// import  from '../service-API';

const codeMessage: any = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// export let apiHost: string = '';
if (window.location.hostname.includes('.com')) {
  // apiHost = `${window.location.protocol}//qi.${(window.location.host.match(/(?<=\.).*/) || [''])[0]}`;
  // apiHost = window.location.origin.replace('console', 'qi');
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = completeUrlByDomain('qi');
}

/**
 * 异常处理程序
 */
// const errorHandler = (error: { response: Response }): Response => {
//   const {response} = error;
//   if (response && response.status) {
//     const errorText = codeMessage[response.status] || response.statusText;
//     const {status, url} = response;
//
//     // notification.error({
//     //   message: `请求错误 ${status}: ${url}`,
//     //   description: errorText,
//     // });
//   } else if (!response) {
//     // notification.error({
//     //   description: '您的网络发生异常，无法连接服务器',
//     //   message: '网络异常',
//     // });
//   }
//   return response;
// };
//
// // Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // NProgress.start();
    return config;
  },
  (error) => {
    // Do something with request error
    // NProgress.done();
    return Promise.reject(error);
  }
);

/**
 * 配置request请求时的默认参数
 */
axios.interceptors.response.use(
  (response) => {
    // Do something with response data
    // console.log(response, 'response!!!!!!');
    // NProgress.done();
    if (response.status !== 200) {

      const error = {
        description: codeMessage[response.status],
        message: response.status,
      };

      // notification.error(error);
      throw new Error(JSON.stringify(error));
    }
    const {data, headers} = response;
    if (headers['content-disposition']?.includes('attachment;')) {
      // downloadFile(response);
      return;
    }

    // console.log(data, 'data2390jasdflkf');


    // if ((data.errcode === undefined
    //   ? (data.errCode !== 0 && data.errCode !== 2)
    //   : (data.errcode !== 0 && data.errcode !== 2))
    //   || data.ret !== 0) {
    //
    //   // notification.error({
    //   //   message: data.msg,
    //   // });
    //   throw new Error(JSON.stringify(data));
    // }
    return data;
  },
  (error) => {
    // Do something with response error
    // NProgress.done();
    return Promise.reject(error);
  });

export default axios;


export async function request(config: AxiosRequestConfig, {
// export async function request(config: any, {
  noRedirect = false,
  noErrorAlert = false,
// }: RequestParamsType = {}): Promise<CommonReturn & { data: any } | void> {
}: any = {}): Promise<any> {
  const result: any = await axios.request(config);
  // console.log(result, 'response');
  // const {data} = response;
  // console.log(result, 'result90iowjksdfjlsdkj')
  if (result.ret === 0 && result.errCode === 30 && !noRedirect) {
    await FServiceAPI.User.logout();
    window.location.replace(`${completeUrlByDomain('user')}${LinkTo.login({goTo: window.location.href})}`);
  } else if (result.ret === 4 && result.errCode === 10 && !noRedirect) {
    window.location.replace(`${completeUrlByDomain('user')}${LinkTo.userFreeze({goTo: window.location.href})}`);
  } else if ((result.errcode !== 0 || result.errCode !== 0) && !noErrorAlert) {
    // window.alert(result.msg);
    // return;

  }
  return result;
}
