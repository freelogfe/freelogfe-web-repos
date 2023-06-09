/** 导入漫画相关方法 */

import { deepAssign, getExt, getMIME, getUrlBySha1 } from '../utils/common';
import { ImgInComicTool } from '../utils/interface';

const { Uncompress } = require('./uncompress');

interface Entry {
  readData: (arg0: (result: BlobPart) => void) => void;
  name: string;
}

let fromImport = true;
let setLoaderShow: React.Dispatch<React.SetStateAction<boolean>>;
let setImgList: React.Dispatch<React.SetStateAction<ImgInComicTool[]>>;
let setComicConfig: React.Dispatch<React.SetStateAction<ImgInComicTool[]>>;
let validFileCount = 0;
let doneFileCount = 0;
let imgList: ImgInComicTool[] = [];
let config: any = null;

/** 解压漫画压缩包 */
export const uncompressComicArchive = (
  // 文件
  file: File,
  // 实例操作方法
  funcs: {
    setLoaderShow: React.Dispatch<React.SetStateAction<boolean>>;
    setImgList: React.Dispatch<React.SetStateAction<ImgInComicTool[]>>;
    setComicConfig: React.Dispatch<any>;
  },
  // 是否漫画压缩包导入
  fromArchiveImport = true,
) => {
  fromImport = fromArchiveImport;
  setLoaderShow = funcs.setLoaderShow;
  setImgList = funcs.setImgList;
  setComicConfig = funcs.setComicConfig;
  imgList = [];
  config = null;

  Uncompress.archiveOpenFile(file, (archive: { entries: Entry[] }) => {
    if (!archive) {
      setLoaderShow!(false);
      return;
    }

    readContents(archive.entries);
  });
};

/** 获取压缩包内容 */
const readContents = (entries: Entry[]) => {
//   const jsonFile = entries.find((item) => isJson(item));

//   if (jsonFile) {
//     // 存在 json 文件，可以直接以 json 文件配置还原漫画内容，无需解析其余文件
//     getContentByJson(jsonFile);
//   } else {
    // 不存在 json 文件，需要逐个解析压缩包内的文件，以还原漫画内容

    // 过滤无效文件
    entries = entries.filter((item) => {
      return isImage(item) || isXml(item) || isJson(item);
    });
    validFileCount = entries.length;

    if (validFileCount === 0) {
      setLoaderShow!(false);
      return;
    }

    // 按名称排序
    const list = entries.sort((a, b) => {
      const indexA = Number(a.name.split('.')[0]);
      const indexB = Number(b.name.split('.')[0]);
      return indexA - indexB;
    });

    list.forEach((item) => {
      const { name } = item;
      const ext = getExt(name);
      if (['jpg', 'jpeg', 'gif', 'png'].includes(ext)) {
        // 图片
        getImg(item);
      } else if (ext === 'xml' && name === 'ComicInfo.xml') {
        // xml 配置文件
        getXML(item);
      } else if (ext === 'json' && name === 'index.json') {
        // json
        getJson(item);
      }
    });
//   }
};

/** 以 json 还原漫画内容 */
const getContentByJson = (jsonEntry: Entry) => {
  jsonEntry.readData((res: BlobPart) => {
    const blob = new Blob([res], { type: getMIME(jsonEntry.name) });
    const reader = new FileReader();
    reader.readAsText(blob);
    reader.onload = (e: any) => {
      const json = JSON.parse(e.target.result);
      const list: ImgInComicTool[] = [];
      json.custom.list.forEach((item: any) => {
        const { name, sha1, size } = item;
        const url = getUrlBySha1(sha1);
        const img = { name, base64: url, size };
        if (fromImport) {
          const newItem = json.list.find((img: any) => img.url === url);
          img.name = newItem.name;
        }
        list.push(img);
      });
      setImgList!(list);
      setComicConfig!(json.config);
      setLoaderShow!(false);
      console.error(json);
    };
  });
};

/** 是否为图片文件 */
const isImage = (entry: Entry) => {
  const { name } = entry;
  const ext = getExt(name);
  return ['jpg', 'jpeg', 'gif', 'png'].includes(ext);
};

/** 是否为 xml 文件 */
const isXml = (entry: Entry) => {
  const { name } = entry;
  const ext = getExt(name);
  return ext === 'xml' && name === 'ComicInfo.xml';
};

/** 是否为 json 文件 */
const isJson = (entry: Entry) => {
  const { name } = entry;
  const ext = getExt(name);
  return ext === 'json' && name === 'index.json';
};

/** 获取图片 */
const getImg = (entry: Entry) => {
  const { name } = entry;
  entry.readData((res: BlobPart) => {
    const blob = new Blob([res], { type: getMIME(name) });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = (e) => {
      const img = { name, size: e.total, base64: String(e.target?.result) };
      imgList.push(img);
      updateInstance();
    };
  });
};

/** 解析 xml 文件 */
const getXML = (entry: Entry) => {
  if (config) {
    // 如已解析 json 则不解析 xml
    updateInstance();
    return;
  }

  entry.readData((res: BlobPart) => {
    const blob = new Blob([res], { type: getMIME(name) });
    const reader = new FileReader();
    reader.readAsText(blob);
    reader.onload = (e: any) => {
      const xmlConfig: any = {};
      const xmlHeader = e.target.result
        .match(/<\?xml.*?\?>/)[0]
        .replace(`<?xml `, '')
        .replace(`?>`, '');
      const attrsList = xmlHeader.split(' ');
      const attrs: any = {};
      attrsList.forEach((item: string) => {
        const [key, valueWithQuota] = item.split('=');
        const value = valueWithQuota.slice(1, valueWithQuota.length - 1);
        attrs[key] = value;
      });
      xmlConfig.xml = { attrs };

      const xmlDoc = new DOMParser().parseFromString(
        e.target.result,
        'text/xml',
      );
      const infos = xmlDoc.getElementsByTagName('ComicInfo');
      xmlConfig.children = getXmlNodes(infos);
      config = !config ? xmlConfig : deepAssign(xmlConfig, config);
      updateInstance();
    };
  });
};

/** 解析 xml 节点 */
const getXmlNodes = (nodes: HTMLCollectionOf<Element>) => {
  const result: any[] = [];
  [...nodes].forEach((node) => {
    const { nodeType, nodeName, attributes, children, firstChild } = node;
    if (nodeType !== 1) return;

    const attrs: any = {};
    [...attributes].forEach((attr) => {
      attrs[attr.nodeName] = attr.nodeValue;
    });
    const item = {
      key: nodeName,
      value: children.length ? null : firstChild?.nodeValue || null,
      attrs,
      children: getXmlNodes(children),
    };
    result.push(item);
  });
  return result;
};

/** 解析 json 文件 */
const getJson = (entry: Entry) => {
  entry.readData((res: BlobPart) => {
    const blob = new Blob([res], { type: getMIME(name) });
    const reader = new FileReader();
    reader.readAsText(blob);
    reader.onload = (e: any) => {
      const json = JSON.parse(e.target.result);
      config = json.config;
      updateInstance();
    };
  });
};

/** 更新实例数据 */
const updateInstance = () => {
  doneFileCount++;
  if (doneFileCount === validFileCount) {
    setImgList!(imgList);
    setComicConfig!(config);
    setLoaderShow!(false);
  }
};
