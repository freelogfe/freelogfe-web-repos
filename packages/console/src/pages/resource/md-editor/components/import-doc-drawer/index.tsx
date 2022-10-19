/** 导入文档弹窗组件 */

import './index.less';
import ObjectIcon from '../../images/object.png';
import { Drawer, Popconfirm, Popover, Select, Tabs, Upload } from 'antd';
import fMessage from '@/components/fMessage';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import { useEffect, useRef, useState } from 'react';
import FInput from '@/components/FInput';
import showdown from 'showdown';
import { ObjectItem } from '../object-item';
import FUpload from '@/components/FUpload';
import { RcFile } from 'antd/lib/upload/interface';
import FModal from '@/components/FModal';
import FComponentsLib from '@freelog/components-lib';

const { Option } = Select;

showdown.setOption('tables', true);
showdown.setOption('tasklists', true);
showdown.setOption('simplifiedAutoLink', true);
showdown.setOption('openLinksInNewWindow', true);
showdown.setOption('backslashEscapesHTMLTags', true);
showdown.setOption('emoji', true);

const converter = new showdown.Converter();

interface Props {
  show: boolean;
  close: () => void;
  setHtml: React.Dispatch<React.SetStateAction<string>>;
  editor: any;
}

export const ImportDocDrawer = (props: Props) => {
  const { show, close, setHtml, editor } = props;
  let body: Element | null = null;

  const refs = useRef({
    uploadFileData: null as any,
    pageIndex: 0,
    noMore: false,
    bucket: '全部Bucket',
    uploadBucket: null as string | null,
    objectKey: '',
    uploadQueue: [] as any[],
    successList: [] as string[],
    historyKey: '',
    historyList: [],
  });
  const [uploadStatus, setUploadStatus] = useState(1);
  let [uploadFileData, setUploadFileData] = useState<any>(null);
  const [bucketList, setBucketList] = useState<string[]>([]);
  const [uploadBucket, setUploadBucket] = useState<string | null>(null);
  const [createBucketShow, setCreateBucketShow] = useState(false);
  const [newBucketName, setNewBucketName] = useState('');
  const [newBucketError, setNewBucketError] = useState(0);
  const [uploadPopShow, setUploadPopShow] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<any[]>([]);
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
        bucket: '全部Bucket',
        uploadBucket: null,
        objectKey: '',
        uploadQueue: refs.current.uploadQueue,
        successList: [],
        historyKey: '',
        historyList: [],
      };
      setUploadStatus(1);
      setUploadFileData(null);
      setUploadBucket(null);
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
  const uploadLocalFile = (info: any) => {
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
    dataList.forEach((item: any) => {
      item.uploadStatus = refs.current.successList.includes(item.sha1)
        ? 'success'
        : '';
    });
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

  /** 修改新的存储空间名称 */
  const changeNewBucketName = async (name: string) => {
    setNewBucketName(name);

    if (!FUtil.Regexp.BUCKET_NAME.test(name)) {
      setNewBucketError(1);
      return;
    }

    const params: Parameters<typeof FServiceAPI.Storage.bucketIsExist>[0] = {
      bucketName: name,
    };
    const result = await FServiceAPI.Storage.bucketIsExist(params);
    if (result.data) {
      setNewBucketError(2);
      return;
    }

    setNewBucketError(0);
  };

  /** 创建存储空间 */
  const createBucket = async () => {
    const params: Parameters<typeof FServiceAPI.Storage.createBucket>[0] = {
      bucketName: newBucketName,
    };
    const result = await FServiceAPI.Storage.createBucket(params);
    setCreateBucketShow(false);
    getBuckets();
  };

  /** 上传文件前整理队列 */
  const beforeUpload = async (fileList: RcFile[]) => {
    // 是否有超过大小限制的文件
    const IS_EXSIT_BIG_FILE =
      fileList.filter((item) => item.size > 200 * 1024 * 1024).length > 0;
    if (IS_EXSIT_BIG_FILE) {
      fMessage('单个文件不能大于 200 M', 'warning');
      return;
    }

    // 获取当前存储空间内存情况
    const spaceResult = await FServiceAPI.Storage.spaceStatistics();
    const { storageLimit, totalFileSize } = spaceResult.data;
    const totalSize: number = fileList
      .map((item) => item.size)
      .reduce((pre, cur) => pre + cur, 0);
    if (storageLimit - totalFileSize < totalSize) {
      fMessage('超出储存', 'warning');
      return;
    }

    setUploadPopShow(false);

    // 整理上传任务队列
    const uploadTaskQueue = await Promise.all(
      fileList.map(async (file) => ({
        uid: file.uid,
        sha1: await FUtil.Tool.getSHA1Hash(file),
        bucketName: refs.current.uploadBucket,
        name: file.name.replace(/[\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#]/g, '_'),
        file: file,
        uploadStatus: 'uploading',
        progress: 0,
        exist: false,
        sameName: false,
      })),
    );

    // 确认上传文件是否存在
    const fileExistResult = await FServiceAPI.Storage.fileIsExist({
      sha1: uploadTaskQueue.map((file) => file.sha1).join(),
    });
    const existFileList: string[] = fileExistResult.data
      .filter((d: any) => d.isExisting)
      .map((d: any) => d.sha1);

    // 确认文件名称是否存在
    const objectResult = await FServiceAPI.Storage.batchObjectList({
      fullObjectNames: uploadTaskQueue
        .map((p) => p.bucketName + '/' + p.name)
        .join(),
      projection: 'objectId,objectName',
    });
    const existNameList: string[] = objectResult.data.map(
      (d: any) => d.objectName,
    );

    const queue = [
      ...uploadTaskQueue.map((file) => ({
        ...file,
        exist: existFileList.includes(file.sha1),
        sameName: existNameList.includes(file.name),
      })),
    ];
    uploadFile(queue);
  };

  /** 上传文件 */
  const uploadFile = async (queue: any[]) => {
    refs.current.uploadQueue = [...queue, ...refs.current.uploadQueue];
    setUploadQueue([...refs.current.uploadQueue]);
    refs.current.uploadQueue.forEach((task) => uploadCreate(task));
  };

  /** 上传并创建存储对象 */
  const uploadCreate = async (task: any, reUpload = false) => {
    const index = refs.current.uploadQueue.findIndex(
      (item) => item.uid === task.uid,
    );
    if (reUpload) {
      refs.current.uploadQueue[index].uploadStatus = 'uploading';
      setUploadQueue([...refs.current.uploadQueue]);
    }

    if (refs.current.uploadQueue[index].uploadStatus !== 'uploading') return;

    if (task.sameName && !reUpload) {
      // 重名
      refs.current.uploadQueue[index].uploadStatus = 'repeatName';
      setUploadQueue([...refs.current.uploadQueue]);
      return;
    }

    if (!task.exist) {
      // 文件不存在，先上传文件
      const [promise, cancel]: any = FServiceAPI.Storage.uploadFile(
        { file: task.file },
        {
          onUploadProgress(progressEvent) {
            const progress = Math.floor(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            refs.current.uploadQueue[index].progress = progress;
            setUploadQueue([...refs.current.uploadQueue]);
          },
        },
        true,
      );
      refs.current.uploadQueue[index].cancel = cancel;
      try {
        await promise;
      } catch (e) {
        if (refs.current.uploadQueue[index].uploadStatus !== 'cancel') {
          refs.current.uploadQueue[index].uploadStatus = 'fail';
          refs.current.uploadQueue[index].progress = 0;
          setUploadQueue([...refs.current.uploadQueue]);
        }
      }
    }

    if (refs.current.uploadQueue[index].uploadStatus !== 'uploading') return;

    const result = await FServiceAPI.recombination.getFilesSha1Info({
      sha1: [task.sha1],
    });

    if (
      result.result[0].state !== 'success' &&
      refs.current.uploadQueue[index].uploadStatus !== 'cancel'
    ) {
      refs.current.uploadQueue[index].uploadStatus = 'fail';
      refs.current.uploadQueue[index].progress = 0;
      setUploadQueue([...refs.current.uploadQueue]);
      return;
    }

    const createResult = await FServiceAPI.Storage.createObject({
      bucketName: refs.current.uploadQueue[index].bucketName,
      objectName: task.name,
      sha1: task.sha1,
    });

    if (createResult.errCode === 0) {
      refs.current.uploadQueue.splice(index, 1);
      setUploadQueue([...refs.current.uploadQueue]);
      refs.current.successList.push(task.sha1);
      getObjects(true);
    } else {
      refs.current.uploadQueue[index].uploadStatus = 'fail';
      refs.current.uploadQueue[index].progress = 0;
      setUploadQueue([...refs.current.uploadQueue]);
    }
  };

  /** 重新上传 */
  const againUpload = async (task: any) => {
    const index = refs.current.uploadQueue.findIndex(
      (item) => item.uid === task.uid,
    );

    // 确认文件名称是否存在
    const result = await FServiceAPI.Storage.batchObjectList({
      fullObjectNames: task.bucketName + '/' + task.name,
      projection: 'objectId,objectName',
    });
    if (result.data.length) {
      refs.current.uploadQueue[index].uploadStatus = 'repeatName';
      setUploadQueue([...refs.current.uploadQueue]);
    } else {
      uploadCreate(task, true);
    }
  };

  /** 取消上传 */
  const cancelUpload = (uid: string) => {
    const index = refs.current.uploadQueue.findIndex(
      (item) => item.uid === uid,
    );
    refs.current.uploadQueue[index].cancel();
    refs.current.uploadQueue[index].uploadStatus = 'cancel';
    refs.current.uploadQueue[index].progress = 0;
    setUploadQueue([...refs.current.uploadQueue]);
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
              onChange={uploadLocalFile}
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
            <div className="left-header">
              <Select
                className="bucket-select"
                value={refs.current.bucket}
                onChange={(e) => {
                  refs.current.bucket = e;
                  refs.current.uploadBucket = e === '全部Bucket' ? null : e;
                  setUploadBucket(e === '全部Bucket' ? null : e);
                  getObjects(true);
                }}
              >
                {['全部Bucket', ...bucketList].map((item) => (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                ))}
              </Select>

              <Popover
                open={uploadPopShow}
                onOpenChange={(e) => setUploadPopShow(e)}
                placement="bottomLeft"
                trigger="click"
                title={null}
                content={
                  <div className="md-upload-bucket-selector">
                    {bucketList.length ? (
                      <>
                        <div className="tip">
                          {FI18n.i18nNext.t('msg_posteditor_upload_object')}
                        </div>
                        <Select
                          className="selector"
                          placeholder={FI18n.i18nNext.t(
                            'insert_fromstorage_select_bucket_hint',
                          )}
                          value={uploadBucket}
                          onChange={(e) => {
                            refs.current.uploadBucket = e;
                            setUploadBucket(e);
                          }}
                          dropdownRender={(menu) => (
                            <>
                              {menu}
                              {bucketList.length < 5 && (
                                <div
                                  className="create-bucket-btn"
                                  onClick={() => {
                                    setUploadPopShow(false);
                                    setCreateBucketShow(true);
                                  }}
                                >
                                  <i className="freelog fl-icon-tianjia"></i>
                                  <div>
                                    {FI18n.i18nNext.t(
                                      'posteditor_insert_btn_createbucket',
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        >
                          {bucketList.map((item) => (
                            <Option value={item} key={item}>
                              {item}
                            </Option>
                          ))}
                        </Select>
                        <div className="btn-box">
                          <FUpload
                            showUploadList={false}
                            multiple={true}
                            beforeUpload={(
                              file: RcFile,
                              fileList: RcFile[],
                            ) => {
                              if (file === fileList[fileList.length - 1]) {
                                beforeUpload(fileList);
                              }
                              return false;
                            }}
                            accept=".md,.txt"
                            disabled={!refs.current.uploadBucket}
                          >
                            <div
                              className={`btn ${
                                !refs.current.uploadBucket && 'disabled'
                              }`}
                            >
                              {FI18n.i18nNext.t('btn_done')}
                            </div>
                          </FUpload>
                        </div>
                      </>
                    ) : (
                      <div className="no-bucket-box">
                        <div className="tip">
                          {FI18n.i18nNext.t('posteditor_insert_no_bucket')}
                        </div>
                        <div
                          className="btn"
                          onClick={() => {
                            setUploadPopShow(false);
                            setCreateBucketShow(true);
                          }}
                        >
                          {FI18n.i18nNext.t(
                            'posteditor_insert_btn_createbucket02',
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                }
              >
                <div className="upload-btn">
                  <i className="freelog fl-icon-shangchuanfengmian"></i>
                  <div className="btn-text">
                    {FI18n.i18nNext.t('btn_upload_new_post')}
                  </div>
                </div>
              </Popover>
            </div>
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
          {uploadQueue
            .filter(
              (item) =>
                refs.current.bucket === '全部Bucket' ||
                item.bucketName === refs.current.bucket,
            )
            .map((item) => (
              <ObjectItem
                key={item.uid}
                data={item}
                cancel={(uid: string) => cancelUpload(uid)}
                upload={(task: any) => againUpload(task)}
                update={(task: any) => uploadCreate(task, true)}
              ></ObjectItem>
            ))}
          {objectList.map((item) => (
            <ObjectItem
              key={item.objectId}
              data={item}
              importFile={importFromObject}
            ></ObjectItem>
          ))}

          <FModal
            title={null}
            open={createBucketShow}
            width={640}
            zIndex={1060}
            okButtonProps={{
              disabled: !newBucketName || !!newBucketError,
            }}
            cancelText={FI18n.i18nNext.t('btn_cancel')}
            onOk={createBucket}
            onCancel={() => {
              setCreateBucketShow(false);
            }}
          >
            <div style={{ padding: 20 }}>
              <FComponentsLib.FTitleText
                text={FI18n.i18nNext.t('create_bucket_popup_title')}
                type="h2"
              />
            </div>

            <div className="create-bucket-popup">
              <div style={{ height: 50 }} />
              <div className="tip">
                {FI18n.i18nNext
                  .t('create_bucket_popup_msg')
                  .split('\n')
                  .map((s, i) => {
                    return <div key={i}>{s}</div>;
                  })}
              </div>
              <div style={{ height: 10 }} />
              <FInput
                value={newBucketName}
                placeholder={FI18n.i18nNext.t('enter_bucket_name')}
                debounce={300}
                onDebounceChange={(value) => {
                  changeNewBucketName(value);
                }}
                wrapClassName="input"
                errorText={
                  newBucketError === 1 ? (
                    <div>
                      {FI18n.i18nNext
                        .t('naming_convention_bucket_name')
                        .split('\n')
                        .map((s, i) => {
                          return <div key={i}>{s}</div>;
                        })}
                    </div>
                  ) : newBucketError === 2 ? (
                    '存储空间名称重复'
                  ) : (
                    ''
                  )
                }
              />
              <div style={{ height: 100 }} />
            </div>
          </FModal>
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
