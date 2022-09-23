/** 导入文档弹窗组件 */

import './index.less';
import ObjectIcon from '../../images/object.png';
import { Drawer, Popconfirm, Select, Tabs, Upload } from 'antd';
import fMessage from '@/components/fMessage';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import { useEffect, useRef, useState } from 'react';
import FInput from '@/components/FInput';
import showdown from 'showdown';

const { Option } = Select;

interface Props {
  show: boolean;
  close: () => void;
  setHtml: React.Dispatch<React.SetStateAction<string>>;
}

export const ImportDocDrawer = (props: Props) => {
  const { show, close, setHtml } = props;
  let body: Element | null = null;

  const refs = useRef({
    uploadFileData: null as any,
    pageIndex: 0,
    noMore: false,
    objectKey: '',
    bucket: '全部Bucket',
    historyKey: '',
    historyList: [],
  });
  const [uploadStatus, setUploadStatus] = useState(1);
  let [uploadFileData, setUploadFileData] = useState<any>(null);
  const [bucketList, setBucketList] = useState<string[]>([]);
  const [objectList, setObjectList] = useState<any[]>([]);
  const [historyList, setHistoryList] = useState<any[]>([]);

  useEffect(() => {
    if (!show) return;

    const drawer = document.getElementsByClassName(
      'import-doc-drawer-wrapper',
    )[0];
    body = drawer.getElementsByClassName('ant-drawer-body')[0];
    body.addEventListener('scroll', listScroll);
    getBuckets();
    getHistoryVersion();

    return () => {
      refs.current = {
        uploadFileData: null as any,
        pageIndex: 0,
        noMore: false,
        objectKey: '',
        bucket: '全部Bucket',
        historyKey: '',
        historyList: [],
      };
      setUploadStatus(1);
      setUploadFileData(null);
      body?.removeEventListener('scroll', listScroll);
    };
  }, [show]);

  /** 监听列表滚动 */
  const listScroll = () => {
    if (!body || refs.current.noMore) return;

    const { scrollHeight, scrollTop, clientHeight } = body;
    if (scrollHeight - clientHeight - scrollTop === 0) getObjects();
  };

  /** 取消导入 */
  const cancelImport = () => {
    setUploadStatus(1);
    refs.current.uploadFileData = null;
    setUploadFileData(null);
  };

  /** 确认导入 */
  const sureImport = () => {
    console.error('确认导入===>', refs.current.uploadFileData);

    showdown.setOption('tables', true);
    showdown.setOption('tasklists', true);
    showdown.setOption('simplifiedAutoLink', true);
    showdown.setOption('openLinksInNewWindow', true);
    showdown.setOption('backslashEscapesHTMLTags', true);
    showdown.setOption('emoji', true);

    const converter = new showdown.Converter();
    const html = converter.makeHtml(refs.current.uploadFileData.content);
    setHtml(html);
  };

  // const getContent = async () => {
  //   let html = "";
  //   const { exhibitProperty, dependencyTree } = props.data.versionInfo;
  //   if (exhibitProperty.mime === "text/markdown") {
  //     // markdown 文件，以 markdown 解析
  //     const converter = new showdown.Converter();
  //     html = converter.makeHtml(props.data.content);
  //   } else {
  //     html = props.data.content;
  //     html = html.replace(/\n/g, "<br/>");
  //   }

  //   const deps = dependencyTree.filter((_: any, index: number) => index !== 0);
  //   let promiseArr = [] as Promise<any>[];
  //   deps.forEach((dep: { resourceType: string; parentNid: any; articleId: any }) => {
  //     const isMediaResource =
  //       dep.resourceType.includes("图片") || dep.resourceType.includes("视频") || dep.resourceType.includes("音频");
  //     const depContent: Promise<any> = getExhibitDepFileStream(
  //       props.data.exhibitId,
  //       dep.parentNid,
  //       dep.articleId,
  //       isMediaResource
  //     );
  //     promiseArr.push(depContent);
  //   });

  //   await Promise.all(promiseArr).then((res) => {
  //     res.forEach((dep, index) => {
  //       if (dep.data) {
  //         // 进一步判断是否为文本文件
  //         if (!dep.headers["content-type"].startsWith("text")) return;

  //         // 返回数据是对象，且有data属性，说明该依赖为非媒体资源
  //         const reg = new RegExp("{{" + `freelog://${deps[index].articleName}` + "}}", "g");
  //         const converter = new showdown.Converter();
  //         const data = converter.makeHtml(dep.data);
  //         html = html.replace(reg, data);
  //       } else {
  //         // 媒体资源
  //         const reg = new RegExp("src=['\"]" + `freelog://${deps[index].articleName}` + "['\"]", "g");
  //         html = html.replace(reg, `id="${deps[index].articleId}" src="${dep}"`);
  //       }
  //     });
  //   });

  //   content.value = html;

  //   nextTick(() => {
  //     const elements = [...contentBody.value.children];
  //     const titles = elements.filter((item: HTMLElement) => ["H1", "H2", "H3"].includes(item.nodeName));
  //     context.emit("getDirectory", titles);

  //     videoPlayDuration();
  //   });
  // };

  /** 上传文件 */
  const uploadFile = (info: any) => {
    const { status, name } = info.file;
    if (status === 'uploading') {
      if (uploadStatus === 1) setUploadStatus(2);
    } else if (status === 'done') {
      setTimeout(() => {
        setUploadStatus(3);
        setTimeout(() => {
          setUploadStatus(4);
        }, 400);
      }, 500);
      const fileReader = new FileReader();
      fileReader.readAsText(info.file.originFileObj);
      fileReader.onload = (e: any) => {
        const { result } = e.target;
        refs.current.uploadFileData = { name, content: result };
        setUploadFileData(refs.current.uploadFileData);
      };
    } else if (status === 'error') {
      setUploadStatus(1);
      fMessage('上传失败', 'error');
    }
  };

  /** 获取用户的存储空间 */
  const getBuckets = async () => {
    const res = await FServiceAPI.Storage.bucketList({ bucketType: 1 });
    const bucketList = res.data.map(
      (item: { bucketName: string }) => item.bucketName,
    );
    bucketList.unshift('全部Bucket');
    setBucketList(bucketList);
    getObjects(true);
  };

  /** 获取存储空间对应桶的阅读类型资源 */
  const getObjects = async (init = false) => {
    refs.current.pageIndex = init ? 0 : refs.current.pageIndex + 1;

    const params = {
      skip: refs.current.pageIndex * 20,
      limit: 20,
      bucketName:
        refs.current.bucket === '全部Bucket' ? '_all' : refs.current.bucket,
      mime: 'text',
      keywords: refs.current.objectKey,
    };
    const res = await FServiceAPI.Storage.objectList(params);
    const { dataList } = res.data;
    refs.current.noMore = dataList.length === 0;
    setObjectList((pre) => (init ? dataList : [...pre, ...dataList]));
  };

  /** 获取历史版本 */
  const getHistoryVersion = async () => {
    const res = await FUtil.Request({
      method: 'GET',
      url: `/v2/resources/${'629f195b2fbdf6002fa290ac'}/versions`,
      params: { projection: 'versionId,version,updateDate,filename' },
    });
    refs.current.historyList = res.data.reverse();
    searchHistoryList();
  };

  /** 搜索历史版本 */
  const searchHistoryList = () => {
    const list = refs.current.historyList.filter((item: any) => {
      return (
        item.version.includes(refs.current.historyKey) ||
        item.filename.includes(refs.current.historyKey)
      );
    });
    setHistoryList(list);
  };

  /** 从存储对象导入文档 */
  const importFromObject = async (item: {
    objectId: string;
    objectName: string;
  }) => {
    const { objectId, objectName } = item;
    const res = await FUtil.Request({
      method: 'GET',
      url: `/v2/storages/objects/${objectId}/file`,
    });
    refs.current.uploadFileData = { name: objectName, content: res };
    setUploadFileData(refs.current.uploadFileData);
    sureImport();
  };

  /** 从版本导入文档 */
  const importFromHistory = async (item: {
    version: string;
    filename: string;
  }) => {
    const { version, filename } = item;
    const res = await FUtil.Request({
      method: 'GET',
      url: `/v2/resources/${'629f195b2fbdf6002fa290ac'}/versions/${version}/download`,
    });
    refs.current.uploadFileData = { name: filename, content: res };
    setUploadFileData(refs.current.uploadFileData);
    sureImport();
  };

  /** tab 选项卡区域列表 */
  const tabItems = [
    {
      label: FI18n.i18nNext.t('importpost_tab_fromlocal'),
      key: 'upload',
      children: (
        <div className="upload-area">
          <div className={`upload-box ${uploadStatus === 1 && 'normal'}`}>
            <div className="tip">
              {FI18n.i18nNext.t('msg_import_post_from_local')}
            </div>
            <div className="warning">
              {FI18n.i18nNext.t('msg_import_post_from_local_02')}
            </div>
            <Upload
              showUploadList={false}
              onChange={uploadFile}
              accept=".md,.txt"
            >
              <div className="upload-btn">
                {FI18n.i18nNext.t('btn_upload_local_file')}
              </div>
            </Upload>
          </div>
          {uploadStatus > 1 && (
            <>
              <div
                className={`upload-icon  ${
                  [3, 4].includes(uploadStatus) && 'uploaded'
                }`}
              >
                <div className="sector-box">
                  <div className="sector"></div>
                </div>
                <div className="modal"></div>
                <div className="icon-box">
                  <img className="icon-png" src={ObjectIcon} />
                </div>
              </div>
              {uploadStatus === 2 && (
                <div className="uploading-tip">
                  {FI18n.i18nNext.t('upload_state_uploading')}
                </div>
              )}
              {[3, 4].includes(uploadStatus) && (
                <div
                  className={`uploaded-box ${
                    uploadStatus === 3 && 'animation'
                  }`}
                >
                  <div className="uploaded-tip">
                    <i className="freelog fl-icon-a-chenggongzhengqueduigou1"></i>
                    <div className="tip-text">
                      {FI18n.i18nNext.t('uploadfile_state_uploaded')}
                    </div>
                    <div className="file-name">{uploadFileData.name}</div>
                  </div>
                  <div className="warning">
                    <i className="freelog fl-icon-warningxiaochicun"></i>
                    <div className="warning-text">
                      {FI18n.i18nNext.t('msg_import_post_from_local_03')}
                    </div>
                  </div>
                  <div className="btns">
                    <div className="cancel-btn" onClick={cancelImport}>
                      {FI18n.i18nNext.t('btn_cancel')}
                    </div>
                    <div className="import-btn" onClick={sureImport}>
                      {FI18n.i18nNext.t('btn_import_post')}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
    {
      label: FI18n.i18nNext.t('importpost_tab_fromstorage'),
      key: 'bucket',
      children: (
        <div className="buckets-area">
          <div className="header">
            <Select
              className="bucket-select"
              value={refs.current.bucket}
              onChange={(e) => {
                refs.current.bucket = e;
                getObjects(true);
              }}
            >
              {bucketList.map((item) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </Select>
            <FInput
              value={refs.current.objectKey}
              debounce={300}
              allowClear={true}
              onDebounceChange={(e) => {
                refs.current.objectKey = (e || '').trim();
                getObjects(true);
              }}
              theme="dark"
            />
          </div>
          <div className="title">
            {FI18n.i18nNext.t('posteditor_insert_label_objectlist_post')}
          </div>
          {objectList.length === 0 && refs.current.noMore && (
            <div className="no-data-box">
              <div className="no-data-tip">
                <i className="freelog fl-icon-liebiaoweikong"></i>
                <div className="tip">
                  {FI18n.i18nNext.t('msg_empty_general')}
                </div>
              </div>
            </div>
          )}
          {objectList.map((item) => (
            <div className="object-item" key={item.objectId}>
              <div className="info-area">
                <div className="object-name">{`${item.bucketName}/${item.objectName}`}</div>
                <div className="other-info">{`${FI18n.i18nNext.t(
                  'label_last_updated',
                )} ${FUtil.Format.formatDateTime(item.updateDate, true)}`}</div>
              </div>

              <Popconfirm
                placement="bottomRight"
                title={FI18n.i18nNext.t('confirmation_import_post')}
                onConfirm={() => importFromObject(item)}
                okText={FI18n.i18nNext.t('btn_import_post')}
                cancelText={FI18n.i18nNext.t('btn_cancel')}
              >
                <div className="choose-btn">
                  {FI18n.i18nNext.t('btn_import_post')}
                </div>
              </Popconfirm>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: FI18n.i18nNext.t('importpost_tab_fromreleasedversions'),
      key: 'history',
      children: (
        <div className="history-area">
          <FInput
            wrapClassName="search-input"
            value={refs.current.historyKey}
            debounce={300}
            allowClear={true}
            onDebounceChange={(e) => {
              refs.current.historyKey = (e || '').trim();
              searchHistoryList();
            }}
            theme="dark"
          />
          {historyList.map((item) => (
            <div className="history-item" key={item.versionId}>
              <div className="info-area">
                <div className="version">{item.version}</div>
                <div className="other-info">
                  <span>
                    {`${FI18n.i18nNext.t(
                      'label_last_updated',
                    )} ${FUtil.Format.formatDateTime(item.updateDate, true)}`}
                  </span>
                  <span>{item.filename}</span>
                </div>
              </div>

              <Popconfirm
                placement="bottomRight"
                title={FI18n.i18nNext.t('confirmation_import_post')}
                onConfirm={() => importFromHistory(item)}
                okText={FI18n.i18nNext.t('btn_import_post')}
                cancelText={FI18n.i18nNext.t('btn_cancel')}
              >
                <div className="choose-btn">
                  {FI18n.i18nNext.t('btn_import_post')}
                </div>
              </Popconfirm>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Drawer
      className="import-doc-drawer-wrapper"
      width={700}
      title={FI18n.i18nNext.t('title_import_post')}
      closable={false}
      open={show}
      onClose={close}
      extra={<i className="freelog fl-icon-guanbi close-btn" onClick={close} />}
      destroyOnClose
    >
      <Tabs items={tabItems} />
    </Drawer>
  );
};
