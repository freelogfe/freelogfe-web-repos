/** 漫画排版工具 */

import './index.less';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Timeout } from 'ahooks/lib/useRequest/src/types';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import { formatDate } from './utils/common';
import { IResourceCreateVersionDraft } from '@/type/resourceTypes';
import fMessage from '@/components/fMessage';
import { Modal } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { ImgInComicTool } from './utils/interface';
import { ImportDrawer } from './components/import-drawer';
import { ImgCard } from './components/img-card';
import {
  MAX_IMG_LENGTH,
  MAX_IMG_SIZE,
  UPLOAD_LOCAL_ACCEPT,
  CUT_IMG_ACCEPT,
  MAX_CUT_IMG_LENGTH,
  MAX_HEIGHT_PER_PIECE,
  MAX_REQUEST_BATCH_COUNT,
} from './utils/assets';
import { PreviewBox } from './components/preview-box';
import Sortable from 'sortablejs';
import CutDescImg from './images/cut-desc.png';
import BlueScissors from './images/blue-scissors.png';
import BlackScissors from './images/black-scissors.png';
import { Loading3QuartersOutlined } from '@ant-design/icons/lib/icons';
const { Uncompress } = require('./core/uncompress');

interface ToolProps {
  // 资源 id
  resourceId: string;
  // 是否显示
  show: boolean;
  // 关闭工具弹窗
  close: () => void;
  // 设置是否已保存
  setSaved: (saved: boolean) => void;
}

export const comicToolContext = React.createContext<any>({});

const { confirm } = Modal;

/** 排版工具 */
export const ComicTool = (props: ToolProps) => {
  const { resourceId, show, close, setSaved } = props;

  const resource = useRef<any>({});
  const deleteItem = useRef<any>(null);
  const inputTimer = useRef<Timeout | null>(null);
  const stopTimer = useRef<Timeout | null>(null);
  const sorter = useRef<Sortable | null>(null);

  const [edited, setEdited] = useState<boolean | null>(null);
  const [saveType, setSaveType] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState(0);

  const [comicName, setComicName] = useState('');
  const [comicMode, setComicMode] = useState(0);
  const [comicConfig, setComicConfig] = useState<any>({});
  const [imgList, setImgList] = useState<ImgInComicTool[]>([]);
  const [insertIndex, setInsertIndex] = useState(-1);
  const [importDrawer, setImportDrawer] = useState(false);
  const [previewShow, setPreviewShow] = useState(false);
  const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
  const [loaderShow, setLoaderShow] = useState(false);
  const [cuttingLoaderShow, setCuttingLoaderShow] = useState(false);
  const [saveFailTipShow, setSaveFailTipShow] = useState(false);

  /** 退出 */
  const exit = async () => {
    if (edited) {
      confirm({
        content: FI18n.i18nNext.t('alarm_leave_page'),
        okText: FI18n.i18nNext.t('btn_leave'),
        cancelText: FI18n.i18nNext.t('btn_cancel'),
        onOk() {
          close && close();
        },
      });
    } else {
      close && close();
    }
  };

  /** 获取资源与草稿数据 */
  const getData = async () => {
    const resourceRes = await FServiceAPI.Resource.info({
      resourceIdOrName: resourceId,
    });
    resource.current.resourceData = resourceRes.data;
    const { resourceType } = resourceRes.data;
    if (resourceType[2] === '条漫') {
      setComicMode(1);
    } else if (resourceType[2] === '日漫') {
      setComicMode(2);
    }
    const draftRes = await FServiceAPI.Resource.lookDraft({ resourceId });
    if (draftRes.errCode !== 0) {
      fMessage(draftRes.msg);
      return;
    }
    resource.current.draftData = draftRes.data
      .draftData as IResourceCreateVersionDraft;
    const { selectedFileInfo } = resource.current.draftData;
    if (selectedFileInfo) {
      const { name, sha1 } = selectedFileInfo;
      setComicName(name);
      const content = await FUtil.Request({
        method: 'GET',
        url: `/v2/storages/files/${sha1}/download`,
      });
    }
    setEdited(false);
  };

  /** 保存 */
  const save = async () => {
    const invalidImgIndex = imgList.findIndex(
      (item) => item.size > MAX_IMG_SIZE,
    );
    if (invalidImgIndex !== -1) {
      // 存在无效图片
      if (!saveFailTipShow) {
        setSaveFailTipShow(true);
        setTimeout(() => {
          setSaveFailTipShow(false);
        }, 2000);
      }
      return;
    }

    if (!resource.current.draftData) return;

    setSaveType(1);
    const saveTime = Date.now();
    const list: { name: string; url: string }[] = [];
    const listInTool: any[] = [];
    const requestNum = Math.ceil(getTotal() / MAX_REQUEST_BATCH_COUNT); // 请求接口数
    const formDataList: FormData[] = [];
    let currentIndex = 0; // 当前图片序号

    /** 上传图片 */
    for (let i = 0; i < requestNum; i++) {
      formDataList[i] = new FormData();
    }
    imgList.forEach((img, index) => {
      const { name, base64, children } = img;
      const suffix = name.split('.')[1];
      const newImgName = `${String(index + 1).padStart(3, '0')}.${suffix}`;
      if (!children) {
        // 非切图
        const file = base64ToFile(base64, newImgName);
        const formDataIndex = Math.floor(
          currentIndex / MAX_REQUEST_BATCH_COUNT,
        );
        formDataList[formDataIndex].append('files', file);
        currentIndex++;
      } else {
        // 切图
        children.forEach((child, i) => {
          const { base64 } = child;
          const newName = String(i + 1).padStart(2, '0');
          const newChildName = newImgName.replace(
            `.${suffix}`,
            `_${newName}.${suffix}`,
          );
          const file = base64ToFile(base64, newChildName);
          const formDataIndex = Math.floor(
            currentIndex / MAX_REQUEST_BATCH_COUNT,
          );
          formDataList[formDataIndex].append('files', file);
          currentIndex++;
        });
      }
    });
    const requestArr: Promise<any>[] = [];
    formDataList.forEach((item) => {
      requestArr.push(batchUploadImg(item));
    });
    const imgResArr = await Promise.all(requestArr);
    const err = imgResArr.findIndex((item) => item.errCode !== 0) !== -1;
    if (err) return;

    /** 上传图片完成，通过 sha1 获取 url */
    const resList = imgResArr.map((item) => item.data).flat();
    resList.forEach(
      (item: { filename: string; sha1: string; fileSize: number }) => {
        const { filename, sha1, fileSize } = item;
        const url = `${FUtil.Format.completeUrlByDomain(
          'api',
        )}/v2/storages/files/${sha1}/download`;
        const img = { name: filename, url, size: fileSize };
        list.push(img);

        const nameList = filename.split('.')[0].split('_');
        const parentIndex = Number(nameList[0]) - 1;
        if (nameList.length === 1) {
          // 非切图
          const imgInTool = {
            name: imgList[parentIndex].name,
            sha1,
            size: fileSize,
          };
          listInTool.push(imgInTool);
        } else if (nameList.length === 2) {
          // 切图
          const childIndex = Number(nameList[1]) - 1;
          if (childIndex === 0) {
            // 切图第一张，将第一张切图作为父级数据
            const imgInTool = {
              name: imgList[parentIndex].name,
              sha1,
              size: fileSize,
              children: [],
            };
            listInTool.push(imgInTool);
          }
          const children = imgList[parentIndex].children;
          if (!children) return;
          const name = children[childIndex].name;
          const imgInTool = { name, sha1, size: fileSize };
          listInTool[parentIndex].children[childIndex] = imgInTool;
        }
      },
    );

    /** 整理 json 和 xml */
    let name = comicName;
    if (!name) {
      // 新建文件，文件名称命名规则为{资源名称 最后保存时间}
      name =
        resource.current.resourceData.resourceName.split('/')[1] +
        formatDate(saveTime, 'YYYYMMDDhhmm').substring(2);
    }
    const json = {
      name,
      mode: comicMode,
      list,
      config: comicConfig,
      custom: listInTool,
    };
    const xml = json2Xml(comicConfig);
    const jsonFile = new File([JSON.stringify(json)], 'index.json', {
      type: 'application/json',
    });
    const xmlFile = new File([xml], 'ComicInfo.xml', {
      type: 'text/xml',
    });

    /** 上传 json 和 xml */
    const jsonFormData = new FormData();
    jsonFormData.append('files', jsonFile);
    jsonFormData.append('files', xmlFile);
    const res = await batchUploadImg(jsonFormData);
    if (res.errCode !== 0) return;

    /** 打包漫画文件 */
    const sha1Array: { fileName: string; sha1: string }[] = [];
    list.forEach((item) => {
      const { name, url } = item;
      const urlSplit = url.split('/');
      const sha1Item = { fileName: name, sha1: urlSplit[urlSplit.length - 2] };
      sha1Array.push(sha1Item);
    });
    res.data.forEach((item: { filename: string; sha1: string }) => {
      const { filename, sha1 } = item;
      sha1Array.push({ fileName: filename, sha1 });
    });
    const compressRes = await compressFiles(sha1Array);

    resource.current.draftData.selectedFileInfo = {
      name,
      sha1: compressRes.data.sha1,
      from: `最近编辑时间 ${formatDate(saveTime)}`,
    };
    const saveDraftRes = await FServiceAPI.Resource.saveVersionsDraft({
      resourceId,
      draftData: resource.current.draftData,
    });
    if (saveDraftRes.errCode !== 0) {
      fMessage(saveDraftRes.msg);
      return;
    }
    setSaveType(2);
    setLastSaveTime(saveTime);
    setEdited(false);
    if (inputTimer.current) {
      clearTimeout(inputTimer.current);
      inputTimer.current = null;
    }
    if (stopTimer.current) {
      clearTimeout(stopTimer.current);
      stopTimer.current = null;
    }
  };

  /** json 转 xml */
  const json2Xml = (config: any) => {
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
  const getChildrenXml = (childrenList: any[], level: number) => {
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

  /** 批量上传图片 */
  const batchUploadImg = (formData: FormData) => {
    return FUtil.Request({
      method: 'POST',
      url: `/v2/storages/files/uploadFileMulti`,
      data: formData,
    });
  };

  /** 打包漫画文件 */
  const compressFiles = (sha1Array: { fileName: string; sha1: string }[]) => {
    return FUtil.Request({
      method: 'POST',
      url: `/v2/storages/files/compressFiles`,
      data: { sha1Array },
    });
  };

  /** base64 转 file */
  const base64ToFile = (base64: string, name: string) => {
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

  /** 快捷键 */
  const keyup = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeAllPopup();
  };

  /** 关闭所有弹窗 */
  const closeAllPopup = () => {
    setPreviewShow(false);
  };

  /** 更改删除对象 */
  const setDeleteItem = (item: any) => {
    deleteItem.current = item;
  };

  /** 删除图片 */
  const deleteImg = () => {
    if (deleteItem.current) {
      const list = [...imgList];
      list.splice(deleteItem.current.index, 1);
      setImgList(list);
      deleteItem.current = null;
    } else {
      setImgList([]);
    }
    setDeleteConfirmShow(false);
  };

  /** 上传本地图片 */
  const uploadLocalImg = (files: FileList) => {
    if (files.length === 0) return;

    setLoaderShow(true);
    const insertPoint = insertIndex !== -1 ? insertIndex : imgList.length;
    const list = [...files];
    let typeTip = true; // 是否需要显示格式错误 tip

    if (imgList.length + list.length > MAX_IMG_LENGTH) {
      fMessage(FI18n.i18nNext.t('cbformatter_add_error_qtylimitation'));
      list.splice(MAX_IMG_LENGTH - imgList.length);
    }

    const imgs: ImgInComicTool[] = [];
    let doneCount = 0;

    list.forEach((file, index) => {
      const { type, name, size } = file;

      if (!['image/png', 'image/jpeg', 'image/gif'].includes(type)) {
        if (typeTip) {
          fMessage(FI18n.i18nNext.t('cbformatter_add_error_format'));
          typeTip = false;
        }
        doneCount++;
        if (doneCount === list.length) {
          imgList.splice(insertPoint, 0, ...imgs.filter((item) => item));
          setImgList([...imgList]);
          setLoaderShow(false);
        }
        return;
      }

      if (size > MAX_IMG_SIZE) {
        const img = { name, size, base64: require('./images/oversize.png') };
        imgs[index] = img;
        doneCount++;
        if (doneCount === list.length) {
          imgList.splice(insertPoint, 0, ...imgs.filter((item) => item));
          setImgList([...imgList]);
          setLoaderShow(false);
        }

        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (evt) => {
        const base64: string = evt!.target!.result as string;
        const img = { name, size, base64 };
        imgs[index] = img;
        doneCount++;
        if (doneCount === list.length) {
          imgList.splice(insertPoint, 0, ...imgs.filter((item) => item));
          setImgList([...imgList]);
          setLoaderShow(false);
        }
      };
    });
  };

  /** 批量切图 */
  const cutImages = (files: FileList) => {
    if (files.length > MAX_CUT_IMG_LENGTH) {
      // 切图数量超过最大同时切图数量
      fMessage(FI18n.i18nNext.t('cbformatter_slice_error_qtylimitation'));
      return;
    }

    if (getTotal() === MAX_IMG_LENGTH) {
      // 数量已达到最大图片总数量
      fMessage(FI18n.i18nNext.t('cbformatter_add_error_qtylimitation'));
      return;
    }

    setCuttingLoaderShow(true);
    const results: ImgInComicTool[] = [];
    const list = [...files];
    let typeTip = true; // 是否需要显示格式错误 tip
    let heightTip = true; // 是否需要显示切图高度小于最小指定切图高度 tip
    let overTotal = true; // 是否已经超过最大数量限制
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      const { type, name, size } = file;

      if (!['image/png', 'image/jpeg'].includes(type)) {
        // 切图类型非指定类型
        if (typeTip) {
          fMessage(FI18n.i18nNext.t('cbformatter_slice_error_format'));
          typeTip = false;
        }
        if (i === list.length - 1) {
          setImgList([...imgList, ...results.filter((item) => item)]);
          setCuttingLoaderShow(false);
        }
        continue;
      }

      let imgItem: ImgInComicTool = { name, base64: '', size: 0, children: [] };
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (evt) => {
        const replaceSrc: string = evt!.target!.result as string;
        const image = new Image();
        image.src = replaceSrc;
        image.onload = () => {
          const { width, height } = image;
          if (height <= MAX_HEIGHT_PER_PIECE) {
            // 原图高度小于规定最小高度，不予切图直接按普通上传图片处理
            imgItem = { name, size, base64: replaceSrc };
            results[i] = imgItem;
            if (heightTip) {
              fMessage(FI18n.i18nNext.t('cbformatter_slice_error_height'));
              heightTip = false;
            }
            if (i === list.length - 1) {
              setImgList([...imgList, ...results.filter((item) => item)]);
              setCuttingLoaderShow(false);
            }
            return;
          }

          const pieceNum = Math.ceil(height / MAX_HEIGHT_PER_PIECE);
          const heightPerPiece = height / pieceNum;
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = heightPerPiece;
          const ctx = canvas.getContext('2d');
          for (let j = 0; j < pieceNum; j++) {
            ctx!.clearRect(0, 0, canvas.width, canvas.height);
            ctx!.drawImage(
              image,
              0,
              heightPerPiece * j,
              width,
              heightPerPiece,
              0,
              0,
              canvas.width,
              canvas.height,
            );
            const base64 = canvas.toDataURL('image/jpeg');
            const childSize = getSizeByBase64(base64);

            if (childSize > MAX_IMG_SIZE) {
              // 尺寸大于单张最大尺寸
              imgItem = {
                name,
                size,
                base64: require('./images/oversize.png'),
                children: [],
              };
              results[i] = imgItem;
              if (i === list.length - 1) {
                setImgList([...imgList, ...results.filter((item) => item)]);
                setCuttingLoaderShow(false);
              }
              break;
            }

            // 列表显示第一张切图
            if (j === 0) imgItem.base64 = base64;

            const nameArr = name.split('.');
            const childImg = {
              name: `${nameArr[0]}-${String(j + 1).padStart(2, '0')}.${
                nameArr[1]
              }`,
              base64,
              size: childSize,
            };
            imgItem.children!.push(childImg);

            if (j === pieceNum - 1) {
              // 最后一张切图，处理完之后将图片加入队列

              const currentTotal = getTotal();
              if (currentTotal + imgItem.children!.length > MAX_IMG_LENGTH) {
                // 数量已达到最大图片总数量
                const restCount = MAX_IMG_LENGTH - currentTotal;
                if (restCount > 0) {
                  imgItem.children = imgItem.children!.slice(0, restCount);
                  results[i] = imgItem;
                }
                if (overTotal) {
                  fMessage(
                    FI18n.i18nNext.t('cbformatter_add_error_qtylimitation'),
                  );
                  overTotal = false;
                }
                if (i === list.length - 1) {
                  setImgList([...imgList, ...results.filter((item) => item)]);
                  setCuttingLoaderShow(false);
                }
                break;
              } else {
                results[i] = imgItem;
                if (i === list.length - 1) {
                  setImgList([...imgList, ...results.filter((item) => item)]);
                  setCuttingLoaderShow(false);
                }
              }
            }
          }
        };
      };
    }
  };

  /** 单张切图 */
  const cutImage = (item: ImgInComicTool) => {
    if (getTotal() === MAX_IMG_LENGTH) {
      // 数量已达到最大图片总数量
      fMessage(FI18n.i18nNext.t('cbformatter_add_error_qtylimitation'));
      return;
    }

    setCuttingLoaderShow(true);
    const { name, base64 } = item;
    const image = new Image();
    image.src = base64;
    image.onload = () => {
      const { width, height } = image;
      if (height <= MAX_HEIGHT_PER_PIECE) {
        // 原图高度小于规定最小高度，不予切图
        fMessage(FI18n.i18nNext.t('cbformatter_slice_error_height'));
        setCuttingLoaderShow(false);
        return;
      }

      const pieceNum = Math.ceil(height / MAX_HEIGHT_PER_PIECE);
      const heightPerPiece = height / pieceNum;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = heightPerPiece;
      const ctx = canvas.getContext('2d');
      for (let i = 0; i < pieceNum; i++) {
        ctx!.clearRect(0, 0, canvas.width, canvas.height);
        ctx!.drawImage(
          image,
          0,
          heightPerPiece * i,
          width,
          heightPerPiece,
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const base64 = canvas.toDataURL('image/jpeg');
        const childSize = getSizeByBase64(base64);

        if (childSize > MAX_IMG_SIZE) {
          // 尺寸大于单张最大尺寸
          item.base64 = require('./images/oversize.png');
          item.children = [];
          setImgList([...imgList]);
          if (i === pieceNum - 1) setCuttingLoaderShow(false);
          break;
        }

        // 列表显示第一张切图
        if (i === 0) item.base64 = base64;

        const currentTotal = getTotal();
        if (currentTotal === MAX_IMG_LENGTH) {
          // 数量已达到最大图片总数量
          setImgList([...imgList]);
          fMessage(FI18n.i18nNext.t('cbformatter_add_error_qtylimitation'));
          if (i === pieceNum - 1) setCuttingLoaderShow(false);
          break;
        }

        const nameArr = name.split('.');
        const childImg = {
          name: `${nameArr[0]}-${String(i + 1).padStart(2, '0')}.${nameArr[1]}`,
          base64,
          size: childSize,
        };
        if (!item.children) item.children = [];
        item.children.push(childImg);

        if (i === pieceNum - 1) {
          // 最后一张切图，处理完之后将图片加入队列
          setImgList([...imgList]);
          setCuttingLoaderShow(false);
        }
      }
    };
  };

  /** 根据 base64 获取大小 */
  const getSizeByBase64 = (base64: string = '') => {
    base64 = base64.split(',')[1];
    const equalIndex = base64.indexOf('=');
    const strLength =
      equalIndex > 0 ? base64.substring(0, equalIndex).length : base64.length;
    const fileLength = strLength - (strLength / 8) * 2;
    return Math.floor(fileLength);
  };

  /** 获取图片总数量 */
  const getTotal = () => {
    let total = 0;
    imgList.forEach((item) => {
      total += item.children ? item.children.length : 1;
    });
    return total;
  };

  useEffect(() => {
    if (show) {
      Uncompress.loadArchiveFormats(['rar', 'zip', 'tar']);

      window.addEventListener('keyup', keyup);
      document.body.style.overflowY = 'hidden';

      getData();
    }

    return () => {
      window.removeEventListener('keyup', keyup);
      document.body.style.overflowY = 'auto';
    };
  }, [show]);

  useEffect(() => {
    if (edited === false) {
      setEdited(true);

      // if (!inputTimer.current) {
      //   inputTimer.current = setTimeout(() => {
      //     save();
      //     inputTimer.current = null;
      //   }, 15000);
      // }

      // if (stopTimer.current) {
      //   clearTimeout(stopTimer.current);
      //   stopTimer.current = null;
      // }
      // stopTimer.current = setTimeout(() => {
      //   save();
      //   stopTimer.current = null;
      //   if (inputTimer.current) {
      //     clearTimeout(inputTimer.current);
      //     inputTimer.current = null;
      //   }
      // }, 3000);
    }

    if (sorter.current) return;

    const sortableList = document.getElementById('sortableList');
    if (!sortableList) return;

    sorter.current = new Sortable(sortableList, {
      animation: 150,
      handle: '.drag-handle,.drag-tip',
      onEnd(e) {
        setImgList((pre) => {
          const { oldIndex, newIndex } = e;
          const list = [...pre];
          const items = list.splice(oldIndex!, 1);
          list.splice(newIndex!, 0, ...items);
          return [...list];
        });
      },
    });
  }, [imgList]);

  useEffect(() => {
    setSaved && setSaved(!edited);
  }, [edited]);

  return (
    <comicToolContext.Provider
      value={{
        resourceId,
        Uncompress,
        comicMode,
        imgList,
        setDeleteItem,
        setDeleteConfirmShow,
        setComicConfig,
        setImgList,
        setLoaderShow,
      }}
    >
      <input
        type="file"
        id="uploadLocalImg"
        multiple={true}
        accept={UPLOAD_LOCAL_ACCEPT}
        onChange={(e) => uploadLocalImg(e.target.files!)}
      />
      <input
        type="file"
        id="cutImages"
        multiple={true}
        accept={CUT_IMG_ACCEPT}
        onChange={(e) => cutImages(e.target.files!)}
      />

      <div className={`comic-tool-wrapper ${show && 'show'}`}>
        <div className="header">
          <div className="title">{FI18n.i18nNext.t('cbformatter_title')}</div>

          <div className="header-right">
            <div className="article-info">
              {saveType === 1 && (
                <span>{FI18n.i18nNext.t('posteditor_state_saving')}</span>
              )}
              {saveType === 2 && (
                <span>
                  {FI18n.i18nNext.t('posteditor_state_saved', {
                    LastEditTime: formatDate(lastSaveTime),
                  })}
                </span>
              )}
              {saveType === 3 && (
                <span>
                  {FI18n.i18nNext.t('posteditor_state_networkabnormal', {
                    LastEditTime: formatDate(lastSaveTime),
                  })}
                </span>
              )}
            </div>
            <div className={`save-btn ${!edited && 'disabled'}`} onClick={save}>
              {FI18n.i18nNext.t('btn_save_post')}
            </div>
            <div className="exit-btn" onClick={exit}>
              {FI18n.i18nNext.t('cbformatter_cancel_btn')}
            </div>
          </div>
        </div>

        <div className="body">
          <div className="body-box">
            <div className="btns-bar">
              <div className="bar-left">
                <div
                  className="primary-btn btn"
                  onClick={() => {
                    document.getElementById('uploadLocalImg')?.click();
                  }}
                >
                  {FI18n.i18nNext.t('cbformatter_add_btn')}
                </div>
                <div
                  className="text-btn btn"
                  onClick={() => setImportDrawer(true)}
                >
                  <i className="freelog fl-icon-daoruwendang" />
                  {FI18n.i18nNext.t('cbformatter_import_btn')}
                </div>
                {comicMode === 1 && (
                  <>
                    <div
                      className="text-btn btn"
                      onClick={() => {
                        document.getElementById('cutImages')?.click();
                      }}
                    >
                      <i className="freelog fl-icon-jiandao" />
                      {FI18n.i18nNext.t('cbformatter_batchslice_btn')}
                    </div>
                    <div className="info-box">
                      <FComponentsLib.FIcons.FInfo className="info-icon" />
                      <div className="info-popup">
                        <div className="img-box">
                          <img className="img" src={CutDescImg} />
                          <div className="line"></div>
                          <img className="scissors" src={BlueScissors} />
                        </div>
                        <div className="desc">
                          {FI18n.i18nNext.t('cbformatter_slice_info')}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div
                className={`primary-btn ${imgList.length === 0 && 'disabled'}`}
                onClick={() => setPreviewShow(true)}
              >
                {FI18n.i18nNext.t('cbformatter_preview_btn')}
              </div>
            </div>

            <div
              className="img-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                uploadLocalImg(e.dataTransfer.files);
              }}
            >
              {imgList.length === 0 ? (
                <div className="upload-box">
                  <i className="freelog fl-icon-shangchuanfengmian upload-icon"></i>
                  <div className="upload-desc">
                    {FI18n.i18nNext.t('cbformatter_add_info')}
                  </div>
                  <div className="upload-tip">
                    {FI18n.i18nNext.t('cbformatter_add_info02')}
                  </div>
                </div>
              ) : (
                <div className="img-box">
                  <div className="img-header">
                    <div className="box-header">
                      <div className="total">
                        {FI18n.i18nNext.t('cbformatter_image_qty', {
                          imageQty: getTotal(),
                        })}
                      </div>
                      <div
                        className="clear-btn"
                        onClick={() => setDeleteConfirmShow(true)}
                      >
                        <i className="freelog fl-icon-shanchu delete-icon" />
                        {FI18n.i18nNext.t('cbformatter_delete_btn_deleteall')}
                      </div>
                    </div>
                  </div>
                  <div id="sortableList" className="box-body">
                    {imgList.map((item, index) => {
                      return (
                        <ImgCard
                          index={index}
                          data={item}
                          setInsertIndex={setInsertIndex}
                          cutImage={cutImage}
                          key={item.name + index}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="desc-area">
              <li>{FI18n.i18nNext.t('cbformatter_note01')}</li>
              <li>{FI18n.i18nNext.t('cbformatter_note02')}</li>
              <li>{FI18n.i18nNext.t(`cbformatter_note03`)}</li>
            </div>
          </div>
        </div>

        <ImportDrawer
          show={importDrawer}
          close={() => setImportDrawer(false)}
        />

        <PreviewBox show={previewShow} close={() => setPreviewShow(false)} />

        {deleteConfirmShow && (
          <div className="delete-confirm-popup">
            <div
              className="modal"
              onClick={() => setDeleteConfirmShow(false)}
            ></div>
            <div className="confirm-popup">
              <div className="confirm-header">
                <div className="title">
                  {FI18n.i18nNext.t(
                    deleteItem.current
                      ? 'cbformatter_delete_confirmation_title'
                      : 'cbformatter_deleteall_confirmation_title',
                  )}
                </div>
                <i
                  className="freelog fl-icon-guanbi"
                  onClick={() => setDeleteConfirmShow(false)}
                ></i>
              </div>
              <div className="desc">
                {deleteItem.current
                  ? FI18n.i18nNext.t('cbformatter_delete_confirmation_msg', {
                      FileName: deleteItem.current.name,
                    })
                  : FI18n.i18nNext.t('cbformatter_deleteall_confirmation_msg')}
              </div>
              <div className="btns-box">
                <div
                  className="btn text-btn"
                  onClick={() => setDeleteConfirmShow(false)}
                >
                  {FI18n.i18nNext.t(
                    'cbformatter_delete_confirmation_btn_cancel',
                  )}
                </div>
                <div className="btn delete-btn" onClick={() => deleteImg()}>
                  {FI18n.i18nNext.t(
                    deleteItem.current
                      ? 'cbformatter_delete_confirmation_btn_delete'
                      : 'cbformatter_deleteall_confirmation_btn_deleteall',
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {loaderShow && (
          <div className="loader-wrapper">
            <div className="loader-box">
              <Loading3QuartersOutlined className="loader-icon" />
            </div>
          </div>
        )}

        {cuttingLoaderShow && (
          <div className="cutting-loader-wrapper">
            <div className="loader-box">
              <div className="title">
                {FI18n.i18nNext.t('cbformatter_slice_state_slicing')}
              </div>
              <div className="line-box">
                <img className="scissors" src={BlackScissors} />
                <div className="line"></div>
              </div>
              <div className="desc">
                {FI18n.i18nNext.t('cbformatter_slice_state_slicing_msg')}
              </div>
            </div>
          </div>
        )}

        <div className={`save-fail-tip ${saveFailTipShow && 'show'}`}>
          <div className="tip-title">
            {FI18n.i18nNext.t('cbformatter_submit_err_removewrongpage')}
          </div>
          <div className="tip-desc">
            {FI18n.i18nNext.t('cbformatter_submit_err_removewrongpage_msg')}
          </div>
        </div>
      </div>
    </comicToolContext.Provider>
  );
};
