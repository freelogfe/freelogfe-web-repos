/** 导入文档弹窗组件 */

import './index.less';
import ObjectIcon from '../../images/object.png';
import { Drawer, Popconfirm, Select, Tabs, Upload } from 'antd';
import fMessage from '@/components/fMessage';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { useEffect, useRef, useState } from 'react';
import FInput from '@/components/FInput';

const { Option } = Select;

interface Props {
  show: boolean;
  close: () => void;
}

export const ImportDocDrawer = (props: Props) => {
  const { show, close } = props;
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
  };

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
      resourceType: '阅读',
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
      label: '本地上传',
      key: 'upload',
      children: (
        <div className="upload-area">
          <div className={`upload-box ${uploadStatus === 1 && 'normal'}`}>
            <div className="tip">
              点击下方按钮导入文档，支持markdown、txt格式文本
            </div>
            <div className="warning">
              导入文档会覆盖原有内容，不支持的样式可能无法展示
            </div>
            <Upload
              showUploadList={false}
              onChange={uploadFile}
              beforeUpload={(file) => {
                // 文件名后缀（不取 type 是因为 md 文件的 type 为空字符串）
                const suffix = file.name.split('.')[1];
                const isMdOrTxt = ['md', 'txt'].includes(suffix);
                if (!isMdOrTxt) fMessage('仅支持导入md和txt格式的文件');
                return isMdOrTxt;
              }}
            >
              <div className="upload-btn">上传本地文件</div>
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
                <div className="uploading-tip">上传中...</div>
              )}
              {[3, 4].includes(uploadStatus) && (
                <div
                  className={`uploaded-box ${
                    uploadStatus === 3 && 'animation'
                  }`}
                >
                  <div className="uploaded-tip">
                    <i className="freelog fl-icon-a-chenggongzhengqueduigou1"></i>
                    <div className="tip-text">已上传</div>
                    <div className="file-name">{uploadFileData.name}</div>
                  </div>
                  <div className="warning">
                    <i className="freelog fl-icon-warningxiaochicun"></i>
                    <div className="warning-text">
                      导入文档会覆盖原有内容，不支持的样式可能无法展示
                    </div>
                  </div>
                  <div className="btns">
                    <div className="cancel-btn" onClick={cancelImport}>
                      取消
                    </div>
                    <div className="import-btn" onClick={sureImport}>
                      导入
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
          {objectList.length === 0 && refs.current.noMore && (
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

              <Popconfirm
                className="my-popconfirm"
                placement="bottomRight"
                icon={
                  <i className="freelog fl-icon-warningxiaochicun confirm-icon"></i>
                }
                title="导入文档会覆盖原有内容，不支持的样式可能无法展示"
                onConfirm={() => importFromObject(item)}
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
                    {`更新时间 ${FUtil.Format.formatDateTime(
                      item.updateDate,
                      true,
                    )}`}
                  </span>
                  <span>{item.filename}</span>
                </div>
              </div>

              <Popconfirm
                className="my-popconfirm"
                placement="bottomRight"
                icon={
                  <i className="freelog fl-icon-warningxiaochicun confirm-icon"></i>
                }
                title="导入文档会覆盖原有内容，不支持的样式可能无法展示"
                onConfirm={() => importFromHistory(item)}
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
      onClose={close}
      extra={<i className="freelog fl-icon-guanbi close-btn" onClick={close} />}
    >
      <Tabs items={tabItems} />
    </Drawer>
  );
};
