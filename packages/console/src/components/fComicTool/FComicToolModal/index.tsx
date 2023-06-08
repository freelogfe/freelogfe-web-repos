/** 漫画排版工具 */

import './index.less';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Timeout } from 'ahooks/lib/useRequest/src/types';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import { formatDate } from './utils/common';
import { IResourceCreateVersionDraftType } from '@/type/resourceTypes';
import fMessage from '@/components/fMessage';
import { Modal } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FPopover from '@/components/FPopover';
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
} from './utils/assets';
import { PreviewBox } from './components/preview-box';
const saveAs = require('file-saver');
import Sortable from 'sortablejs';
import CutDescImg from './images/cut-desc.png';
import BlueScissors from './images/blue-scissors.png';
import BlackScissors from './images/black-scissors.png';
import { Loading3QuartersOutlined } from '@ant-design/icons/lib/icons';

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

const myWindow: any = window;

export const comicToolContext = React.createContext<any>({});

const { confirm } = Modal;

/** 排版工具 */
export const ComicTool = (props: ToolProps) => {
  const { resourceId, show, close, setSaved } = props;

  const inputTimer = useRef<Timeout | null>(null);
  const stopTimer = useRef<Timeout | null>(null);
  const sorter = useRef<Sortable | null>(null);

  const [edited, setEdited] = useState(false);
  const [saveType, setSaveType] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState(0);

  const [imgList, setImgList] = useState<ImgInComicTool[]>([]);
  const [insertIndex, setInsertIndex] = useState(-1);
  const [canvasList, setCanvasList] = useState<any[]>([]);
  const [importDrawer, setImportDrawer] = useState(false);
  const [previewShow, setPreviewShow] = useState(false);
  const [loaderShow, setLoaderShow] = useState(false);
  const [cuttingLoaderShow, setCuttingLoaderShow] = useState(false);

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
    // const resourceRes = await FServiceAPI.Resource.info({
    //   resourceIdOrName: resourceId,
    // });
    // editor.resourceData = resourceRes.data;
    // const draftRes = await FServiceAPI.Resource.lookDraft({ resourceId });
    // if (draftRes.errCode !== 0) {
    //   fMessage(draftRes.msg);
    //   return;
    // }
    // editor.draftData = draftRes.data.draftData as IResourceCreateVersionDraft;
    // const {
    //   selectedFileInfo,
    //   directDependencies = [],
    //   baseUpcastResources = [],
    // } = editor.draftData;
    // const targets = [...directDependencies];
    // let dependencesByIdentify: string[] = [];
    // if (selectedFileInfo) {
    //   const content = await FUtil.Request({
    //     method: 'GET',
    //     url: `/v2/storages/files/${selectedFileInfo.sha1}/download`,
    //   });
    //   const contentStr = String(content);
    //   const html = await importDoc(
    //     { content: contentStr, type: 'draft' },
    //     editor,
    //   );
    //   setHtml(html);
    //   dependencesByIdentify = getDependencesByContent(contentStr);
    // }
    // editor.draftData.directDependencies = targets;
    // setDepTargets(editor.draftData.directDependencies);
  };

  /** 保存 */
  const save = async () => {
    // if (!editor.draftData) return;
    // setSaveType(1);
    // const saveTime = new Date().getTime();
    // let fileName = editor.draftData.selectedFileInfo?.name;
    // if (!fileName) {
    //   // 草稿数据中没有文件名称，说明是新建文件，文件名称命名规则为{资源名称 最后保存时间}
    //   fileName =
    //     editor.resourceData.resourceName.split('/')[1] +
    //     formatDate(saveTime, 'YYYYMMDDhhmm').substring(2) +
    //     '.md';
    // }
    // const params = new FormData();
    // params.append('file', new File([markdownRef.current], fileName));
    // const res = await FUtil.Request({
    //   headers: { 'Content-Type': 'multipart/form-data' },
    //   method: 'POST',
    //   url: `/v2/storages/files/upload`,
    //   data: params,
    // });
    // if (res.errCode !== 0) {
    //   fMessage(res.msg);
    //   return;
    // }
    // editor.draftData.selectedFileInfo = {
    //   name: fileName,
    //   sha1: res.data.sha1,
    //   from: `最近编辑时间 ${formatDate(saveTime)}`,
    // };
    // const saveDraftRes = await FServiceAPI.Resource.saveVersionsDraft({
    //   resourceId,
    //   draftData: editor.draftData,
    // });
    // if (saveDraftRes.errCode !== 0) {
    //   fMessage(saveDraftRes.msg);
    //   return;
    // }
    // setSaveType(2);
    // setLastSaveTime(saveTime);
    // setEdited(false);
    // if (inputTimer.current) {
    //   clearTimeout(inputTimer.current);
    //   inputTimer.current = null;
    // }
    // if (stopTimer.current) {
    //   clearTimeout(stopTimer.current);
    //   stopTimer.current = null;
    // }
  };

  /** 快捷键 */
  const keyup = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeAllPopup();
  };

  /** 关闭所有弹窗 */
  const closeAllPopup = () => {
    setPreviewShow(false);
  };

  /** 上传本地图片 */
  const uploadLocalImg = (files: FileList) => {
    if (files.length === 0) return;

    setLoaderShow(true);
    const insertPoint = insertIndex !== -1 ? insertIndex : imgList.length;
    const list = [...files];

    if (imgList.length + list.length > MAX_IMG_LENGTH) {
      fMessage(FI18n.i18nNext.t('cbformatter_add_error_qtylimitation'));
      list.splice(MAX_IMG_LENGTH - imgList.length);
    }

    const imgs: ImgInComicTool[] = [];
    let doneCount = 0;

    list.forEach((file, index) => {
      const { type, name, size } = file;

      if (!['image/png', 'image/jpeg', 'image/gif'].includes(type)) {
        fMessage(FI18n.i18nNext.t('cbformatter_add_error_format'));
        return;
      }

      if (size > MAX_IMG_SIZE) {
        const img = { name, size, base64: require('./images/oversize.png') };
        imgs[index] = img;
        doneCount++;
        if (doneCount === list.length) {
          imgList.splice(insertPoint, 0, ...imgs);
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
          imgList.splice(insertPoint, 0, ...imgs);
          setImgList([...imgList]);
          setLoaderShow(false);
        }
      };
    });
  };

  /** 上传文件 */
  const uploadFile = async (e: any) => {
    setImgList([]);

    // const JSZIP = new JSZip();
    // const zipData = await JSZIP.loadAsync(e.target.files[0]);
    // Object.keys(zipData.files).forEach((filename) => {
    //   JSZIP.files[filename]
    //     .async('base64')
    //     .then((result: any) => {
    //       console.error('done');
    //       data.imgList.push({ name: e.target.files[0].name, base64: result });
    //     })
    //     .catch((error: any) => console.error('error====>', error));
    // });

    myWindow.archiveOpenFile(e.target.files[0], (archive: any, err: any) => {
      if (archive) {
        readContents(archive);
      } else {
        console.error('no archive', err);
      }
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
    let heightTip = false; // 是否需要显示切图高度小于最小指定切图高度 tip
    let overTotal = false; // 是否已经超过最大数量限制
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      const { type, name, size } = file;

      if (!['image/png', 'image/jpeg'].includes(type)) {
        // 切图类型非指定类型
        fMessage(FI18n.i18nNext.t('cbformatter_slice_error_format'));
        return;
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
            if (!heightTip) {
              fMessage(FI18n.i18nNext.t('cbformatter_slice_error_height'));
              heightTip = true;
            }
            if (i === list.length - 1) {
              setImgList([...imgList, ...results]);
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
                setImgList([...imgList, ...results]);
                setCuttingLoaderShow(false);
              }
              break;
            }

            // 列表显示第一张切图
            if (j === 0) imgItem.base64 = base64;

            const childImg = {
              name: `${name}-${String(j + 1).padStart(2, '0')}`,
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
                if (!overTotal) {
                  fMessage(
                    FI18n.i18nNext.t('cbformatter_add_error_qtylimitation'),
                  );
                  overTotal = true;
                }
                if (i === list.length - 1) {
                  setImgList([...imgList, ...results]);
                  setCuttingLoaderShow(false);
                }
                break;
              } else {
                results[i] = imgItem;
                if (i === list.length - 1) {
                  setImgList([...imgList, ...results]);
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

        const childImg = {
          name: `${name}-${String(i + 1).padStart(2, '0')}`,
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

  /** 导出漫画文件 */
  const exportFile = () => {
    // const JSZIP = new JSZip();
    // data.imgList.forEach((item: any, index: string) => {
    //   JSZIP.file(index + '.jpg', item, { base64: true });
    // });
    // JSZIP.generateAsync({ type: 'blob' }).then((content) => {
    //   saveAs(content, 'example.zip');
    // });
  };

  /** 获取压缩包内容 */
  const readContents = (archive: { entries: any[] }) => {
    // 排序
    const entries = archive.entries.sort((a, b) => {
      const indexA = a.name.split('.')[0] * 1;
      const indexB = b.name.split('.')[0] * 1;
      return indexA - indexB;
    });

    for (var i = 0; i < entries.length; i++) {
      processEntries(entries, i, entries.length);
    }
  };

  /** 获取压缩包内容 */
  const processEntries = (entries: any[], i: number, max: number) => {
    const filename = entries[i].name;
    if (getExt(filename) != '') {
      createBlobs(entries[i], i, max);
    }
  };

  /** 将图片内容转为Blob */
  const createBlobs = (
    entry: {
      readData: (arg0: (result: BlobPart, err: any) => void) => void;
      name: any;
    },
    i: any,
    max: any,
  ) => {
    entry.readData((result: BlobPart, err: any) => {
      var blob = new Blob([result], { type: getMIME(entry.name) });
      blobToDataURI(blob, entry.name);
    });
  };

  /** 将Blob转为base64 */
  const blobToDataURI = (blob: Blob, name: any) => {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = (e: any) => {
      const img = { name, base64: e.target.result.split(',')[1] };
      // setImgList((pre) => [...pre, img]);
    };
  };

  /** 获取MIME */
  const getMIME = (filename: any) => {
    var ext = (getExt(filename) || '').toLowerCase();

    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
        break;
      case 'png':
        return 'image/png';
        break;
      case 'gif':
        return 'image/gif';
        break;
      case 'bmp':
        return 'image/bmp';
        break;
      case 'webp':
        return 'image/webp';
        break;
      default:
        return 'image/jpeg';
    }
  };

  /** 获取后缀 */
  const getExt = (filename: string) => {
    var ext = filename.split('.').pop();
    return ext == filename ? '' : ext;
  };

  useEffect(() => {
    if (show) {
      myWindow.loadArchiveFormats(['rar', 'zip', 'tar']);

      window.addEventListener('keyup', keyup);
      document.body.style.overflowY = 'hidden';

      setTimeout(() => {
        getData();
      }, 400);
    }
    return () => {
      window.removeEventListener('keyup', keyup);
      document.body.style.overflowY = 'auto';
    };
  }, [show]);

  useEffect(() => {
    if (sorter.current) return;

    const sortableList = document.getElementById('sortableList');
    if (!sortableList) return;

    sorter.current = new Sortable(sortableList, {
      animation: 150,
      handle: '.card-header',
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

  // useEffect(() => {
  // const newMarkdown = html2md(html);
  // if (markdown !== newMarkdown) {
  //   setEdited(true);
  //   markdownRef.current = newMarkdown;
  //   setMarkdown(newMarkdown);

  //   if (!inputTimer.current) {
  //     inputTimer.current = setTimeout(() => {
  //       save();
  //       inputTimer.current = null;
  //     }, 15000);
  //   }

  //   if (stopTimer.current) {
  //     clearTimeout(stopTimer.current);
  //     stopTimer.current = null;
  //   }
  //   stopTimer.current = setTimeout(() => {
  //     save();
  //     stopTimer.current = null;
  //     if (inputTimer.current) {
  //       clearTimeout(inputTimer.current);
  //       inputTimer.current = null;
  //     }
  //   }, 3000);
  // }
  // }, [html]);

  useEffect(() => {
    setSaved && setSaved(!edited);
  }, [edited]);

  return (
    <comicToolContext.Provider
      value={{ resourceId, imgList, setImgList, setLoaderShow }}
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
              {/* {saveType === 1 && (
                <span>{FI18n.i18nNext.t('posteditor_state_saving')}</span>
              )}
              {saveType === 2 && ( */}
              <span>
                {FI18n.i18nNext.t('posteditor_state_saved', {
                  LastEditTime: formatDate(lastSaveTime),
                })}
              </span>
              {/* )}
              {saveType === 3 && (
                <span>
                  {FI18n.i18nNext.t('posteditor_state_networkabnormal', {
                    LastEditTime: formatDate(lastSaveTime),
                  })}
                </span>
              )} */}
            </div>
            <div className="text-btn" onClick={save}>
              {FI18n.i18nNext.t('cbformatter_savedraft_btn')}
            </div>
            <div className="exit-btn" onClick={exit}>
              {FI18n.i18nNext.t('cbformatter_cancel_btn')}
            </div>
            <div className={`save-btn ${!edited && 'disabled'}`} onClick={save}>
              {FI18n.i18nNext.t('cbformatter_submitnquit_btn')}
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
                      <div className="clear-btn" onClick={() => setImgList([])}>
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
      </div>
    </comicToolContext.Provider>
  );
};
