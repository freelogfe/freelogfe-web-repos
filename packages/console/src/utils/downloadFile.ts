import axios, {AxiosResponse} from 'axios';
import {apiHost} from "@/utils/globals";

// import request from '@/utils/request';

export async function downloadObjectToFile(objectIdOrName: string, fileName: string) {
  const res = await axios.get(`/v1/storages/objects/${objectIdOrName}/file`, {responseType: 'blob'});
  const {data, headers} = res;
  // const fileName = headers['content-disposition']?.replace(/\w+;filename=(.*)/, '$1') || fileName1;
  // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
  //const blob = new Blob([JSON.stringify(data)], ...)
  const blob = new Blob([data], {type: 'content-type'});
  let dom: HTMLAnchorElement = document.createElement('a');
  let url: string = window.URL.createObjectURL(blob);
  dom.href = url;
  dom.download = decodeURI(fileName);
  dom.style.display = 'none';
  document.body.appendChild(dom);
  dom.click();
  document.body.removeChild(dom);
  window.URL.revokeObjectURL(url)
  // })
  // .catch((err) => {
  // })
}
