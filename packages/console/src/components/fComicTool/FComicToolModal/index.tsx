/** 漫画排版工具 */

import './index.less';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Timeout } from 'ahooks/lib/useRequest/src/types';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import {
  base64ToFile,
  errorMessage,
  formatDate,
  getFileResult,
  getImage,
  getSizeByBase64,
  json2Xml,
  separateFileName,
} from './utils/common';
import { IResourceCreateVersionDraftType } from '@/type/resourceTypes';
import { Modal } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { ImgInComicTool, ImgInOutput } from './utils/interface';
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
import { uncompressComicArchive } from './core/import-comic';

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
export const ComicTool = ({ resourceId, show, close, setSaved }: ToolProps) => {
  const resource = useRef<any>({});
  const deleteItem = useRef<any>(null);
  const stopTimer = useRef<Timeout | null>(null);
  const sorter = useRef<Sortable | null>(null);
  const saveProgressList = useRef<number[]>([]);
  const saveTotalList = useRef<number[]>([]);
  const visibleIndexRef = useRef<number[]>([0, 0]);
  const sortableList = useRef<any>(null);
  const currentTotal = useRef<number>(0);

  const [edited, setEdited] = useState<boolean | null>(null);
  const [saveTipType, setSaveTipType] = useState(0);
  const [saveStep, setSaveStep] = useState(0);
  const [saveProgress, setSaveProgress] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState(0);
  const [comicName, setComicName] = useState('');
  const [comicMode, setComicMode] = useState(0); // 漫画模式 1-条漫 2-页漫 3-日漫
  const [comicConfig, setComicConfig] = useState<any>(null);
  const [imgList, setImgList] = useState<ImgInComicTool[]>([]);
  const [insertIndex, setInsertIndex] = useState(-1);
  const [dragging, setDragging] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const [visibleIndex, setVisibleIndex] = useState([0, 0]);

  const [importDrawer, setImportDrawer] = useState(false);
  const [previewShow, setPreviewShow] = useState(false);
  const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
  const [loaderShow, setLoaderShow] = useState(false);
  const [cuttingLoaderShow, setCuttingLoaderShow] = useState(false);
  const [saveLoaderShow, setSaveLoaderShow] = useState(false);
  const [saveFailTipShow, setSaveFailTipShow] = useState(false);

  /** 获取资源与草稿数据 */
  const getData = async () => {
    const resourceRes = await FServiceAPI.Resource.info({
      resourceIdOrName: resourceId,
    });
    resource.current.resourceData = resourceRes.data;
    const { resourceType } = resourceRes.data;
    if (resourceType[2] === '条漫') {
      setComicMode(1);
    } else if (resourceType[2] === '页漫') {
      setComicMode(2);
    } else if (resourceType[2] === '日漫') {
      setComicMode(3);
    }
    const draftRes = await FServiceAPI.Resource.lookDraft({ resourceId });
    if (draftRes.errCode !== 0) return errorMessage(draftRes.msg, false);
    resource.current.draftData = draftRes.data
      .draftData as IResourceCreateVersionDraftType;
    const { selectedFileInfo } = resource.current.draftData;
    if (selectedFileInfo) {
      setLoaderShow(true);
      const { name, sha1 } = selectedFileInfo;
      setComicName(name);
      const res = await FUtil.Request({
        method: 'GET',
        url: `/v2/storages/files/${sha1}/download`,
        responseType: 'blob',
      });
      const file = new File([res], name);
      setAutoScroll(true);
      uncompressComicArchive(
        file,
        {
          setLoaderShow,
          setImgList,
          setComicConfig,
          setEdited,
        },
        1,
      );
    } else {
      setEdited(false);
    }
  };

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

  /** 快捷键 */
  const keyup = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setPreviewShow(false);
  };

  /** 修改资源数据 */
  const setResource = (data: any) => {
    resource.current = data;
  };

  /** 更改删除对象 */
  const setDeleteItem = (item: any) => {
    deleteItem.current = item;
  };

  /** 获取图片总数量 */
  const getTotal = () => {
    let total = 0;
    imgList.forEach((item) => {
      const { children, size } = item;
      if (size > MAX_IMG_SIZE) return;

      total += children ? children.length : 1;
    });
    return total;
  };

  /** 初始化图片区域 */
  const initImageArea = () => {
    sortableList.current = document.getElementById('sortableList');

    if (sortableList.current) {
      // 监听滚动，实时计算图片显示/隐藏
      sortableList.current.addEventListener('scroll', () => {
        const { clientWidth, scrollTop } = sortableList.current;
        const lineNum = Math.floor(scrollTop / 318);
        const countPerLine = clientWidth === 1128 ? 5 : 6;
        const startIndex = countPerLine * (lineNum === 0 ? 0 : lineNum - 1);
        const endIndex = countPerLine * (lineNum + 3);
        if (
          startIndex !== visibleIndexRef.current[0] ||
          endIndex !== visibleIndexRef.current[1]
        ) {
          visibleIndexRef.current = [startIndex, endIndex];
          setVisibleIndex([startIndex, endIndex]);
        }
      });

      const { clientWidth, clientHeight, scrollHeight } = sortableList.current;
      if (clientHeight === scrollHeight) {
        // 没有滚动条时，显示前三行
        const countPerLine = clientWidth === 1128 ? 5 : 6;
        const startIndex = 0;
        const endIndex = countPerLine * 3;
        if (
          startIndex !== visibleIndexRef.current[0] ||
          endIndex !== visibleIndexRef.current[1]
        ) {
          visibleIndexRef.current = [startIndex, endIndex];
          setVisibleIndex([startIndex, endIndex]);
        }
      }

      initSorter();
    }
  };

  /** 初始化拖动列表 */
  const initSorter = () => {
    if (sorter.current || !sortableList.current) return;

    sorter.current = new Sortable(sortableList.current, {
      animation: 150,
      handle: '.drag-handle,.drag-tip',
      forceFallback: true,
      scrollSensitivity: 100,
      scrollSpeed: 50,
      onStart() {
        setDragging(true);
      },
      onEnd(e) {
        setAutoScroll(false);
        setDragging(false);
        setImgList((pre) => {
          const { oldIndex, newIndex } = e;
          const list = [...pre];
          const items = list.splice(oldIndex!, 1);
          list.splice(newIndex!, 0, ...items);
          return [...list];
        });
      },
    });
  };

  /** 删除图片 */
  const deleteImg = () => {
    setAutoScroll(false);
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
  const uploadLocalImg = async (files: FileList) => {
    const list = [...files].filter((file) =>
      ['image/png', 'image/jpeg', 'image/gif'].includes(file.type),
    );

    if (list.length !== files.length)
      errorMessage('cbformatter_add_error_format');

    const currentTotal = getTotal();
    if (currentTotal + list.length > MAX_IMG_LENGTH) {
      errorMessage('cbformatter_add_error_qtylimitation');
      list.splice(MAX_IMG_LENGTH - currentTotal);
    }

    if (list.length === 0) return setInsertIndex(-1);

    setLoaderShow(true);

    const imgs: ImgInComicTool[] = [];
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      const { name, size } = file;
      if (size > MAX_IMG_SIZE) {
        // 超过限定尺寸
        const img = {
          name,
          size,
          base64: '',
          width: 0,
          height: 0,
        };
        imgs.push(img);
      } else {
        // 正常情况
        const base64 = await getFileResult(file);
        const image = await getImage(base64);
        const { width, height } = image;
        const img = { name, size, base64, width, height };
        imgs.push(img);
      }

      if (i === list.length - 1) {
        // 全部整理完成
        const insertPoint = insertIndex !== -1 ? insertIndex : imgList.length;
        setAutoScroll(insertIndex === -1);
        imgList.splice(insertPoint, 0, ...imgs.filter((item) => item));
        setImgList([...imgList]);
        setLoaderShow(false);
        setInsertIndex(-1);
      }
    }
  };

  /** 新增切图图片 */
  const addCutImage = (newImage: ImgInComicTool) => {
    if (newImage.children) {
      // 切图
      const { length } = newImage.children;
      const restCount = MAX_IMG_LENGTH - currentTotal.current;
      if (length > restCount) {
        newImage.children = newImage.children.slice(0, restCount);
        errorMessage('cbformatter_add_error_qtylimitation');
        currentTotal.current = currentTotal.current + restCount;
      } else {
        currentTotal.current = currentTotal.current + length;
      }
    } else {
      currentTotal.current = currentTotal.current + 1;
    }
    setImgList((pre) => [...pre, newImage]);
  };

  /** 批量切图 */
  const cutImages = async (files: FileList) => {
    if (files.length > MAX_CUT_IMG_LENGTH) {
      // 切图数量超过最大同时切图数量
      return errorMessage('cbformatter_slice_error_qtylimitation');
    }

    currentTotal.current = getTotal();

    if (currentTotal.current === MAX_IMG_LENGTH) {
      // 数量已达到最大图片总数量
      return errorMessage('cbformatter_add_error_qtylimitation');
    }

    setCuttingLoaderShow(true);
    setAutoScroll(true);
    const list = [...files];
    let typeTip = true; // 是否需要显示格式错误 tip
    let heightTip = true; // 是否需要显示切图高度小于最小指定切图高度 tip
    let canvas: HTMLCanvasElement | null = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    for (let i = 0; i < list.length; i++) {
      if (currentTotal.current === MAX_IMG_LENGTH) {
        canvas = null;
        ctx = null;
        setCuttingLoaderShow(false);
        break;
      }

      const file = list[i];
      const { type, name, size } = file;

      if (!['image/png', 'image/jpeg'].includes(type)) {
        // 切图类型非指定类型
        if (typeTip) {
          errorMessage('cbformatter_slice_error_format');
          typeTip = false;
        }
        if (i === list.length - 1) {
          canvas = null;
          ctx = null;
          setCuttingLoaderShow(false);
        }
        continue;
      }

      const base64 = await getFileResult(file);
      const image = await getImage(base64);
      const { width, height } = image;
      if (height <= MAX_HEIGHT_PER_PIECE) {
        // 原图高度小于规定最小高度，不予切图直接按普通上传图片处理
        const noCutImage = { name, size, base64, width, height };
        addCutImage(noCutImage);
        if (heightTip) {
          errorMessage('cbformatter_slice_error_height');
          heightTip = false;
        }
        if (i === list.length - 1) {
          canvas = null;
          ctx = null;
          setCuttingLoaderShow(false);
        }
        continue;
      }

      const imgItem: ImgInComicTool = {
        name,
        base64: '',
        size: 0,
        children: [],
        width: 0,
        height: 0,
      };
      const pieceNum = Math.ceil(height / MAX_HEIGHT_PER_PIECE);
      const heightPerPiece = height / pieceNum;
      canvas!.width = width;
      canvas!.height = heightPerPiece;
      for (let j = 0; j < pieceNum; j++) {
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
        ctx!.drawImage(
          image,
          0,
          heightPerPiece * j,
          width,
          heightPerPiece,
          0,
          0,
          canvas!.width,
          canvas!.height,
        );

        const base64 = canvas!.toDataURL(type);
        const childSize = getSizeByBase64(base64);
        if (childSize > MAX_IMG_SIZE) {
          // 尺寸大于单张最大尺寸
          imgItem.size = size;
          addCutImage(imgItem);
          if (i === list.length - 1) {
            canvas = null;
            ctx = null;
            setCuttingLoaderShow(false);
          }
          break;
        }

        // 列表显示第一张切图
        if (j === 0) imgItem.base64 = base64;

        const [filename, suffix] = separateFileName(name);
        const childImg = {
          name: `${filename}-${String(j + 1).padStart(2, '0')}.${suffix}`,
          base64,
          size: childSize,
          width,
          height: heightPerPiece,
        };
        imgItem.children!.push(childImg);

        if (j === pieceNum - 1) {
          addCutImage(imgItem);
          if (i === list.length - 1) {
            canvas = null;
            ctx = null;
            setCuttingLoaderShow(false);
          }
        }
      }
    }
  };

  /** 单张切图 */
  const cutImage = async (item: ImgInComicTool) => {
    const currentTotal = getTotal();
    const restCount = MAX_IMG_LENGTH - currentTotal;
    if (restCount === 0) {
      // 数量已达到最大图片总数量
      return errorMessage('cbformatter_add_error_qtylimitation');
    }

    const { name, base64, width, height } = item;
    if (height <= MAX_HEIGHT_PER_PIECE) {
      // 原图高度小于规定最小高度，不予切图
      setCuttingLoaderShow(false);
      return errorMessage('cbformatter_slice_error_height');
    }

    setCuttingLoaderShow(true);
    setAutoScroll(false);
    const image = await getImage(base64);
    const pieceNum = Math.ceil(height / MAX_HEIGHT_PER_PIECE);
    const heightPerPiece = height / pieceNum;
    let canvas: HTMLCanvasElement | null = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = heightPerPiece;
    for (let i = 0; i < pieceNum; i++) {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.drawImage(
        image,
        0,
        heightPerPiece * i,
        width,
        heightPerPiece,
        0,
        0,
        canvas!.width,
        canvas!.height,
      );

      const base64 = canvas!.toDataURL('image/jpeg');
      const childSize = getSizeByBase64(base64);
      if (childSize > MAX_IMG_SIZE) {
        // 尺寸大于单张最大尺寸
        item.base64 = '';
        item.children = [];
        setImgList([...imgList]);
        setCuttingLoaderShow(false);
        setAutoScroll(false);
        break;
      }

      // 列表显示第一张切图
      if (i === 0) {
        item.base64 = base64;
        item.size = 0;
      }

      const [filename, suffix] = separateFileName(name);
      const childImg = {
        name: `${filename}-${String(i + 1).padStart(2, '0')}.${suffix}`,
        base64,
        size: childSize,
        width,
        height: heightPerPiece,
      };
      if (!item.children) item.children = [];
      item.children.push(childImg);

      if (i === pieceNum - 1) {
        // 最后一张切图，处理完之后将图片加入队列
        if (restCount < item.children.length) {
          item.children = item.children.slice(0, restCount + 1);
          errorMessage('cbformatter_add_error_qtylimitation');
        }
        setImgList([...imgList]);
        setCuttingLoaderShow(false);
        canvas = null;
        ctx = null;
        setAutoScroll(false);
      }
    }
  };

  /** 保存 */
  const save = async (auto: boolean) => {
    const invalidImgIndex = imgList.findIndex(
      (item) => item.size > MAX_IMG_SIZE,
    );
    if (invalidImgIndex !== -1) {
      // 存在无效图片
      if (!saveFailTipShow && !auto) {
        setSaveFailTipShow(true);
        setTimeout(() => {
          setSaveFailTipShow(false);
        }, 2000);
      }
      return;
    }

    if (!resource.current.draftData) return;

    if (stopTimer.current) {
      clearTimeout(stopTimer.current);
      stopTimer.current = null;
    }
    if (!auto) {
      setSaveLoaderShow(true);
      setSaveProgress(0);
      setSaveStep(1);
      saveProgressList.current = [];
      saveTotalList.current = [];
    }
    setSaveTipType(1);
    const saveTime = Date.now();
    const list: ImgInOutput[] = [];
    const listInTool: any[] = [];
    const formDataList: FormData[] = [];
    const sha1Mapping: any = {};
    let currentIndex = 0; // 当前图片序号

    /** 上传图片 */
    imgList.forEach((img, index) => {
      const { name, base64, children, sha1 } = img;
      if (!children && sha1) return;
      const [, suffix] = separateFileName(name);
      const newImgName = `${String(index + 1).padStart(3, '0')}.${suffix}`;
      if (!children) {
        // 非切图
        const formDataIndex = Math.floor(
          currentIndex / MAX_REQUEST_BATCH_COUNT,
        );
        if (!formDataList[formDataIndex]) {
          formDataList[formDataIndex] = new FormData();
        }
        const file = base64ToFile(base64, newImgName);
        formDataList[formDataIndex].append('files', file);
        currentIndex++;
      } else {
        // 切图
        children.forEach((child, i) => {
          if (child.sha1) return;

          const formDataIndex = Math.floor(
            currentIndex / MAX_REQUEST_BATCH_COUNT,
          );
          if (!formDataList[formDataIndex]) {
            formDataList[formDataIndex] = new FormData();
          }
          const { base64 } = child;
          const newName = String(i + 1).padStart(2, '0');
          const newChildName = newImgName.replace(
            `.${suffix}`,
            `_${newName}.${suffix}`,
          );
          const file = base64ToFile(base64, newChildName);
          formDataList[formDataIndex].append('files', file);
          currentIndex++;
        });
      }
    });

    const requestArr: Promise<any>[] = [];
    formDataList.forEach((item, index) => {
      requestArr.push(uploadFile(item, index, 0));
    });
    const imgResArr = await Promise.all(requestArr);
    const err = imgResArr.findIndex((item) => item.errCode !== 0) !== -1;
    if (err) {
      if (!auto) {
        errorMessage('createversion_state_networkabnormal2');
        setSaveTipType(3);
        setSaveLoaderShow(false);
      }
      return;
    }

    /** 上传图片完成，整理数据 */
    const resList = imgResArr.map((item) => item.data).flat();
    imgList.forEach((img, index) => {
      const { name, size, children, sha1, width, height } = img;
      const [, suffix] = separateFileName(name);
      const newImgName = `${String(index + 1).padStart(3, '0')}.${suffix}`;
      if (children) {
        // 切图，处理子集
        const imgInTool: any = { name, children: [] };
        children.forEach((child, i) => {
          const { name, size, sha1, width, height } = child;
          const newName = String(i + 1).padStart(2, '0');
          const newChildName = newImgName.replace(
            `.${suffix}`,
            `_${newName}.${suffix}`,
          );
          let theSha1 = sha1;
          if (!theSha1) {
            const res = resList.find((res) => res.filename === newChildName);
            theSha1 = res.sha1;
            child.sha1 = res.sha1;
          }
          const childItem = { name: newChildName, size, width, height };
          const childInTool = { name, sha1: theSha1, size, width, height };
          sha1Mapping[newChildName] = theSha1;
          list.push(childItem);
          imgInTool.children.push(childInTool);
        });
        listInTool.push(imgInTool);
      } else {
        // 非切图，处理自身
        let theSha1 = sha1;
        if (!theSha1) {
          // 未上传过的图片，结合上传后得到的数据进行整理
          const res = resList.find((res) => res.filename === newImgName);
          theSha1 = res.sha1;
        }
        const imgInList = { name: newImgName, size, width, height };
        const imgInTool = { name, size, width, height, sha1: theSha1 };
        sha1Mapping[newImgName] = theSha1;
        list.push(imgInList);
        listInTool.push(imgInTool);
      }
    });

    if (!auto) {
      setSaveStep(2);
      saveProgressList.current = [];
      saveTotalList.current = [];
    }

    /** 整理上传 json 和 xml */
    // 文件名称命名规则为{资源名称 最后保存时间}
    let name =
      resource.current.resourceData.resourceName.split('/')[1] +
      formatDate(saveTime, 'YYYYMMDDhhmm').substring(2);
    const jsonFormData = new FormData();
    const json = {
      mode: comicMode,
      list,
      config: comicConfig,
      custom: { list: listInTool },
    };
    const jsonFile = new File([JSON.stringify(json)], 'index.json', {
      type: 'application/json',
    });
    jsonFormData.append('files', jsonFile);
    if (comicConfig) {
      const xml = json2Xml(comicConfig);
      const xmlFile = new File([xml], 'ComicInfo.xml', {
        type: 'text/xml',
      });
      jsonFormData.append('files', xmlFile);
    }

    const res = await uploadFile(jsonFormData, 0, 25);
    if (res.errCode !== 0) {
      if (!auto) {
        errorMessage('createversion_state_networkabnormal2');
        setSaveTipType(3);
        setSaveLoaderShow(false);
      }
      return;
    }

    if (!auto) {
      setSaveStep(3);
    }

    /** 打包漫画文件 */
    const sha1Array: { fileName: string; sha1: string }[] = [];
    res.data.forEach((item: { filename: string; sha1: string }) => {
      const { filename, sha1 } = item;
      sha1Array.push({ fileName: filename, sha1 });
    });
    list.forEach((item) => {
      const { name } = item;
      const sha1Item = { fileName: name, sha1: sha1Mapping[name] };
      sha1Array.push(sha1Item);
    });
    const compressRes = await compressFiles(sha1Array);
    if (compressRes.errCode !== 0) {
      if (!auto) {
        errorMessage('createversion_state_networkabnormal2');
        setSaveTipType(3);
        setSaveLoaderShow(false);
      }
      return;
    }

    if (!auto) {
      setSaveStep(4);
    }

    /** 保存资源文件草稿 */
    resource.current.draftData.selectedFileInfo = {
      name,
      sha1: compressRes.data.sha1,
      from: `最近编辑时间 ${formatDate(saveTime)}`,
    };
    if (comicConfig) {
      const attrs = await settleAttrs();
      const { additionalProperties } = resource.current.draftData;
      attrs.forEach((item) => {
        const index = additionalProperties.findIndex(
          (prop: { key: string; value: string }) => prop.key === item.key,
        );
        if (index === -1) {
          // 不存在此属性
          resource.current.draftData.additionalProperties.push(item);
        } else {
          resource.current.draftData.additionalProperties[index].value =
            item.value;
        }
      });
    }
    const saveDraftRes = await saveDrafts({
      resourceId,
      draftData: resource.current.draftData,
    });
    if (saveDraftRes.errCode !== 0) {
      if (!auto) {
        errorMessage('createversion_state_networkabnormal2');
        setSaveTipType(3);
        setSaveLoaderShow(false);
      }
      return;
    }

    if (!auto) {
      setTimeout(() => {
        setSaveLoaderShow(false);
      }, 100);
    }
    setSaveTipType(2);
    setLastSaveTime(saveTime);
    setEdited(false);
  };

  /** 资源标准属性处理 */
  const settleAttrs = async () => {
    const attrs: { key: string; value: string }[] = [];
    const res = await FUtil.Request({
      method: 'GET',
      url: `/v2/resources/types/getAttrsByCode`,
      params: { code: resource.current.resourceData.resourceTypeCode },
    });
    const configs = comicConfig.children[0].children;
    res.data.forEach((item: { key: string }) => {
      const { key } = item;
      const index = configs.findIndex((config: any) => config.key === key);
      if (index !== -1) {
        // 配置没有这个属性
        const attr = { key, value: configs[index].value };
        attrs.push(attr);
      }
    });
    return attrs;
  };

  /** 批量上传文件 */
  const uploadFile = (
    formData: FormData,
    index: number,
    doneProgress: number,
  ) => {
    return FUtil.Request({
      method: 'POST',
      url: `/v2/storages/files/uploadFileMulti`,
      data: formData,
      onUploadProgress(progressEvent) {
        const { loaded, total } = progressEvent;
        let loadedCount = 0;
        let totalCount = 0;
        saveProgressList.current[index] = loaded;
        saveTotalList.current[index] = total;
        for (let i = 0; i < saveProgressList.current.length; i++) {
          loadedCount += saveProgressList.current[i] || 0;
          totalCount += saveTotalList.current[i] || 0;
        }
        const progress = Math.floor((loadedCount / totalCount) * 25);
        setSaveProgress(doneProgress + progress);
      },
    });
  };

  /** 打包漫画文件 */
  const compressFiles = (sha1Array: { fileName: string; sha1: string }[]) => {
    return FUtil.Request({
      method: 'POST',
      url: `/v2/storages/files/compressFiles`,
      data: { sha1Array },
      onUploadProgress(progressEvent) {
        const { loaded, total } = progressEvent;
        const doneProgress = 50;
        const progress = Math.floor((loaded / total) * 25);
        setSaveProgress(doneProgress + progress);
      },
    });
  };

  /** 保存资源草稿 */
  const saveDrafts = (params: { resourceId: string; draftData: any }) => {
    return FUtil.Request({
      method: 'POST',
      url: `/v2/resources/${params.resourceId}/versions/drafts`,
      data: params,
      onUploadProgress(progressEvent) {
        const { loaded, total } = progressEvent;
        const doneProgress = 75;
        const progress = Math.floor((loaded / total) * 25);
        setSaveProgress(doneProgress + progress);
      },
    });
  };

  useEffect(() => {
    if (show) {
      window.addEventListener('keyup', keyup);
      document.body.style.overflowY = 'hidden';

      getData();
    } else {
      window.removeEventListener('keyup', keyup);
      document.body.style.overflowY = 'auto';

      if (stopTimer.current) {
        clearTimeout(stopTimer.current);
        stopTimer.current = null;
      }

      resource.current = {};
      deleteItem.current = null;
      stopTimer.current = null;
      sorter.current = null;
      saveProgressList.current = [];
      saveTotalList.current = [];
      visibleIndexRef.current = [0, 0];
      sortableList.current = null;
      currentTotal.current = 0;

      setEdited(null);
      setSaveTipType(0);
      setSaveStep(0);
      setSaveProgress(0);
      setLastSaveTime(0);
      setComicName('');
      setComicMode(0);
      setComicConfig(null);
      setImgList([]);
      setInsertIndex(-1);
      setDragging(false);
      setAutoScroll(false);
      setVisibleIndex([0, 0]);

      setImportDrawer(false);
      setPreviewShow(false);
      setDeleteConfirmShow(false);
      setLoaderShow(false);
      setCuttingLoaderShow(false);
      setSaveLoaderShow(false);
      setSaveFailTipShow(false);
    }
  }, [show]);

  useEffect(() => {
    if (edited !== null) {
      setEdited(true);
      if (stopTimer.current) {
        clearTimeout(stopTimer.current);
        stopTimer.current = null;
      }
      stopTimer.current = setTimeout(() => {
        // 15 秒自动保存
        save(true);
        stopTimer.current = null;
      }, 15000);
    }

    if (imgList.length === 0) {
      sortableList.current = null;
      sorter.current = null;
    } else {
      if (!sortableList.current) initImageArea();

      if (autoScroll) {
        // 开启自动滚动时，自动滚动到尾部
        sortableList.current.scrollTo({
          top: sortableList.current.scrollHeight,
        });
      }
    }
  }, [imgList]);

  useEffect(() => {
    if ((loaderShow || cuttingLoaderShow) && stopTimer.current) {
      clearTimeout(stopTimer.current);
      stopTimer.current = null;
    }
  }, [loaderShow, cuttingLoaderShow]);

  useEffect(() => {
    setSaved && setSaved(!edited);
  }, [edited]);

  return (
    <comicToolContext.Provider
      value={{
        resourceId,
        resource,
        comicMode,
        imgList,
        dragging,
        loaderShow,
        setResource,
        setDeleteItem,
        setDeleteConfirmShow,
        setComicName,
        setComicConfig,
        setImgList,
        setLoaderShow,
        setAutoScroll,
      }}
    >
      <input
        type="file"
        id="uploadLocalImg"
        multiple={true}
        accept={UPLOAD_LOCAL_ACCEPT}
        onChange={(e: any) => {
          let target = e.target;
          uploadLocalImg(target.files!);
          target.value = '';
        }}
      />
      <input
        type="file"
        id="cutImages"
        multiple={true}
        accept={CUT_IMG_ACCEPT}
        onChange={(e: any) => {
          let target = e.target;
          cutImages(target.files!);
          target.value = '';
        }}
      />

      <div className={`comic-tool-wrapper ${show ? 'show222' : 'show111111'}`}>
        <div className="header">
          <div className="title">{FI18n.i18nNext.t('cbformatter_title')}</div>

          <div className="header-right">
            <div className="article-info">
              {saveTipType === 1 && (
                <span>{FI18n.i18nNext.t('posteditor_state_saving')}</span>
              )}
              {saveTipType === 2 && (
                <span>
                  {FI18n.i18nNext.t('posteditor_state_saved', {
                    LastEditTime: formatDate(lastSaveTime),
                  })}
                </span>
              )}
              {saveTipType === 3 && (
                <span>
                  {FI18n.i18nNext.t('posteditor_state_networkabnormal', {
                    LastEditTime: formatDate(lastSaveTime),
                  })}
                </span>
              )}
            </div>
            <div
              className={`save-btn ${
                (!edited || saveTipType === 1) && 'disabled'
              }`}
              onClick={() => save(false)}
            >
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
                className={`primary-btn ${
                  imgList.filter((item) => item.size <= MAX_IMG_SIZE).length ===
                    0 && 'disabled'
                }`}
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
                        onClick={() => {
                          deleteItem.current = null;
                          setDeleteConfirmShow(true);
                        }}
                      >
                        <i className="freelog fl-icon-shanchu delete-icon" />
                        {FI18n.i18nNext.t('cbformatter_delete_btn_deleteall')}
                      </div>
                    </div>
                  </div>
                  <div className="box-body">
                    <div id="sortableList" className="img-list">
                      {imgList.map((item, index) => {
                        return (
                          <ImgCard
                            index={index}
                            data={item}
                            visible={
                              index >= visibleIndex[0] &&
                              index < visibleIndex[1]
                            }
                            setInsertIndex={setInsertIndex}
                            cutImage={cutImage}
                            key={item.name + index}
                          />
                        );
                      })}
                    </div>
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

        {saveLoaderShow && (
          <div className="save-loader-wrapper">
            <div className="modal"></div>
            <div className="save-loader-popup">
              <div className="title">
                {FI18n.i18nNext.t('cbformatter_submit_state_processing')}
              </div>
              <div className="progress-box">
                <div
                  className="progress-bar"
                  style={{ width: saveProgress + '%' }}
                ></div>
              </div>
              <div className="desc">
                <span>
                  {FI18n.i18nNext.t(
                    'cbformatter_submit_state_processing_msg' +
                      ([2, 3, 4].includes(saveStep) ? '0' + saveStep : ''),
                  )}
                </span>
                <span className="desc-progress">[{saveStep}/4]</span>
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
