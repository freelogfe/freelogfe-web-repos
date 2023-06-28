/** 导入漫画文件组件 */

import './index.less';
import ObjectIcon from '../../images/object.png';
import { Drawer, Popconfirm, Popover, Select, Tabs } from 'antd';
import fMessage from '@/components/fMessage';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import { useContext, useEffect, useRef, useState } from 'react';
import FInput from '@/components/FInput';
import { ObjectItem } from '../object-item';
import FUpload from '@/components/FUpload';
import { RcFile } from 'antd/lib/upload/interface';
import FModal from '@/components/FModal';
import FComponentsLib from '@freelog/components-lib';
import { comicToolContext } from '../..';
import { getExt } from '../../utils/common';
import { uncompressComicArchive } from '../../core/import-comic';

const { Option } = Select;

interface Props {
  show: boolean;
  close: () => void;
}

export const ImportDrawer = (props: Props) => {
  const {
    resourceId,
    resource,
    setComicName,
    setComicConfig,
    setImgList,
    setLoaderShow,
  } = useContext(comicToolContext);
  const { show, close } = props;
  let body: Element | null = null;

  const refs = useRef({
    uploadFileData: null as any,
    pageIndex: 0,
    noMore: false,
    bucket: FI18n.i18nNext.t('cbformatter_import_filter_allobjects'),
    uploadBucket: null as string | null,
    objectKey: '',
    uploadQueue: [] as any[],
    successList: [] as string[],
    historyKey: '',
    historyList: [],
  });
  const [uploadStatus, setUploadStatus] = useState(1);
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

    setUploadStatus(1);
    const drawer = document.getElementsByClassName('import-drawer-wrapper')[0];
    body = drawer.getElementsByClassName('ant-drawer-body')[0];
    body.addEventListener('scroll', listScroll);
    getBuckets();
    getHistoryVersion();

    return () => {
      refs.current = {
        uploadFileData: null as any,
        pageIndex: 0,
        noMore: false,
        bucket: FI18n.i18nNext.t('cbformatter_import_filter_allobjects'),
        uploadBucket: null,
        objectKey: '',
        uploadQueue: refs.current.uploadQueue,
        successList: [],
        historyKey: '',
        historyList: [],
      };
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
    refs.current.uploadFileData.value = '';
    refs.current.uploadFileData = null;
  };

  /** 确认导入 */
  const sureImport = async (file: File) => {
    const suffix = getExt(file.name);
    if (!['zip', 'rar', 'tar', 'cbz', 'cbr', 'cbt'].includes(suffix)) {
      fMessage(FI18n.i18nNext.t('cbformatter_import_error_format'), 'error');
      setLoaderShow(false);
      return;
    }

    resource.current.draftData.customProperties = [];
    resource.current.draftData.customConfigurations = [];
    setComicConfig(null);
    setImgList([]);
    setComicName(file.name);

    uncompressComicArchive(file, { setLoaderShow, setImgList, setComicConfig });

    setTimeout(() => {
      close();
    }, 0);
  };

  /** 上传本地文件 */
  const uploadLocalFile = (e: any) => {
    setUploadStatus(2);
    setTimeout(() => {
      setUploadStatus(3);
      setTimeout(() => {
        setUploadStatus(4);
        refs.current.uploadFileData = e.target;
      }, 400);
    }, 500);
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
        refs.current.bucket ===
        FI18n.i18nNext.t('cbformatter_import_filter_allobjects')
          ? '_all'
          : refs.current.bucket,
      mime: 'application/zip,application/vnd.rar,application/x-tar,application/x-cbr',
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
      url: `/v2/resources/${resourceId}/versions`,
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

  /** 从本地上传导入 */
  const importFromUpload = async () => {
    setLoaderShow(true);
    sureImport(refs.current.uploadFileData.files[0]);
  };

  /** 从存储对象导入 */
  const importFromObject = async (item: {
    objectId: string;
    objectName: string;
  }) => {
    setLoaderShow(true);
    const { objectId, objectName } = item;
    const res = await FUtil.Request({
      method: 'GET',
      url: `/v2/storages/objects/${objectId}/file`,
      responseType: 'blob',
    });
    const file = new File([res], objectName);
    sureImport(file);
  };

  /** 从版本导入 */
  const importFromHistory = async (item: {
    version: string;
    filename: string;
  }) => {
    setLoaderShow(true);
    const { version, filename } = item;
    const res = await FUtil.Request({
      method: 'GET',
      url: `/v2/resources/${resourceId}/versions/${version}/download`,
      responseType: 'blob',
    });
    const file = new File([res], filename + '.zip', {
      type: 'application/zip',
    });
    sureImport(file);
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
    const { errCode, msg } = result;
    setCreateBucketShow(false);
    if (errCode !== 0) {
      fMessage(msg, 'error');
      return;
    }
    getBuckets();
  };

  /** 上传文件前整理队列 */
  const beforeUpload = async (fileList: RcFile[]) => {
    // 是否有超过大小限制的文件
    const IS_EXSIT_BIG_FILE =
      fileList.filter((item) => item.size > 200 * 1024 * 1024).length > 0;
    if (IS_EXSIT_BIG_FILE) {
      fMessage(
        FI18n.i18nNext.t('mdeditor_import_error_lengthlimitation'),
        'error',
      );
      return;
    }

    // 获取当前存储空间内存情况
    const spaceResult = await FServiceAPI.Storage.spaceStatistics();
    const { storageLimit, totalFileSize } = spaceResult.data;
    const totalSize: number = fileList
      .map((item) => item.size)
      .reduce((pre, cur) => pre + cur, 0);
    if (storageLimit - totalFileSize < totalSize) {
      fMessage(FI18n.i18nNext.t('uploadobject_alarm_storage_full'), 'error');
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
      resourceTypeCode: '',
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
          <input
            className="hidden-upload-btn"
            type="file"
            id="uploadLocalFile"
            accept=".cbz,.cbr,.cbt,.zip,.rar,.tar"
            onChange={uploadLocalFile}
          />

          <div className={`upload-box ${uploadStatus === 1 && 'normal'}`}>
            <div className="tip">
              {FI18n.i18nNext.t('cbformatter_import_msg')}
            </div>
            <div className="warning">
              {FI18n.i18nNext.t('cbformatter_import_msg02')}
            </div>
            <div
              className="upload-btn"
              onClick={() => {
                document.getElementById('uploadLocalFile')?.click();
              }}
            >
              {FI18n.i18nNext.t('cbformatter_import_btn_selectnimport')}
            </div>
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
                  {FI18n.i18nNext.t('cbformatter_import_state_importing')}
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
                  </div>
                  <div className="warning">
                    {FI18n.i18nNext.t('cbformatter_import_confirmation')}
                  </div>
                  <div className="btns">
                    <div className="cancel-btn" onClick={cancelImport}>
                      {FI18n.i18nNext.t('btn_cancel')}
                    </div>
                    <div className="import-btn" onClick={importFromUpload}>
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
                  refs.current.uploadBucket =
                    e ===
                    FI18n.i18nNext.t('cbformatter_import_filter_allobjects')
                      ? null
                      : e;
                  setUploadBucket(
                    e ===
                      FI18n.i18nNext.t('cbformatter_import_filter_allobjects')
                      ? null
                      : e,
                  );
                  getObjects(true);
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {[
                  FI18n.i18nNext.t('cbformatter_import_filter_allobjects'),
                  ...bucketList,
                ].map((item) => (
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
                          onClick={(e) => e.stopPropagation()}
                          dropdownRender={(menu) => (
                            <>
                              {menu}
                              {bucketList.length < 5 && (
                                <div
                                  className="create-bucket-btn"
                                  onClick={() => {
                                    setUploadPopShow(false);
                                    setNewBucketName('');
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
                            accept=".cbz,.cbr,.cbt,.zip,.rar,.tar"
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
                            setNewBucketName('');
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
                    {FI18n.i18nNext.t('cbformatter_import_uploadcb_btn')}
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
              onClick={(e) => e.stopPropagation()}
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
                refs.current.bucket ===
                  FI18n.i18nNext.t('cbformatter_import_filter_allobjects') ||
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
                onClick={(e) => e.stopPropagation()}
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
                    FI18n.i18nNext.t('bucket_createbucket_err_bucketexists')
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
            onClick={(e) => e.stopPropagation()}
            theme="dark"
          />
          {historyList.map((item) => (
            <div className="history-item" key={item.versionId}>
              <div className="info-area">
                <div className="version" title={item.version}>
                  {item.version}
                </div>
                <div className="other-info">
                  <div className="update-time">
                    {`${FI18n.i18nNext.t(
                      'label_last_updated',
                    )} ${FUtil.Format.formatDateTime(item.updateDate, true)}`}
                  </div>
                  <div className="file-name" title={item.filename}>
                    {item.filename}
                  </div>
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
      className="import-drawer-wrapper"
      width={700}
      title={FI18n.i18nNext.t('cbformatter_import_btn')}
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
