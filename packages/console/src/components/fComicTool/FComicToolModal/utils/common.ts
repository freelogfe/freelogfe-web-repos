/** 公共方法 */

import fMessage from '@/components/fMessage';
import { FI18n } from '@freelog/tools-lib';

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

/** 错误提示 */
export const errorMessage = (content: string, i18n = true) => {
  const msg = i18n ? FI18n.i18nNext.t(content) : content;
  fMessage(FI18n.i18nNext.t(msg), 'error');
};

/** 读取文件 */
export const getFile = (
  origin: File | Blob,
  type: 'readAsDataURL' | 'readAsText' = 'readAsDataURL',
): Promise<ProgressEvent<FileReader>> => {
  return new Promise((resolve) => {
    let reader: FileReader | null = new FileReader();
    reader[type](origin);
    reader.onload = (e) => {
      const result = e;
      reader = null;
      resolve(result);
    };
  });
};

/** 读取文件内容 */
export const getFileResult = (
  origin: File | Blob,
  type: 'readAsDataURL' | 'readAsText' = 'readAsDataURL',
): Promise<string> => {
  return new Promise((resolve) => {
    let reader: FileReader | null = new FileReader();
    reader[type](origin);
    reader.onload = (e) => {
      const result = e!.target!.result as string;
      reader = null;
      resolve(result);
    };
  });
};

/** 加载图片获取高宽 */
export const getImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      resolve({ width: 0, height: 0 } as HTMLImageElement);
    };
  });
};

/** 根据 base64 获取大小 */
export const getSizeByBase64 = (base64: string = '') => {
  base64 = base64.split(',')[1];
  const equalIndex = base64.indexOf('=');
  const strLength =
    equalIndex > 0 ? base64.substring(0, equalIndex).length : base64.length;
  const fileLength = strLength - (strLength / 8) * 2;
  return Math.floor(fileLength);
};

/** json 转 xml */
export const json2Xml = (config: any) => {
  let result = '';
  let xmlHeader = `<?xml`;
  const keys = Object.keys(config.xml.attrs);
  if (keys.length === 0) {
    xmlHeader += ` ?>\n`;
  } else {
    keys.forEach((key) => {
      xmlHeader += ` ${key}="${config.xml.attrs[key]}"`;
    });
  }
  xmlHeader += `?>\n`;
  result += xmlHeader;

  const childrenXml = getChildrenXml(config.children, 0);
  result += childrenXml;

  return result;
};

/** 转换 xml 子元素 */
export const getChildrenXml = (childrenList: any[], level: number) => {
  let result = '';
  const prefix = new Array(level).fill('  ').join('');
  childrenList.forEach((child: any) => {
    const { key, value, attrs, children } = child;
    let childResult = '';
    let startTag = `${prefix}<${key}`;
    const endTag = `</${key}>\n`;
    for (const attrKey in attrs) {
      startTag += ` ${attrKey}="${attrs[attrKey]}"`;
    }
    if (value) {
      childResult += `${startTag}>${value}${endTag}`;
    } else if (children.length !== 0) {
      childResult += startTag + '>\n';
      const childrenXml = getChildrenXml(children, level + 1);
      childResult += childrenXml;
      childResult += `${prefix}${endTag}`;
    } else {
      childResult += `${startTag} />\n`;
    }
    result += childResult;
  });
  return result;
};

/** base64 转 file */
export const base64ToFile = (base64: string, name: string) => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], name, { type: mime });
};
