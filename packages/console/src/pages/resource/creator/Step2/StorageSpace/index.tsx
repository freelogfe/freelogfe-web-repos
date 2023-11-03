import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import fObjectSelectorDrawer from '@/components/fObjectSelectorDrawer';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { useGetState } from '@/utils/hooks';
import fMessage from '@/components/fMessage';
import FModal from '@/components/FModal';
import FTable from '@/components/FTable';

// import { Progress } from 'antd';

interface StorageSpaceProps {
  style?: React.CSSProperties;
  resourceTypeCode: string;

  onSucceed?(value: {
    bucketID: string;
    bucketName: string;
    sha1: string;
    objectID: string;
    objectName: string;
  }): void;
}

interface StorageSpaceStates {
  $selfUsedResource: {
    resourceID: string;
    resourceName: string;
    resourceType: string[];
    resourceVersion: string;
    url: string;
  }[];
  $otherUsedResource: {
    resourceID: string;
    resourceName: string;
    resourceType: string[];
    resourceVersion: string;
    url: string;
  }[];
  $objectInfo: {
    bucketID: string;
    bucketName: string;
    sha1: string;
    objectID: string;
    objectName: string;
  } | null;
}

const initStates: StorageSpaceStates = {
  $selfUsedResource: [],
  $otherUsedResource: [],
  $objectInfo: null,
};

function StorageSpace({ style = {}, resourceTypeCode, onSucceed }: StorageSpaceProps) {

  const [$selfUsedResource, set$selfUsedResource, get$selfUsedResource] = useGetState<StorageSpaceStates['$selfUsedResource']>(initStates['$selfUsedResource']);
  const [$otherUsedResource, set$otherUsedResource, get$otherUsedResource] = useGetState<StorageSpaceStates['$otherUsedResource']>(initStates['$otherUsedResource']);
  const [$objectInfo, set$objectInfo, get$objectInfo] = useGetState<StorageSpaceStates['$objectInfo']>(initStates['$objectInfo']);

  return (<>
    <div className={styles.storageSpace} style={style}>
      <FComponentsLib.FIcons.FStorageSpace style={{ fontSize: 60 }} />
      <div style={{ height: 40 }} />
      <FComponentsLib.FContentText
        text={'选择存储空间对象作为发行对象'}
        type={'additional2'}
      />
      <div style={{ height: 40 }} />
      <FComponentsLib.FRectBtn
        type={'primary'}
        onClick={async () => {
          const obj = await fObjectSelectorDrawer({
            resourceTypeCode: resourceTypeCode,
          });
          if (!obj) {
            return;
          }

          set$objectInfo({
            bucketID: obj.bucketID,
            bucketName: obj.bucketName,
            sha1: obj.sha1,
            objectID: obj.objID,
            objectName: obj.objName,
          });

          const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
            fileSha1: obj.sha1,
          };

          const { data: data_ResourcesBySha1 } = await FServiceAPI.Resource.getResourceBySha1(params3);

          if (data_ResourcesBySha1.length > 0) {
            if (data_ResourcesBySha1[0].userId === FUtil.Tool.getUserIDByCookies()) {
              const usedResources: StorageSpaceStates['$selfUsedResource'] = data_ResourcesBySha1.map((d: any) => {
                return d.resourceVersions.map((v: any) => {
                  return {
                    resourceId: d.resourceId,
                    resourceName: d.resourceName,
                    resourceType: d.resourceType,
                    resourceVersion: v.version,
                    url: FUtil.LinkTo.resourceVersionInfo({
                      resourceID: d.resourceId,
                      version: v.version,
                    }),
                  };
                });
              }).flat();

              set$selfUsedResource(usedResources);

              // tempImportObjectInfo.current = {
              //   bucketID: bucketID,
              //   bucketName: bucketName,
              //   objID: objectID,
              //   objName: objectName,
              //   sha1: sha1,
              // };
              //
              // $setState({
              //   fUsedResource: usedResources,
              //   fState: 'unsuccessful',
              //   fUploadedError: 'selfTakeUp',
              // });
            } else {
              const usedResources: StorageSpaceStates['$otherUsedResource'] = data_ResourcesBySha1.map((d: any) => {
                return d.resourceVersions.map((v: any) => {
                  return {
                    resourceId: d.resourceId,
                    resourceName: d.resourceName,
                    resourceType: d.resourceType,
                    resourceVersion: v.version,
                    url: FUtil.LinkTo.resourceDetails({
                      resourceID: d.resourceId,
                      version: v.version,
                    }),
                  };
                });
              }).flat();
              // $setState({
              //   fUsedResource: usedResources,
              //   fState: 'unsuccessful',
              //   fUploadedError: 'othersTakeUp',
              // });
              set$otherUsedResource(usedResources);
            }
          } else {
            const objectInfo = get$objectInfo();
            if (objectInfo) {
              onSucceed && onSucceed(objectInfo);
            } else {
              fMessage('导入失败', 'error');
            }
          }
        }}
      >存储空间导入</FComponentsLib.FRectBtn>
    </div>

    <FModal
      title={null}
      width={920}
      open={$selfUsedResource.length > 0}
      onOk={() => {
        set$selfUsedResource([]);
        const fileInfo = get$objectInfo();
        if (fileInfo) {
          onSucceed && onSucceed(fileInfo);
        }
      }}
      onCancel={() => {
        set$selfUsedResource([]);
      }}
      okText={'继续上传'}
      cancelText={'取消'}
    >
      <div style={{ padding: 20 }}>
        <div style={{ color: '#EE4040' }}>该文件已经发行过</div>
      </div>
      <div style={{ height: 5 }} />
      <FTable
        // rowClassName={styles.tableRowClassName}
        scroll={{ y: $selfUsedResource.length > 5 ? 350 : undefined }}
        columns={[
          {
            title: '资源',
            dataIndex: 'resourceName',
            width: 400,
            render(value, record, index) {
              return (<FComponentsLib.FContentText
                text={record.resourceName}
                style={{ maxWidth: 370 }}
              />);
            },
          },
          {
            title: '类型',
            dataIndex: 'resourceType',
            width: 280,
            render(value, record, index) {
              return (<FComponentsLib.FContentText
                text={record.resourceType.join(' / ')}
              />);
            },
          },
          {
            title: '版本',
            dataIndex: 'resourceVersion',
            width: 160,
            render(value, record, index) {
              return (<FComponentsLib.FContentText
                text={record.resourceVersion}
              />);
            },
          },
          {
            title: '操作',
            dataIndex: 'operation',
            render(value, record, index) {
              return (<FComponentsLib.FTextBtn onClick={() => {
                window.open(record.url);
              }}>查看</FComponentsLib.FTextBtn>);
            },
          },
        ]}
        dataSource={$selfUsedResource.map((sfur) => {
          return {
            key: sfur.url,
            ...sfur,
          };
        })}
      />
    </FModal>

    <FModal
      title={null}
      width={920}
      open={$otherUsedResource.length > 0}

      onCancel={() => {
        set$otherUsedResource([]);
      }}
      okText={'关闭'}
      // cancelText={'取消'}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}
    >
      <FTable
        // rowClassName={styles.tableRowClassName}
        scroll={{ y: $selfUsedResource.length > 5 ? 350 : undefined }}
        columns={[
          {
            title: '资源',
            dataIndex: 'resourceName',
            width: 400,
            render(value, record, index) {
              return (<FComponentsLib.FContentText
                text={record.resourceName}
                style={{ maxWidth: 370 }}
              />);
            },
          },
          {
            title: '类型',
            dataIndex: 'resourceType',
            width: 280,
            render(value, record, index) {
              return (<FComponentsLib.FContentText
                text={record.resourceType.join(' / ')}
              />);
            },
          },
          {
            title: '版本',
            dataIndex: 'resourceVersion',
            width: 160,
            render(value, record, index) {
              return (<FComponentsLib.FContentText
                text={record.resourceVersion}
              />);
            },
          },
          {
            title: '操作',
            dataIndex: 'operation',
            render(value, record, index) {
              return (<FComponentsLib.FTextBtn onClick={() => {
                window.open(record.url);
              }}>查看</FComponentsLib.FTextBtn>);
            },
          },
        ]}
        dataSource={$otherUsedResource.map((sfur) => {
          return {
            key: sfur.url,
            ...sfur,
          };
        })}
      />
    </FModal>
  </>);
}

export default StorageSpace;
