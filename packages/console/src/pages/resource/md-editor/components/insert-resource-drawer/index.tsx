/** 插入资源弹窗组件 */

import './index.less';
import { Drawer, Popover, Select, Tabs, Upload } from 'antd';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import { useEffect, useRef, useState } from 'react';
import FCoverImage from '@/components/FCoverImage';
import FInput from '@/components/FInput';

const { Option } = Select;

interface Props {
  show: boolean;
  close: () => void;
  drawerType: string;
}

export const InsertResourceDrawer = (props: Props) => {
  const { show, close, drawerType } = props;
  let body: Element | null = null;
  const resourceMapping: any = {
    image: {
      resourceType: '图片',
      accept: 'image/*',
      key: FI18n.i18nNext.t('insert_title_image'),
      bucketTitle: FI18n.i18nNext.t('posteditor_insert_label_objectlist_image'),
      uploadText: FI18n.i18nNext.t('btn_upload_new_image'),
    },
    audio: {
      resourceType: '音频',
      accept: 'audio/*',
      key: FI18n.i18nNext.t('insert_title_audio'),
      bucketTitle: FI18n.i18nNext.t('posteditor_insert_label_objectlist_audio'),
      uploadText: FI18n.i18nNext.t('btn_upload_new_audio'),
    },
    video: {
      resourceType: '视频',
      accept: 'video/*',
      key: FI18n.i18nNext.t('insert_title_video'),
      bucketTitle: FI18n.i18nNext.t('posteditor_insert_label_objectlist_video'),
      uploadText: FI18n.i18nNext.t('btn_upload_new_video'),
    },
    text: {
      resourceType: '阅读',
      accept: '.md,.txt',
      key: FI18n.i18nNext.t('insert_title_post'),
      bucketTitle: FI18n.i18nNext.t('posteditor_insert_label_objectlist_post'),
      uploadText: FI18n.i18nNext.t('btn_upload_new_post'),
    },
  };
  const defaultCover = '//static.freelog.com/static/default_cover.png';

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
    bucket: '全部Bucket',
    uploadBucket: null as string | null,
    objectKey: '',
  });
  const [activeTab, setActiveTab] = useState('market');
  const [resourceList, setResourceList] = useState<any[]>([]);
  const [mineList, setMineList] = useState<any[]>([]);
  const [collectionList, setCollectionList] = useState<any[]>([]);
  const [bucketList, setBucketList] = useState<string[]>([]);
  const [uploadBucket, setUploadBucket] = useState<string | null>(null);
  const [uploadPopShow, setUploadPopShow] = useState(false);
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
    getBuckets();
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
        bucket: '全部Bucket',
        uploadBucket: null,
        objectKey: '',
      };
      setActiveTab('market');
      setUrl('');
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
      resourceType: resourceMapping[drawerType].resourceType,
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
      resourceType: resourceMapping[drawerType].resourceType,
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

    const collectionParams: Parameters<
      typeof FServiceAPI.Collection.collectionResources
    >[0] = {
      skip: refs.current.collectionPageIndex * 20,
      limit: 20,
      keywords: refs.current.collectionKey,
      resourceType: resourceMapping[drawerType].resourceType,
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
    // bucketList.unshift('全部Bucket');
    setBucketList(bucketList);
    getObjects(true);
  };

  /** 获取存储空间对应桶的阅读类型资源 */
  const getObjects = async (init = false) => {
    refs.current.bucketPageIndex = init ? 0 : refs.current.bucketPageIndex + 1;

    const params = {
      skip: refs.current.bucketPageIndex * 12,
      limit: 12,
      bucketName:
        refs.current.bucket === '全部Bucket' ? '_all' : refs.current.bucket,
      mime: drawerType,
      keywords: refs.current.objectKey,
    };
    const res = await FServiceAPI.Storage.objectList(params);
    const { dataList } = res.data;
    refs.current.bucketNoMore = dataList.length === 0;
    setObjectList((pre) => (init ? dataList : [...pre, ...dataList]));
  };

  /** 上传文件 */
  const uploadFile = (info: any) => {
    setUploadPopShow(false);
    console.error(refs.current.uploadBucket);
    console.error(info);
    // const { status, name } = info.file;
    // if (status === 'uploading') {
    //   if (uploadStatus === 1) setUploadStatus(2);
    // } else if (status === 'done') {
    //   setTimeout(() => {
    //     setUploadStatus(3);
    //     setTimeout(() => {
    //       setUploadStatus(4);
    //     }, 400);
    //   }, 500);
    //   const fileReader = new FileReader();
    //   fileReader.readAsText(info.file.originFileObj);
    //   fileReader.onload = (e: any) => {
    //     const { result } = e.target;
    //     refs.current.uploadFileData = { name, content: result };
    //     setUploadFileData(refs.current.uploadFileData);
    //   };
    // } else if (status === 'error') {
    //   setUploadStatus(1);
    //   fMessage('上传失败', 'error');
    // }
  };

  /** tab 选项卡区域列表 */
  const tabItems = [
    {
      label: FI18n.i18nNext.t('insert_tab_resourcemarket'),
      key: 'market',
      children: (
        <div className="market-area">
          <FInput
            wrapClassName="search-input"
            value={refs.current.resourceKey}
            debounce={300}
            allowClear={true}
            onDebounceChange={(e) => {
              refs.current.resourceKey = (e || '').trim();
              getResourceList(true);
            }}
            theme="dark"
            placeholder={FI18n.i18nNext.t('insert_frommarket_searchbar_hint')}
          />
          {resourceList.length === 0 && refs.current.resourceNoMore && (
            <div className="no-data-box">
              <div className="no-data-tip">
                <i className="freelog fl-icon-liebiaoweikong"></i>
                <div className="tip">
                  {FI18n.i18nNext.t('msg_empty_general')}
                </div>
              </div>
            </div>
          )}
          {resourceList.length !== 0 && (
            <div className="resource-list">
              {resourceList.map((item) => (
                <div className="resource-item" key={item.resourceId}>
                  <FCoverImage
                    src={item.coverImages[0] || defaultCover}
                    width={280}
                    style={{ borderRadius: 4 }}
                  />
                  <div className="name">{item.resourceName}</div>
                  <div className="info">
                    <div>{item.resourceType.join('/')}</div>
                    <div>最新版本 {item.latestVersion}</div>
                  </div>
                  <div className="policy-tags">
                    {item.policies
                      .filter((item: { status: number }) => item.status === 1)
                      .map(
                        (policy: { policyName: string; policyId: string }) => (
                          <div className="tag" key={policy.policyId}>
                            {policy.policyId}
                          </div>
                        ),
                      )}
                  </div>
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
        <div className="mine-area">
          <FInput
            wrapClassName="search-input"
            value={refs.current.mineKey}
            debounce={300}
            allowClear={true}
            onDebounceChange={(e) => {
              refs.current.mineKey = (e || '').trim();
              getMineList(true);
            }}
            theme="dark"
            placeholder={FI18n.i18nNext.t('insert_frommarket_searchbar_hint')}
          />
          {mineList.length === 0 && refs.current.mineNoMore && (
            <div className="no-data-box">
              <div className="no-data-tip">
                <i className="freelog fl-icon-liebiaoweikong"></i>
                <div className="tip">
                  {FI18n.i18nNext.t('msg_empty_general')}
                </div>
              </div>
            </div>
          )}
          {mineList.length !== 0 && (
            <div className="resource-list">
              {mineList.map((item) => (
                <div className="resource-item" key={item.resourceId}>
                  <FCoverImage
                    src={item.coverImages[0] || defaultCover}
                    width={280}
                    style={{ borderRadius: 4 }}
                  />
                  <div className="name">{item.resourceName}</div>
                  <div className="info">
                    <div>{item.resourceType.join('/')}</div>
                    <div>最新版本 {item.latestVersion}</div>
                  </div>
                  <div className="policy-tags">
                    {item.policies
                      .filter((item: { status: number }) => item.status === 1)
                      .map(
                        (policy: { policyName: string; policyId: string }) => (
                          <div className="tag" key={policy.policyId}>
                            {policy.policyId}
                          </div>
                        ),
                      )}
                  </div>
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
        <div className="collection-area">
          <FInput
            wrapClassName="search-input"
            value={refs.current.collectionKey}
            debounce={300}
            allowClear={true}
            onDebounceChange={(e) => {
              refs.current.collectionKey = (e || '').trim();
              getCollectionList(true);
            }}
            theme="dark"
            placeholder={FI18n.i18nNext.t('insert_frommarket_searchbar_hint')}
          />
          {collectionList.length === 0 && refs.current.collectionNoMore && (
            <div className="no-data-box">
              <div className="no-data-tip">
                <i className="freelog fl-icon-liebiaoweikong"></i>
                <div className="tip">
                  {FI18n.i18nNext.t('msg_empty_general')}
                </div>
              </div>
            </div>
          )}
          {collectionList.length !== 0 && (
            <div className="resource-list">
              {collectionList.map((item) => (
                <div className="resource-item" key={item.resourceId}>
                  <FCoverImage
                    src={item.coverImages[0] || defaultCover}
                    width={280}
                    style={{ borderRadius: 4 }}
                  />
                  <div className="name">{item.resourceName}</div>
                  <div className="info">
                    <div>{item.resourceType.join('/')}</div>
                    <div>最新版本 {item.latestVersion}</div>
                  </div>
                  <div className="policy-tags">
                    {item.policies
                      .filter((item: { status: number }) => item.status === 1)
                      .map(
                        (policy: { policyName: string; policyId: string }) => (
                          <div className="tag" key={policy.policyId}>
                            {policy.policyId}
                          </div>
                        ),
                      )}
                  </div>
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
                        >
                          {bucketList.map((item) => (
                            <Option value={item} key={item}>
                              {item}
                            </Option>
                          ))}
                        </Select>
                        <div className="btn-box">
                          <Upload
                            id="uploadBtn"
                            showUploadList={false}
                            onChange={uploadFile}
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
                          </Upload>
                        </div>
                      </>
                    ) : (
                      <div className="no-bucket-box">
                        <div className="tip">
                          {FI18n.i18nNext.t('posteditor_insert_no_bucket')}
                        </div>
                        <div className="btn">
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
              theme="dark"
            />
          </div>
          <div className="title">
            {show ? resourceMapping[drawerType].bucketTitle : ''}
          </div>
          {objectList.length === 0 && refs.current.bucketNoMore && (
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

              <div className="choose-btn">
                {FI18n.i18nNext.t('btn_import_post')}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: FI18n.i18nNext.t('insert_tab_url'),
      key: 'url',
      disabled: drawerType === 'text',
      children: (
        <div className="url-area">
          <textarea
            className="url-input"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          ></textarea>
          <div className="btn-box">
            <div
              className="insert-btn"
              onClick={() => {
                console.error(url);
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
      className="insert-resource-drawer-wrapper"
      width={700}
      title={show ? resourceMapping[drawerType].key : ''}
      closable={false}
      open={!!drawerType}
      onClose={close}
      extra={<i className="freelog fl-icon-guanbi close-btn" onClick={close} />}
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
