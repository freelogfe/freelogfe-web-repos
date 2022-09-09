/** 导入文档弹窗组件 */

import './index.less';
import { Drawer, Popconfirm, Select, Tabs, Upload } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import fMessage from '@/components/fMessage';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { useEffect, useState } from 'react';

const { Option } = Select;

interface Props {
  show: boolean;
  close: () => void;
}

export const ImportDocDrawer = (props: Props) => {
  const { show, close } = props;

  const [bucket, setBucket] = useState('全部Bucket');
  const [bucketList, setBucketList] = useState<string[]>([]);
  const [objectList, setObjectList] = useState<any[]>([]);
  const [objectKey, setObjectKey] = useState('');
  const [historyKey, setHistoryKey] = useState('');
  const [historyList, setHistoryList] = useState<any[]>([]);

  useEffect(() => {
    if (!show) return;

    getBuckets();
    getHistoryVersion();
  }, [show]);

  useEffect(() => {
    getBuckets();
  }, [bucket, objectKey]);

  /** 上传文件 */
  const uploadFile = (info: any) => {
    const { status } = info.file;
    if (status === 'done') {
      const fileReader = new FileReader();
      fileReader.readAsText(info.file.originFileObj);
      fileReader.onload = (e: any) => {
        console.error(e.target.result);
      };
    } else if (status === 'error') {
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
    getObjects();
  };

  /** 获取存储空间对应桶的阅读类型资源 */
  const getObjects = async () => {
    const params = {
      skip: 0,
      limit: 100,
      bucketName: bucket === '全部Bucket' ? '_all' : bucket,
      resourceType: '阅读',
      keywords: objectKey,
    };
    const res = await FServiceAPI.Storage.objectList(params);
    setObjectList(res.data.dataList);
  };

  /** 导入文档 */
  const importDoc = () => {
    console.error('导入文档');
  };

  /** 获取历史版本 */
  const getHistoryVersion = async () => {
    const res = await FUtil.Request({
      method: 'GET',
      url: `/v2/resources/${'629f195b2fbdf6002fa290ac'}/versions`,
      params: { projection: 'versionId,version,updateDate,filename' },
    });
    setHistoryList(res.data.reverse());
  };

  /** tab 选项卡区域列表 */
  const tabItems = [
    {
      label: '本地上传',
      key: 'upload',
      children: (
        <div className="upload-area">
          <div className="tip">
            点击下方按钮导入文档，支持markdown、txt格式文本
          </div>
          <div className="warning">
            导入的内容将覆盖原有内容，不支持的样式将转为图片或无法展示，发布前请先确认
          </div>
          <Upload showUploadList={false} onChange={uploadFile}>
            <FComponentsLib.FRectBtn className="upload-btn">
              上传本地文件
            </FComponentsLib.FRectBtn>
          </Upload>
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

              <Popconfirm
                placement="bottomRight"
                icon={
                  <i className="freelog fl-icon-warningxiaochicun confirm-icon"></i>
                }
                title="导入文档会覆盖原有内容，不支持的样式可能无法展示"
                onConfirm={importDoc}
                okText="导入"
                cancelText="取消"
              >
                <div className="choose-btn">选择</div>
              </Popconfirm>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: '历史版本',
      key: 'history',
      children: (
        <div className="history-area">
          <div className="search-input-box">
            <i className="freelog fl-icon-content"></i>
            <input
              className="search-input"
              type="text"
              value={historyKey}
              onChange={(e) => setHistoryKey((e.target.value || '').trim())}
            />
            {objectKey && (
              <i
                className="freelog fl-icon-shibai"
                onClick={() => setHistoryKey('')}
              ></i>
            )}
          </div>
          {historyList
            .filter(
              (item) =>
                item.version.includes(historyKey) ||
                item.filename.includes(historyKey),
            )
            .map((item) => (
              <div className="history-item" key={item.versionId}>
                <div className="info-area">
                  <div className="version">{item.version}</div>
                  <div className="other-info">
                    <span>
                      {`更新时间 ${FUtil.Format.formatDateTime(
                        item.updateDate,
                        true,
                      )}`}
                    </span>
                    <span>{item.filename}</span>
                  </div>
                </div>

                <Popconfirm
                  placement="bottomRight"
                  icon={
                    <i className="freelog fl-icon-warningxiaochicun confirm-icon"></i>
                  }
                  title="导入文档会覆盖原有内容，不支持的样式可能无法展示"
                  onConfirm={importDoc}
                  okText="导入"
                  cancelText="取消"
                >
                  <div className="choose-btn">选择</div>
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
      title="导入文档"
      closable={false}
      open={show}
      onClose={() => {
        close();
      }}
    >
      <Tabs items={tabItems} />
    </Drawer>
  );
};
