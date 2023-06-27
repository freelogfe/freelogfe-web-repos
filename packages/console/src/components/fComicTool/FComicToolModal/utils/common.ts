/** 公共方法 */

import { FUtil } from '@freelog/tools-lib';

/**
 * 格式化日期
 * @param time 时间戳、字符串日期等等
 * @param format 自定义输出结果格式（YYYY:年，MM:月，DD:日，hh:时，mm:分，ss:秒）
 */
export const formatDate = (time: number, format = 'YYYY-MM-DD hh:mm:ss') => {
  if (!time) return '';

  const date = new Date(time);

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const result = format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('hh', hour)
    .replace('mm', minutes)
    .replace('ss', seconds);
  return result;
};

/** 换算大小 */
export const conversionSize = (size: number) => {
  if (size < 1024) return `${size}B`;

  if (size >= 1024 * 1024) {
    return `${Math.floor((size / 1024 / 1024) * 100) / 100}MB`;
  } else {
    return `${Math.floor((size / 1024) * 100) / 100}KB`;
  }
};

/** 获取文件后缀 */
export const getExt = (filename: string = '') => {
  const ext = filename.split('.').pop() || '';
  return ext.toLowerCase();
};

/** 获取MIME */
export const getMIME = (filename: any) => {
  const ext = getExt(filename);

  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'xml':
      return 'text/xml';
    case 'json':
      return 'application/json';
    default:
      return 'image/jpeg';
  }
};

/** 格式化卡片图片名称（超长时中间部分省略，并保证尾部显示不含后缀名至少四位字符） */
export const formatCardName = (name: string) => {
  const _div = document.createElement('div');
  _div.innerText = name;
  _div.style.fontSize = '12px';
  _div.style.position = 'absolute';
  document.body.appendChild(_div);
  if (_div.clientWidth < 200) {
    return name;
  } else {
    const [filename, suffix] = separateFileName(name);
    const lastWords = '...' + filename.slice(-4) + '.' + suffix;
    for (let i = 0; i < filename.length; i++) {
      const newName = filename.slice(0, i + 1) + lastWords;
      _div.innerText = newName;
      if (_div.clientWidth > 200) return filename.slice(0, i) + lastWords;
    }
  }
  document.body.removeChild(_div);
};

/** 分离文件名称与后缀 */
export const separateFileName = (name: string): string[] => {
  const splitArr = name.split('.');
  if (splitArr.length < 2) {
    return [name, ''];
  }

  const suffix = splitArr.pop() || '';
  const filename = splitArr.join('.');
  return [filename, suffix];
};
