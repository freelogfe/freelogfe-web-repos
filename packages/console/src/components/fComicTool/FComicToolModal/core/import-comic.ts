/** 导入漫画相关方法 */

import { MAX_IMG_LENGTH } from '../utils/assets';
import {
  errorMessage,
  getExt,
  getFile,
  getFileResult,
  getImage,
  getMIME,
} from '../utils/common';
import { ImgInComicTool } from '../utils/interface';

interface Entry {
  readData: (arg0: (result: BlobPart) => void) => void;
  name: string;
}

let Uncompress: any = null;
let importType = 1;
let setLoaderShow: React.Dispatch<React.SetStateAction<boolean>>;
let setImgList: React.Dispatch<React.SetStateAction<ImgInComicTool[]>>;
let setComicConfig: React.Dispatch<React.SetStateAction<ImgInComicTool[]>>;
let setEdited: React.Dispatch<React.SetStateAction<boolean | null>> | null;
let json: any = null;
let imgList: ImgInComicTool[] = [];

if (!Uncompress && (window as any).uncompress) {
  // 初始化解压方法
  Uncompress = (window as any).uncompress;
  Uncompress.loadArchiveFormats(['rar', 'zip', 'tar']);
  delete (window as any).uncompress;
}

/** 解压漫画压缩包 */
export const uncompressComicArchive = (
  // 文件
  file: File,
  // 实例操作方法
  funcs: {
    setLoaderShow: React.Dispatch<React.SetStateAction<boolean>>;
    setImgList: React.Dispatch<React.SetStateAction<ImgInComicTool[]>>;
    setComicConfig: React.Dispatch<any>;
    setEdited?: React.Dispatch<React.SetStateAction<boolean | null>>;
  },
  // 导入方式 1-草稿 2-本地 3-存储空间 4-历史版本
  importFrom: 1 | 2 | 3 | 4,
) => {
  importType = importFrom;
  setLoaderShow = funcs.setLoaderShow;
  setImgList = funcs.setImgList;
  setComicConfig = funcs.setComicConfig;
  if (funcs.setEdited) setEdited = funcs.setEdited;
  json = null;
  imgList = [];

  Uncompress.archiveOpenFile(file, (archive: { entries: Entry[] }) => {
    if (!archive) {
      setLoaderShow(false);
      if (importType === 1 && setEdited) setEdited(false);
      return;
    }

    readContents(archive.entries);
  });
};

/** 获取压缩包内容 */
const readContents = async (entries: Entry[]) => {
  const jsonFile = entries.find((item) => isJson(item));

  if (jsonFile) {
    // 存在 json 文件，可解析 json
    json = await getJson(jsonFile);
    const { list } = json.custom;
    if (list.length) setImgList([...list]);
    setComicConfig(json.config);
  } else {
    // 不存在 json 文件，看看是否存在 xml 文件，如存在则解析 xml
    const xmlFile = entries.find((item) => isXml(item));
    if (xmlFile) {
      const xmlConfig = await getXML(xmlFile);
      setComicConfig(xmlConfig);
    }
  }

  // 筛选出所有图片文件
  entries = entries.filter((item) => isImage(item));
  const imageFileCount = entries.length;

  if (imageFileCount === 0) {
    // 没有图片文件，结束解析
    setLoaderShow(false);
    if (importType === 1 && setEdited) setEdited(false);
    return;
  }

  getImages(entries);
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

/** 获取图片文件 */
const getImages = async (entries: Entry[]) => {
  // 按名称排序
  const list = entries.sort((a, b) => {
    const indexA = Number(a.name.split('.')[0]);
    const indexB = Number(b.name.split('.')[0]);
    return indexA - indexB;
  });

  const length = list.length > MAX_IMG_LENGTH ? MAX_IMG_LENGTH : list.length;
  for (let i = 0; i < length; i++) {
    const item = list[i];
    const { name } = item;
    const blob = await getImageBlob(item);
    const res = await getFile(blob);
    const size = res.total;
    const base64 = String(res.target?.result);
    const image = await getImage(base64);
    const { width, height } = image;
    if (!json) {
      // 没有 json 配置文件，此包为外部压缩包，直接获取图片
      imgList[i] = { name, size, base64, width, height };
    } else {
      // freelog 平台输出的漫画压缩包，需按 json 配置进行整理
      const nameRuleReg = /^\d{3}(_\d{2})?\.[a-zA-Z]+$/;
      let nameInRule = nameRuleReg.test(name);
      if (nameInRule) {
        const [parentNumber, childNumber] = name.split('.')[0].split('_');
        if (
          !parentNumber ||
          Number(parentNumber) < 1 ||
          (childNumber && Number(childNumber) < 1)
        ) {
          nameInRule = false;
        }
      }
      if (!nameInRule) {
        // 图片名称不符合命名规则，加入队列最后
        const newImage = {
          name,
          size,
          base64,
          width,
          height,
        };
        imgList.push(newImage);
      } else {
        // 图片名称符合命名规则，以名称获取对应项，更新对应项数据
        const [parentNumber, childNumber] = name.split('.')[0].split('_');
        const parentIndex = Number(parentNumber) - 1;
        const childIndex = childNumber ? Number(childNumber) - 1 : null;
        if (childIndex === null) {
          // 非切图
          const parentName =
            importType === 1 ? json.custom.list[parentIndex].name : name;
          imgList[parentIndex] = {
            name: parentName,
            size,
            base64,
            width,
            height,
          };
          if ([1, 4].includes(importType)) {
            // 草稿、历史版本导入时，沿用记录的 sha1 值
            const sha1 = json.custom.list[parentIndex].sha1;
            imgList[parentIndex].sha1 = sha1;
          }
        } else {
          // 切图
          if (!imgList[parentIndex]) {
            const parentName =
              importType === 1
                ? json.custom.list[parentIndex]?.name
                : `${parentNumber}.${getExt(name)}`;
            imgList[parentIndex] = {
              name: parentName,
              base64: '',
              size: 0,
              children: [],
              width: 0,
              height: 0,
            };
          }
          if (childIndex === 0) imgList[parentIndex].base64 = base64;
          const childName =
            importType === 1
              ? json.custom.list[parentIndex].children[childIndex]?.name
              : name;
          imgList[parentIndex].children![childIndex] = {
            name: childName,
            size,
            base64,
            width,
            height,
          };
          if ([1, 4].includes(importType)) {
            // 草稿、历史版本导入时，沿用记录的 sha1 值
            const sha1 =
              json.custom.list[parentIndex].children[childIndex].sha1;
            imgList[parentIndex].children![childIndex].sha1 = sha1;
          }
        }
      }
    }
    if (i === length - 1) {
      // 处理完所有图片，进行整理
      imgList = imgList.filter((item) => item);
      imgList.forEach((item) => {
        if (!item.children) return;

        item.children = item.children.filter((child) => child);
        item.base64 = item.children[0].base64;
      });
      setImgList([...imgList]);
      if (list.length > MAX_IMG_LENGTH) {
        errorMessage('cbformatter_add_error_qtylimitation');
      }
      setLoaderShow(false);
      if (importType === 1) {
        setTimeout(() => {
          setEdited && setEdited(false);
        }, 0);
      }
    }
  }
};

/** 读取图片 blob */
const getImageBlob = async (entry: Entry): Promise<Blob> => {
  return new Promise((resolve) => {
    entry.readData(async (blobParts: BlobPart) => {
      const blob = new Blob([blobParts], { type: getMIME(entry.name) });
      resolve(blob);
    });
  });
};

/** 解析 json 文件 */
const getJson = (entry: Entry): Promise<any> => {
  return new Promise((resolve) => {
    entry.readData(async (blobParts: BlobPart) => {
      const blob = new Blob([blobParts], { type: getMIME(entry.name) });
      const res = await getFileResult(blob, 'readAsText');
      const result = JSON.parse(res);
      resolve(result);
    });
  });
};

/** 解析 xml 文件 */
const getXML = (entry: Entry): Promise<any> => {
  return new Promise((resolve) => {
    entry.readData(async (blobParts: BlobPart) => {
      const blob = new Blob([blobParts], { type: getMIME(entry.name) });
      const result = await getFileResult(blob, 'readAsText');
      const xmlConfig: any = {};
      const xmlHeader = result
        .match(/<\?xml.*?\?>/)![0]
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

      const xmlDoc = new DOMParser().parseFromString(result, 'text/xml');
      const infos = xmlDoc.getElementsByTagName('ComicInfo');
      xmlConfig.children = getXmlNodes(infos);
      resolve(xmlConfig);
    });
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
