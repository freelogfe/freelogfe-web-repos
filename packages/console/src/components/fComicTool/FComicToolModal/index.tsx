/** 漫画排版工具 */

import './index.less';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Timeout } from 'ahooks/lib/useRequest/src/types';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import { formatDate } from './core/common';
import { IResourceCreateVersionDraft } from '@/type/resourceTypes';
import fMessage from '@/components/fMessage';
import { Modal } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FPopover from '@/components/FPopover';
import { ImgInComicTool } from './core/interface';
const saveAs = require('file-saver');

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

export const editorContext = React.createContext<any>({});

const { confirm } = Modal;

/** 排版工具 */
export const ComicTool = (props: ToolProps) => {
  const { resourceId, show, close, setSaved } = props;

  const inputTimer = useRef<Timeout | null>(null);
  const stopTimer = useRef<Timeout | null>(null);

  const [edited, setEdited] = useState(false);
  const [saveType, setSaveType] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState(0);
  const [imgList, setImgList] = useState<ImgInComicTool[]>([]);
  const [canvasList, setCanvasList] = useState<any[]>([]);

  /** 最大图片大小（20MB） */
  const MAX_IMG_SIZE = 1024 * 1024 * 20;

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
  const closeAllPopup = () => {};

  /** 换算图片大小 */
  const conversionSize = (size: number) => {
    if (size < 1024) return `${size}B`;

    if (size >= 1024 * 1024) {
      return `${Math.floor((size / 1024 / 1024) * 100) / 100}MB`;
    } else {
      return `${Math.floor((size / 1024) * 100) / 100}KB`;
    }
  };

  /** 格式化图片名称（超长时中间部分省略，并保证尾部显示不含后缀名至少四位字符） */
  const formatName = (name: string) => {
    const _div = document.createElement('div');
    _div.innerText = name;
    _div.style.fontSize = '12px';
    _div.style.position = 'absolute';
    document.body.appendChild(_div);
    if (_div.clientWidth < 200) {
      return name;
    } else {
      const [filename, suffix] = name.split('.');
      const lastWords = '...' + filename.slice(-4) + '.' + suffix;
      for (let i = 0; i < filename.length; i++) {
        const newName = filename.slice(0, i + 1) + lastWords;
        _div.innerText = newName;
        if (_div.clientWidth > 200) return filename.slice(0, i) + lastWords;
      }
    }
    document.body.removeChild(_div);
  };

  /** 上传本地图片 */
  const uploadLocalImg = (files: FileList) => {
    if (imgList.length + files.length > 2) {
      fMessage(FI18n.i18nNext.t('cbformatter_add_error_qtylimitation'));
      return;
    }

    let list: ImgInComicTool[] = [];
    let doneCount = 0;

    [...files].forEach((file, index) => {
      const { type, name, size } = file;

      if (!['image/png', 'image/jpeg'].includes(type)) {
        fMessage(FI18n.i18nNext.t('cbformatter_add_error_format'));
        return;
      }

      if (size > MAX_IMG_SIZE) {
        const img = { name, size, base64: require('./images/oversize.png') };
        list[index] = img;
        doneCount++;
        if (doneCount === files.length) setImgList((pre) => [...pre, ...list]);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (evt) => {
        const base64: string = evt!.target!.result as string;
        const img = { name, size, base64 };
        list[index] = img;
        doneCount++;
        if (doneCount === files.length) setImgList((pre) => [...pre, ...list]);
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

  /** 切图 */
  const cutImage = (e: any) => {
    console.time('first');
    console.log('开始切图...');
    setCanvasList([]);
    const file = e.target.files[0];
    if (file.type != 'image/png' && file.type != 'image/jpeg') {
      console.log('请上传正确的文件类型');
    }
    if (file.size > 5 * 1024 * 1024) {
      console.log('图片文件过大');
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const image = new Image();
    reader.onload = (evt) => {
      const replaceSrc: string = evt!.target!.result as string;
      image.src = replaceSrc;
      image.onload = () => {
        const { width, height } = image;
        const MAX_HEIGHT_PER_PIECE = 2000;
        const pieceNum = Math.ceil(height / MAX_HEIGHT_PER_PIECE);
        const list: string[] = [];
        for (let i = 0; i < pieceNum; i++) {
          list.push(`${e.target.files[0].name.split('.')[0]}${i + 1}.jpg`);
        }
        setCanvasList(list);
        setTimeout(() => {
          const heightPerPiece = height / pieceNum;
          for (let i = 0; i < list.length; i++) {
            const canvas: any = document.getElementById(list[i]);
            canvas.width = 300;
            canvas.height = (300 / width) * heightPerPiece;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(
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
          }
          console.timeEnd('first');
          console.log('切图完成');
        }, 0);
      };
    };
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
    <editorContext.Provider value={{ resourceId }}>
      <input
        type="file"
        id="file"
        multiple={true}
        accept=".jpg,.jpeg,.png"
        onChange={(e) => uploadLocalImg(e.target.files!)}
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
                  className="primary-btn"
                  onClick={() => {
                    document.getElementById('file')?.click();
                  }}
                >
                  {FI18n.i18nNext.t('cbformatter_add_btn')}
                </div>
                <div className="text-btn" onClick={save}>
                  <i className="freelog fl-icon-daoruwendang" />
                  {FI18n.i18nNext.t('cbformatter_import_btn')}
                </div>
                <div className="text-btn" onClick={save}>
                  <i className="freelog fl-icon-jiandao" />
                  {FI18n.i18nNext.t('cbformatter_batchslice_btn')}
                </div>
                <FPopover
                  overlayInnerStyle={{
                    width: '320px',
                    borderRadius: '4px',
                    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.2)',
                    padding: '8px 4px',
                    boxSizing: 'border-box',
                    transform: 'translateX(-12px)',
                  }}
                  placement="rightTop"
                  content={
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        style={{
                          width: '104px',
                          height: '80px',
                        }}
                        src=""
                      />
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#222222',
                          lineHeight: '17px',
                          marginTop: '20px',
                        }}
                      >
                        {FI18n.i18nNext.t('cbformatter_slice_info')}
                      </div>
                    </div>
                  }
                >
                  <FComponentsLib.FIcons.FInfo className="info-icon" />
                </FPopover>
              </div>
              <div
                className={`primary-btn ${imgList.length === 0 && 'disabled'}`}
                onClick={save}
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
                  <div className="box-header">
                    <div className="total">
                      {FI18n.i18nNext.t(`共${imgList.length}张图片`)}
                    </div>
                    <div className="clear-btn" onClick={() => setImgList([])}>
                      <i className="freelog fl-icon-shanchu delete-icon" />
                      {FI18n.i18nNext.t('清空')}
                    </div>
                  </div>
                  <div className="box-body">
                    {imgList.map((item, index) => {
                      return (
                        <div className="img-card" key={item.name}>
                          <div className="card-main">
                            <div
                              className={`card-header ${
                                item.size > MAX_IMG_SIZE && 'oversize'
                              }`}
                            >
                              <div className="order">{index + 1}</div>
                              <div className="size">
                                {conversionSize(item.size)}
                              </div>
                              <i className="freelog fl-icon-tuodong dragger" />
                              <div className="drag-tip">
                                {FI18n.i18nNext.t('按住可拖拽排序')}
                              </div>
                            </div>
                            <div className="card-body">
                              {item.size <= MAX_IMG_SIZE ? (
                                <img className="img" src={item.base64} />
                              ) : (
                                <div className="oversize-box">
                                  <img
                                    className="oversize-img"
                                    src={item.base64}
                                  />
                                  <div className="oversize-tip">
                                    {FI18n.i18nNext.t('单张图片不超过20MB')}
                                  </div>
                                </div>
                              )}

                              <div className="cut-mark">
                                <i className="freelog fl-icon-jiandao" />
                                {FI18n.i18nNext.t('已切图')}
                              </div>
                              <div className="operate-btns">
                                <div className="btn">
                                  <i className="freelog fl-icon-jiandao" />
                                  <div className="btn-name">
                                    {FI18n.i18nNext.t('切图')}
                                  </div>
                                </div>
                                {/* <div className="btn">
                                <i className="freelog fl-icon-jiandao" />
                                <div className="btn-name">
                                  {FI18n.i18nNext.t('查看切图详情')}
                                </div>
                              </div> */}
                                <div className="btn">
                                  <i className="freelog fl-icon-shanchu" />
                                  <div className="btn-name">
                                    {FI18n.i18nNext.t('删除')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="name">{formatName(item.name)}</div>
                          <div className="insert-btn pre">
                            <i className="freelog fl-icon-tianjia" />
                            <div className="insert-tip">
                              {FI18n.i18nNext.t('向左侧插入图片')}
                            </div>
                          </div>
                          <div className="insert-btn next">
                            <i className="freelog fl-icon-tianjia" />
                            <div className="insert-tip">
                              {FI18n.i18nNext.t('向右侧插入图片')}
                            </div>
                          </div>
                        </div>
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

        {/* <div className="test-wrapper">
          <div className="btns">
            <input type="file" id="file" onChange={uploadFile} />
            <button className="btn" onClick={exportFile}>
              导出漫画文件
            </button>
          </div>

          <div className="img-list">
            {canvasList.map((item) => {
              return (
                <div className="comic-img" key={item}>
                  <canvas id={item}></canvas>
                  <div className="name">{item}</div>
                </div>
              );
            })}
            {imgList.map((item) => {
              return (
                <div className="comic-img" key={item.name}>
                  <img
                    className="img"
                    src={'data:image/jpg;base64,' + item.base64}
                  />
                  <div className="name">{item.name}</div>
                </div>
              );
            })}
          </div>
        </div> */}
      </div>
    </editorContext.Provider>
  );
};
