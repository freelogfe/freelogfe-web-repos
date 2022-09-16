/** 插入资源弹窗组件 */

import './index.less';
import { Drawer, Select, Tabs } from 'antd';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { useEffect, useRef, useState } from 'react';
import FCoverImage from '@/components/FCoverImage';
import FInput from '@/components/FInput';

const { Option } = Select;

interface Props {
  show: boolean;
  close: () => void;
  drawerType: string;
}

interface UrlItem {
  value: string;
  alt?: string;
}

export const InsertResourceDrawer = (props: Props) => {
  const { show, close, drawerType } = props;
  let body: Element | null = null;
  const resourceMapping: any = {
    image: { resourceType: '图片', key: '插入图片' },
    audio: { resourceType: '音频', key: '插入音频' },
    video: { resourceType: '视频', key: '插入视频' },
    text: { resourceType: '阅读', key: '插入文档' },
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
    objectKey: '',
  });
  const [activeTab, setActiveTab] = useState('market');
  const [resourceList, setResourceList] = useState<any[]>([]);
  const [mineList, setMineList] = useState<any[]>([]);
  const [collectionList, setCollectionList] = useState<any[]>([]);
  const [bucketList, setBucketList] = useState<string[]>([]);
  const [objectList, setObjectList] = useState<any[]>([]);
  const [urlList, setUrlList] = useState<UrlItem[]>([]);

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
    setUrlList([{ value: '', alt: '' }]);

    return () => {
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
    bucketList.unshift('全部Bucket');
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

  /** tab 选项卡区域列表 */
  const tabItems = [
    {
      label: '资源市场',
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
          />
          {resourceList.length === 0 && refs.current.resourceNoMore && (
            <div className="no-data-box">
              <div className="no-data-tip">
                <i className="freelog fl-icon-liebiaoweikong"></i>
                <div className="tip">当前列表暂无内容</div>
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
      label: '我的资源',
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
          />
          {mineList.length === 0 && refs.current.mineNoMore && (
            <div className="no-data-box">
              <div className="no-data-tip">
                <i className="freelog fl-icon-liebiaoweikong"></i>
                <div className="tip">当前列表暂无内容</div>
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
      label: '我的收藏',
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
          />
          {collectionList.length === 0 && refs.current.collectionNoMore && (
            <div className="no-data-box">
              <div className="no-data-tip">
                <i className="freelog fl-icon-liebiaoweikong"></i>
                <div className="tip">当前列表暂无内容</div>
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
      label: '存储空间',
      key: 'bucket',
      children: (
        <div className="buckets-area">
          <div className="header">
            <Select
              className="bucket-select"
              defaultValue="全部Bucket"
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
          {objectList.length === 0 && refs.current.bucketNoMore && (
            <div className="no-data-box">
              <div className="no-data-tip">
                <i className="freelog fl-icon-liebiaoweikong"></i>
                <div className="tip">当前列表暂无内容</div>
              </div>
            </div>
          )}
          {objectList.map((item) => (
            <div className="object-item" key={item.objectId}>
              <div className="info-area">
                <div className="object-name">{`${item.bucketName}/${item.objectName}`}</div>
                <div className="other-info">{`${
                  item.resourceType.join(' / ') || '未设置类型'
                } | 更新时间 ${FUtil.Format.formatDateTime(
                  item.updateDate,
                  true,
                )}`}</div>
              </div>

              <div className="choose-btn">选择</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'URL',
      key: 'url',
      disabled: drawerType === 'text',
      children: (
        <div className="url-area">
          {urlList.map((item, index) => (
            <div className="url-item" key={index}>
              <div className="title">URL</div>
              <textarea
                value={item.value}
                onChange={(e) => {
                  setUrlList((pre) => {
                    const list = [...pre];
                    list[index].value = e.target.value;
                    return list;
                  });
                }}
              ></textarea>
              <div className="title">描述</div>
              <textarea
                value={item.alt}
                onChange={(e) => {
                  setUrlList((pre) => {
                    const list = [...pre];
                    list[index].alt = e.target.value;
                    return list;
                  });
                }}
              ></textarea>
            </div>
          ))}
          <div className="btns">
            <div
              className="add-btn"
              onClick={() => {
                setUrlList((pre) => [...pre, { value: '', alt: '' }]);
              }}
            >
              <i className="freelog fl-icon-tianjia"></i>
              <span>新增url</span>
            </div>
            <div
              className="insert-btn"
              onClick={() => {
                console.error(urlList);
              }}
            >
              插入到文章
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
      title={show && resourceMapping[drawerType].key}
      closable={false}
      open={!!drawerType}
      onClose={close}
      extra={<i className="freelog fl-icon-guanbi close-btn" onClick={close} />}
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
