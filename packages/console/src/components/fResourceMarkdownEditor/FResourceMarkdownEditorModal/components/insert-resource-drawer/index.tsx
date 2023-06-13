/** 插入资源弹窗组件 */

import './index.less';
import { Drawer, Popover, Select, Tabs } from 'antd';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import { useContext, useEffect, useRef, useState } from 'react';
import FInput from '@/components/FInput';
import FUpload from '@/components/FUpload';
import { RcFile } from 'antd/lib/upload/interface';
import fMessage from '@/components/fMessage';
import FModal from '@/components/FModal';
import FComponentsLib from '@freelog/components-lib';
import { ObjectItem } from '../object-item';
import { ResourceCard } from '../resource-card';
import { insertUrlResource } from '../../custom/dom/resource/utils';
import { editorContext } from '../..';

const { Option } = Select;

interface Props {
  show: boolean;
  drawerType: string;
}

export const InsertResourceDrawer = (props: Props) => {
  const { editor } = useContext(editorContext);
  const { show, drawerType } = props;
  let body: Element | null = null;
  const resourceMapping: any = {
    image: {
      resourceType: '图片',
      requestType: '照片,插画',
      accept: 'image/*',
      key: FI18n.i18nNext.t('insert_title_image'),
      bucketTitle: FI18n.i18nNext.t('posteditor_insert_label_objectlist_image'),
      uploadText: FI18n.i18nNext.t('btn_upload_new_image'),
    },
    audio: {
      resourceType: '音频',
      requestType: '音频',
      accept: 'audio/*',
      key: FI18n.i18nNext.t('insert_title_audio'),
      bucketTitle: FI18n.i18nNext.t('posteditor_insert_label_objectlist_audio'),
      uploadText: FI18n.i18nNext.t('btn_upload_new_audio'),
    },
    video: {
      resourceType: '视频',
      requestType: '视频',
      accept: 'video/*',
      key: FI18n.i18nNext.t('insert_title_video'),
      bucketTitle: FI18n.i18nNext.t('posteditor_insert_label_objectlist_video'),
      uploadText: FI18n.i18nNext.t('btn_upload_new_video'),
    },
    text: {
      resourceType: '阅读',
      requestType: '文章',
      accept: '.md,.txt',
      key: FI18n.i18nNext.t('insert_title_post'),
      bucketTitle: FI18n.i18nNext.t('posteditor_insert_label_objectlist_post'),
      uploadText: FI18n.i18nNext.t('btn_upload_new_post'),
    },
  };

  const refs = useRef({
    activeTab: 'market',
    resourcePageIndex: 0,
    resourceNoMore: false,
    resourceKey: '',
    minePageIndex: 0,
    mineNoMore: false,
    mineKey: '',
    collectionPageIndex: 0,
    collectionNoMore: false,
    collectionKey: '',
    bucketPageIndex: 0,
    bucketNoMore: false,
    bucket: FI18n.i18nNext.t('posteditor_insert_label_all_buckets'),
    uploadBucket: null as string | null,
    objectKey: '',
    uploadQueue: [] as any[],
    successList: [] as string[],
  });
  const [activeTab, setActiveTab] = useState('market');
  const [resourceList, setResourceList] = useState<any[]>([]);
  const [mineList, setMineList] = useState<any[]>([]);
  const [collectionList, setCollectionList] = useState<any[]>([]);
  const [bucketList, setBucketList] = useState<string[]>([]);
  const [uploadBucket, setUploadBucket] = useState<string | null>(null);
  const [createBucketShow, setCreateBucketShow] = useState(false);
  const [newBucketName, setNewBucketName] = useState('');
  const [newBucketError, setNewBucketError] = useState(0);
  const [uploadPopShow, setUploadPopShow] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<any[]>([]);
  const [objectList, setObjectList] = useState<any[]>([]);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!show) return;

    const drawer = document.getElementsByClassName(
      'insert-resource-drawer-wrapper',
    )[0];
    body = drawer.getElementsByClassName('ant-drawer-body')[0];
    body.addEventListener('scroll', listScroll);
    setActiveTab('market');
    getResourceList(true);
    getMineList(true);
    getCollectionList(true);
    if (drawerType !== 'text') getBuckets();
    setUrl('');

    return () => {
      refs.current = {
        activeTab: 'market',
        resourcePageIndex: 0,
        resourceNoMore: false,
        resourceKey: '',
        minePageIndex: 0,
        mineNoMore: false,
        mineKey: '',
        collectionPageIndex: 0,
        collectionNoMore: false,
        collectionKey: '',
        bucketPageIndex: 0,
        bucketNoMore: false,
        bucket: FI18n.i18nNext.t('posteditor_insert_label_all_buckets'),
        uploadBucket: null,
        objectKey: '',
        uploadQueue: refs.current.uploadQueue,
        successList: [],
      };
      setActiveTab('market');
      setUrl('');
      setUploadBucket(null);
      body?.removeEventListener('scroll', listScroll);
    };
  }, [show]);

  /** 监听列表滚动 */
  const listScroll = () => {
    const { activeTab } = refs.current;
    if (!body || activeTab === 'url') return;

    const noMore =
      (activeTab === 'market' && refs.current.resourceNoMore) ||
      (activeTab === 'mine' && refs.current.mineNoMore) ||
      (activeTab === 'collection' && refs.current.collectionNoMore) ||
      (activeTab === 'bucket' && refs.current.bucketNoMore);
    if (noMore) return;

    const { scrollHeight, scrollTop, clientHeight } = body;
    if (scrollHeight - clientHeight - scrollTop === 0) {
      if (activeTab === 'market') getResourceList();
      if (activeTab === 'mine') getMineList();
      if (activeTab === 'collection') getCollectionList();
      if (activeTab === 'bucket') getObjects();
    }
  };

  /** 获取资源市场 */
  const getResourceList = async (init = false) => {
    refs.current.resourcePageIndex = init
      ? 0
      : refs.current.resourcePageIndex + 1;

    const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
      skip: refs.current.resourcePageIndex * 20,
      limit: 20,
      keywords: refs.current.resourceKey,
      resourceType: resourceMapping[drawerType].requestType,
      status: 1,
    };
    const res = await FServiceAPI.Resource.list(params);
    const { dataList } = res.data;
    refs.current.resourceNoMore = dataList.length === 0;
    setResourceList((pre) => (init ? dataList : [...pre, ...dataList]));
  };

  /** 获取我的资源 */
  const getMineList = async (init = false) => {
    refs.current.minePageIndex = init ? 0 : refs.current.minePageIndex + 1;

    const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
      skip: refs.current.minePageIndex * 20,
      limit: 20,
      keywords: refs.current.mineKey,
      resourceType: resourceMapping[drawerType].requestType,
      isSelf: 1,
      status: 1,
    };
    const res = await FServiceAPI.Resource.list(params);
    const { dataList } = res.data;
    refs.current.mineNoMore = dataList.length === 0;
    setMineList((pre) => (init ? dataList : [...pre, ...dataList]));
  };

  /** 获取我的收藏 */
  const getCollectionList = async (init = false) => {
    refs.current.collectionPageIndex = init
      ? 0
      : refs.current.collectionPageIndex + 1;

    const collectionParams: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
      skip: refs.current.collectionPageIndex * 20,
      limit: 20,
      keywords: refs.current.collectionKey,
      resourceType: resourceMapping[drawerType].requestType,
      resourceStatus: 2,
    };
    const collectionRes = await FServiceAPI.Collection.collectionResources(
      collectionParams,
    );
    const { dataList } = collectionRes.data;
    refs.current.collectionNoMore = dataList.length === 0;
    if (!dataList.length) {
      if (init) setCollectionList([]);
      return;
    }

    const resourceParams: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] =
      {
        resourceIds: collectionRes.data.dataList
          .map((item: { resourceId: string }) => item.resourceId)
          .join(),
      };
    const resourceRes = await FServiceAPI.Resource.batchInfo(resourceParams);
    setCollectionList((pre) =>
      init ? resourceRes.data : [...pre, ...resourceRes.data],
    );
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

  /** 获取存储空间对应桶的对应类型资源 */
  const getObjects = async (init = false) => {
    if (init) setObjectList([]);
    refs.current.bucketPageIndex = init ? 0 : refs.current.bucketPageIndex + 1;

    const params = {
      skip: refs.current.bucketPageIndex * 12,
      limit: 12,
      bucketName:
        refs.current.bucket ===
        FI18n.i18nNext.t('posteditor_insert_label_all_buckets')
          ? '_all'
          : refs.current.bucket,
      mime: drawerType,
      keywords: refs.current.objectKey,
    };
    const res = await FServiceAPI.Storage.objectList(params);
    const { dataList } = res.data;
    refs.current.bucketNoMore = dataList.length === 0;
    dataList.forEach((item: any) => {
      item.uploadStatus = refs.current.successList.includes(item.sha1)
        ? 'success'
        : '';
    });
    setObjectList((pre) => (init ? dataList : [...pre, ...dataList]));
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
      fMessage(msg);
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
      fMessage(FI18n.i18nNext.t('uploadobject_err_file_size'), 'warning');
      return;
    }

    // 获取当前存储空间内存情况
    const spaceResult = await FServiceAPI.Storage.spaceStatistics();
    const { storageLimit, totalFileSize } = spaceResult.data;
    const totalSize: number = fileList
      .map((item) => item.size)
      .reduce((pre, cur) => pre + cur, 0);
    if (storageLimit - totalFileSize < totalSize) {
      fMessage(FI18n.i18nNext.t('uploadobject_alarm_storage_full'), 'warning');
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

  /** 从存储空间插入对象 */
  const insertFromObject = async (item: { objectId: string }) => {
    editor.focus();
    const url = `${FUtil.Format.completeUrlByDomain('file')}/objects/${
      item.objectId
    }`;
    insertUrlResource(url, editor, resourceMapping[drawerType].resourceType);
    editor.setDrawerType('');
  };

  /** tab 选项卡区域列表 */
  const tabItems = [
    {
      label: FI18n.i18nNext.t('insert_tab_resourcemarket'),
      key: 'market',
      children: (
        <div className='market-area'>
          <FInput
            wrapClassName='search-input'
            value={refs.current.resourceKey}
            debounce={300}
            allowClear={true}
            onDebounceChange={(e) => {
              refs.current.resourceKey = (e || '').trim();
              getResourceList(true);
            }}
            onClick={(e) => e.stopPropagation()}
            theme='dark'
            placeholder={FI18n.i18nNext.t('insert_frommarket_searchbar_hint')}
          />
          {resourceList.length === 0 && refs.current.resourceNoMore && (
            <div className='no-data-box'>
              <div className='no-data-tip'>
                <i className='freelog fl-icon-liebiaoweikong'></i>
                <div className='tip'>
                  {FI18n.i18nNext.t('msg_empty_general')}
                </div>
              </div>
            </div>
          )}
          {resourceList.length !== 0 && (
            <div className='resource-list'>
              {resourceList.map((item) => (
                <div className='resource-item' key={item.resourceId}>
                  <ResourceCard data={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      label: FI18n.i18nNext.t('insert_tab_myresources'),
      key: 'mine',
      children: (
        <div className='mine-area'>
          <FInput
            wrapClassName='search-input'
            value={refs.current.mineKey}
            debounce={300}
            allowClear={true}
            onDebounceChange={(e) => {
              refs.current.mineKey = (e || '').trim();
              getMineList(true);
            }}
            onClick={(e) => e.stopPropagation()}
            theme='dark'
            placeholder={FI18n.i18nNext.t('insert_frommarket_searchbar_hint')}
          />
          {mineList.length === 0 && refs.current.mineNoMore && (
            <div className='no-data-box'>
              <div className='no-data-tip'>
                <i className='freelog fl-icon-liebiaoweikong'></i>
                <div className='tip'>
                  {FI18n.i18nNext.t('msg_empty_general')}
                </div>
              </div>
            </div>
          )}
          {mineList.length !== 0 && (
            <div className='resource-list'>
              {mineList.map((item) => (
                <div className='resource-item' key={item.resourceId}>
                  <ResourceCard data={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      label: FI18n.i18nNext.t('insert_tab_mycollections'),
      key: 'collection',
      children: (
        <div className='collection-area'>
          <FInput
            wrapClassName='search-input'
            value={refs.current.collectionKey}
            debounce={300}
            allowClear={true}
            onDebounceChange={(e) => {
              refs.current.collectionKey = (e || '').trim();
              getCollectionList(true);
            }}
            onClick={(e) => e.stopPropagation()}
            theme='dark'
            placeholder={FI18n.i18nNext.t('insert_frommarket_searchbar_hint')}
          />
          {collectionList.length === 0 && refs.current.collectionNoMore && (
            <div className='no-data-box'>
              <div className='no-data-tip'>
                <i className='freelog fl-icon-liebiaoweikong'></i>
                <div className='tip'>
                  {FI18n.i18nNext.t('msg_empty_general')}
                </div>
              </div>
            </div>
          )}
          {collectionList.length !== 0 && (
            <div className='resource-list'>
              {collectionList.map((item) => (
                <div className='resource-item' key={item.resourceId}>
                  <ResourceCard data={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      label: FI18n.i18nNext.t('insert_tab_storage'),
      key: 'bucket',
      disabled: drawerType === 'text',
      children: (
        <div className='buckets-area'>
          <div className='header'>
            <div className='left-header'>
              <Select
                className='bucket-select'
                value={refs.current.bucket}
                onChange={(e) => {
                  refs.current.bucket = e;
                  refs.current.uploadBucket =
                    e ===
                    FI18n.i18nNext.t('posteditor_insert_label_all_buckets')
                      ? null
                      : e;
                  setUploadBucket(
                    e ===
                    FI18n.i18nNext.t('posteditor_insert_label_all_buckets')
                      ? null
                      : e,
                  );
                  getObjects(true);
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {[
                  FI18n.i18nNext.t('posteditor_insert_label_all_buckets'),
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
                placement='bottomLeft'
                trigger='click'
                title={null}
                content={
                  <div className='md-upload-bucket-selector'>
                    {bucketList.length ? (
                      <>
                        <div className='tip'>
                          {FI18n.i18nNext.t('msg_posteditor_upload_object')}
                        </div>
                        <Select
                          className='selector'
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
                                  className='create-bucket-btn'
                                  onClick={() => {
                                    setUploadPopShow(false);
                                    setNewBucketName('');
                                    setCreateBucketShow(true);
                                  }}
                                >
                                  <i className='freelog fl-icon-tianjia'></i>
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
                        <div className='btn-box'>
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
                            accept={
                              show ? resourceMapping[drawerType].accept : ''
                            }
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
                      <div className='no-bucket-box'>
                        <div className='tip'>
                          {FI18n.i18nNext.t('posteditor_insert_no_bucket')}
                        </div>
                        <div
                          className='btn'
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
                <div className='upload-btn'>
                  <i className='freelog fl-icon-shangchuanfengmian'></i>
                  <div className='btn-text'>
                    {show ? resourceMapping[drawerType].uploadText : ''}
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
              theme='dark'
            />
          </div>
          <div className='title'>
            {show ? resourceMapping[drawerType].bucketTitle : ''}
          </div>
          {objectList.length === 0 && refs.current.bucketNoMore && (
            <div className='no-data-box'>
              <div className='no-data-tip'>
                <i className='freelog fl-icon-liebiaoweikong'></i>
                <div className='tip'>
                  {FI18n.i18nNext.t('msg_empty_general')}
                </div>
              </div>
            </div>
          )}
          {uploadQueue
            .filter(
              (item) =>
                refs.current.bucket ===
                FI18n.i18nNext.t('posteditor_insert_label_all_buckets') ||
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
              insert={insertFromObject}
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
                type='h2'
              />
            </div>

            <div className='create-bucket-popup'>
              <div style={{ height: 50 }} />
              <div className='tip'>
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
                wrapClassName='input'
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
      label: FI18n.i18nNext.t('insert_tab_url'),
      key: 'url',
      disabled: drawerType === 'text',
      children: (
        <div className='url-area'>
          <textarea
            className='url-input'
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
          ></textarea>
          <div className='btn-box'>
            <div
              className='insert-btn'
              onClick={() => {
                editor.focus();
                insertUrlResource(
                  url,
                  editor,
                  resourceMapping[drawerType].resourceType,
                );
                editor.setDrawerType('');
              }}
            >
              {FI18n.i18nNext.t('btn_insert_from_url')}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Drawer
      className='insert-resource-drawer-wrapper'
      width={700}
      title={show ? resourceMapping[drawerType].key : ''}
      closable={false}
      open={!!drawerType}
      onClose={() => editor.setDrawerType('')}
      extra={
        <i
          className='freelog fl-icon-guanbi close-btn'
          onClick={() => editor.setDrawerType('')}
        />
      }
      destroyOnClose
    >
      <Tabs
        items={tabItems}
        activeKey={activeTab}
        onChange={(e) => {
          refs.current.activeTab = e;
          setActiveTab(e);
        }}
      />
    </Drawer>
  );
};
