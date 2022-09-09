/** 插入资源弹窗组件 */

import './index.less';
import { Drawer, Select, Tabs } from 'antd';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { useEffect, useState } from 'react';

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
  const resourceMapping: any = {
    image: { resourceType: '图片', key: '插入图片' },
    audio: { resourceType: '音频', key: '插入音频' },
    video: { resourceType: '视频', key: '插入视频' },
    doc: { resourceType: '阅读', key: '插入文档' },
  };

  const [resourceList, setResourceList] = useState<any[]>([]);
  const [resourceKey, setResourceKey] = useState('');
  const [bucket, setBucket] = useState('全部Bucket');
  const [bucketList, setBucketList] = useState<string[]>([]);
  const [objectList, setObjectList] = useState<any[]>([]);
  const [objectKey, setObjectKey] = useState('');
  const [urlList, setUrlList] = useState<UrlItem[]>([{ value: '', alt: '' }]);

  useEffect(() => {
    if (!show) return;

    getResourceList();
    getBuckets();
  }, [show]);

  useEffect(() => {
    if (!show) return;

    getBuckets();
  }, [bucket, objectKey]);

  useEffect(() => {
    if (!show) return;

    getResourceList();
  }, [resourceKey]);

  /** 获取资源市场 */
  const getResourceList = async () => {
    const params = {
      skip: 0,
      limit: 20,
      keywords: resourceKey,
      resourceType: resourceMapping[drawerType].resourceType,
    };
    const res = await FServiceAPI.Resource.list(params);
    console.error(res);
    setResourceList(res.data.dataList);
  };

  /** 获取用户的存储空间 */
  const getBuckets = async () => {
    const res = await FServiceAPI.Storage.bucketList({ bucketType: 1 });
    const bucketList = res.data.map(
      (item: { bucketName: string }) => item.bucketName,
    );
    bucketList.unshift('全部Bucket');
    setBucketList(bucketList);
    getObjects();
  };

  /** 获取存储空间对应桶的阅读类型资源 */
  const getObjects = async () => {
    const params = {
      skip: 0,
      limit: 100,
      bucketName: bucket === '全部Bucket' ? '_all' : bucket,
      resourceType: resourceMapping[drawerType].resourceType,
      keywords: objectKey,
    };
    const res = await FServiceAPI.Storage.objectList(params);
    setObjectList(res.data.dataList);
  };

  /** 修改 url 输入框的值 */
  const changeUrlList = (key: string, value: string, index: number) => {
    const list: UrlItem[] = [];
    urlList.forEach((item, i) => {
      if (i === index) {
        list.push({
          value: key === 'value' ? value : item.value,
          alt: key === 'alt' ? value : item.alt,
        });
      } else {
        list.push(item);
      }
    });
    setUrlList(list);
  };

  /** tab 选项卡区域列表 */
  const tabItems = [
    {
      label: '资源市场',
      key: 'market',
      children: (
        <div className="market-area">
          <div className="search-input-box">
            <i className="freelog fl-icon-content"></i>
            <input
              className="search-input"
              type="text"
              value={resourceKey}
              onChange={(e) => setResourceKey((e.target.value || '').trim())}
            />
            {resourceKey && (
              <i
                className="freelog fl-icon-shibai"
                onClick={() => setResourceKey('')}
              ></i>
            )}
          </div>
          <div className="resource-list">
            {resourceList.map((item) => (
              <div className="resource-item" key={item.resourceId}>
                <div className="cover-box">
                  <img src={item.coverImages[0]} alt={item.resourceName} />
                </div>
                <div className="name">{item.resourceName}</div>
                <div className="info">
                  <div>{item.resourceType.join('/')}</div>
                  <div>最新版本 {item.latestVersion}</div>
                </div>
                <div className="policy-tags">
                  {item.policies
                    .filter((item: { status: number }) => item.status === 1)
                    .map((policy: { policyName: string; policyId: string }) => (
                      <div className="tag" key={policy.policyId}>
                        {policy.policyId}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: '我的资源',
      key: 'mine',
      children: (
        <div className="mine-area">
          <div className="search-input-box">
            <i className="freelog fl-icon-content"></i>
            <input
              className="search-input"
              type="text"
              value={resourceKey}
              onChange={(e) => setResourceKey((e.target.value || '').trim())}
            />
            {resourceKey && (
              <i
                className="freelog fl-icon-shibai"
                onClick={() => setResourceKey('')}
              ></i>
            )}
          </div>
          <div className="resource-list">
            {resourceList.map((item) => (
              <div className="resource-item" key={item.resourceId}>
                <div className="cover-box">
                  <img src={item.coverImages[0]} alt={item.resourceName} />
                </div>
                <div className="name">{item.resourceName}</div>
                <div className="info">
                  <div>{item.resourceType.join('/')}</div>
                  <div>最新版本 {item.latestVersion}</div>
                </div>
                <div className="policy-tags">
                  {item.policies
                    .filter((item: { status: number }) => item.status === 1)
                    .map((policy: { policyName: string; policyId: string }) => (
                      <div className="tag" key={policy.policyId}>
                        {policy.policyId}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: '我的收藏',
      key: 'collection',
      children: (
        <div className="collection-area">
          <div className="search-input-box">
            <i className="freelog fl-icon-content"></i>
            <input
              className="search-input"
              type="text"
              value={resourceKey}
              onChange={(e) => setResourceKey((e.target.value || '').trim())}
            />
            {resourceKey && (
              <i
                className="freelog fl-icon-shibai"
                onClick={() => setResourceKey('')}
              ></i>
            )}
          </div>
          <div className="resource-list">
            {resourceList.map((item) => (
              <div className="resource-item" key={item.resourceId}>
                <div className="cover-box">
                  <img src={item.coverImages[0]} alt={item.resourceName} />
                </div>
                <div className="name">{item.resourceName}</div>
                <div className="info">
                  <div>{item.resourceType.join('/')}</div>
                  <div>最新版本 {item.latestVersion}</div>
                </div>
                <div className="policy-tags">
                  {item.policies
                    .filter((item: { status: number }) => item.status === 1)
                    .map((policy: { policyName: string; policyId: string }) => (
                      <div className="tag" key={policy.policyId}>
                        {policy.policyId}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
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
              onChange={(e) => setBucket(e)}
            >
              {bucketList.map((item) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </Select>
            <div className="search-input-box">
              <i className="freelog fl-icon-content"></i>
              <input
                className="search-input"
                type="text"
                value={objectKey}
                onChange={(e) => setObjectKey((e.target.value || '').trim())}
              />
              {objectKey && (
                <i
                  className="freelog fl-icon-shibai"
                  onClick={() => setObjectKey('')}
                ></i>
              )}
            </div>
          </div>
          {objectList.map((item) => (
            <div className="object-item" key={item.objectId}>
              <div className="info-area">
                <div className="object-name">{`${item.bucketName}/${item.objectName}`}</div>
                <div className="other-info">{`${item.resourceType.join(
                  ' / ',
                )} | 更新时间 ${FUtil.Format.formatDateTime(
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
      children: (
        <div className="url-area">
          {urlList.map((item, index) => (
            <div className="url-item" key={index}>
              <div className="title">URL</div>
              <textarea
                value={item.value}
                onChange={(e) => {
                  changeUrlList('value', e.target.value, index);
                }}
              ></textarea>
              <div className="title">描述</div>
              <textarea
                value={item.alt}
                onChange={(e) => {
                  changeUrlList('alt', e.target.value, index);
                }}
              ></textarea>
            </div>
          ))}
          <div className="btns">
            <div
              className="add-btn"
              onClick={() => {
                const list = [...urlList, { value: '', alt: '' }];
                setUrlList(list);
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
      onClose={() => {
        close();
      }}
    >
      <Tabs items={tabItems} />
    </Drawer>
  );
};
