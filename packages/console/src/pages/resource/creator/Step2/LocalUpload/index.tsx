import * as React from 'react';
import styles from './index.less';
import { useGetState } from '@/utils/hooks';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { RcFile } from 'antd/lib/upload/interface';
import fReadLocalFiles from '@/components/fReadLocalFiles';
import fMessage from '@/components/fMessage';
import FModal from '@/components/FModal';
import FTable from '@/components/FTable';
import * as AHooks from 'ahooks';
import fOccupiedFileResourceVersion from '@/components/fOccupiedFileResourceVersion';

interface LocalUploadProps {
  resourceTypeCode: string;
  resourceType: string[];
  style?: React.CSSProperties;

  onSucceed?(value: { sha1: string; fileName: string }): void;

  onChange_uploadingInfo?(value: null | {
    name: string;
    percent: number;
    cancelHandler: any;
  }): void;
}

interface LocalUploadStates {
  $accept: string;
  $fileInfo: {
    sha1: string;
    fileName: string;
  } | null;
  // $selfUsedResource: {
  //   resourceID: string;
  //   resourceName: string;
  //   resourceType: string[];
  //   resourceVersion: string;
  //   url: string;
  // }[];
  // $otherUsedResource: {
  //   resourceID: string;
  //   resourceName: string;
  //   resourceType: string[];
  //   resourceVersion: string;
  //   url: string;
  // }[];
  $uploadingProgress: null | number;
}

const initStates: LocalUploadStates = {
  $accept: '',
  $fileInfo: null,
  // $selfUsedResource: [],
  // $otherUsedResource: [],
  $uploadingProgress: null,
};

function LocalUpload({ style, resourceTypeCode, resourceType, onSucceed, onChange_uploadingInfo }: LocalUploadProps) {

  // const uploadCancelHandler = React.useRef<any>();
  const [$accept, set$accept, get$accept] = useGetState<LocalUploadStates['$accept']>(initStates['$accept']);
  const [$fileInfo, set$fileInfo, get$fileInfo] = useGetState<LocalUploadStates['$fileInfo']>(initStates['$fileInfo']);
  // const [$selfUsedResource, set$selfUsedResource, get$selfUsedResource] = useGetState<LocalUploadStates['$selfUsedResource']>(initStates['$selfUsedResource']);
  // const [$otherUsedResource, set$otherUsedResource, get$otherUsedResource] = useGetState<LocalUploadStates['$otherUsedResource']>(initStates['$otherUsedResource']);
  // const [$uploadingProgress, set$uploadingProgress, get$uploadingProgress] = useGetState<LocalUploadStates['$uploadingProgress']>(initStates['$uploadingProgress']);

  AHooks.useMount(async () => {
    const { data }: {
      data: {
        formats: string[];
      }
    } = await FServiceAPI.Resource.getResourceTypeInfoByCode({
      code: resourceTypeCode,
    });
    if (!data) {
      return;
    }
    set$accept(data.formats.join(','));
  });

  return (<>
    <div className={styles.localUpload} style={style}>
      <FComponentsLib.FIcons.FLocalUpload style={{ fontSize: 60 }} />
      <div style={{ height: 40 }} />
      <FComponentsLib.FContentText text={'选择本地文件作为发行对象'} type={'additional2'} />
      <div style={{ height: 40 }} />
      <FComponentsLib.FRectBtn
        type={'primary'}
        onClick={async () => {

          const files: RcFile[] | null = await fReadLocalFiles({
            accept: $accept,
          });

          // console.log(files, resourceType, 'filesisdjflkjsdlkfj kljl')

          if (!files || files.length === 0) {
            return;
          }

          if (resourceType[0] === '视频' && files[0].size > 1024 * 1024 * 1024) {
            fMessage('文件大小不能超过1GB', 'error');
            return;
          }

          if (resourceType[0] !== '视频' && files[0].size > 200 * 1024 * 1024) {
            fMessage('文件大小不能超过200MB', 'error');
            return;
          }

          const sha1: string = await FUtil.Tool.getSHA1Hash(files[0]);
          set$fileInfo({
            sha1: sha1,
            fileName: files[0].name,
          });
          const { data: data_fileIssExists }: {
            data: {
              isExisting: boolean;
            }[];
          } = await FServiceAPI.Storage.fileIsExist({ sha1 });

          if (data_fileIssExists[0].isExisting) {
            const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
              fileSha1: sha1,
            };

            const { data: data_ResourcesBySha1 }: {
              data: {
                userId: number;
                resourceId: string;
                resourceName: string;
                resourceType: string[];
                version: string;
                resourceVersions: {
                  version: string;
                }[];
              }[];
            } = await FServiceAPI.Resource.getResourceBySha1(params3);

            if (data_ResourcesBySha1.length > 0) {
              if (data_ResourcesBySha1[0].userId === FUtil.Tool.getUserIDByCookies()) {
                const usedResources= data_ResourcesBySha1.map((d) => {
                  return d.resourceVersions.map((v) => {
                    return {
                      resourceID: d.resourceId,
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
                // set$selfUsedResource(usedResources);
                const next = await fOccupiedFileResourceVersion({
                  list: usedResources,
                  canOk: true,
                });
                if (next) {
                  const fileInfo = get$fileInfo();
                  if (fileInfo) {
                    onSucceed && onSucceed(fileInfo);
                  }
                }
              } else {
                const usedResources = data_ResourcesBySha1.map((d) => {
                  return d.resourceVersions.map((v: any) => {
                    return {
                      resourceID: d.resourceId,
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
                // set$otherUsedResource(usedResources);
                await fOccupiedFileResourceVersion({
                  list: usedResources,
                  canOk: false,
                });
              }
            } else {
              onSucceed && onSucceed({
                sha1: sha1,
                fileName: files[0].name,
              });
            }
          } else {
            // set$uploadingProgress(0);
            // onChange_uploadingInfo && onChange_uploadingInfo({
            //   name: files[0].name,
            //   percent: 0,
            //   cancelHandler: null,
            // });
            const [promise, cancel] = await FServiceAPI.Storage.uploadFile({
              file: files[0],
              // resourceType: resourceVersionCreatorPage.resourceType,
            }, {
              onUploadProgress(progressEvent: any) {
                // set$uploadingProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
                onChange_uploadingInfo && onChange_uploadingInfo({
                  name: files[0].name,
                  percent: Math.floor(progressEvent.loaded / progressEvent.total * 100),
                  cancelHandler: cancel,
                });
              },
            }, true);
            // uploadCancelHandler.current = cancel;
            onChange_uploadingInfo && onChange_uploadingInfo({
              name: files[0].name,
              percent: 0,
              cancelHandler: cancel,
            });
            const { data, ret, errCode, msg } = await promise;
            if (ret !== 0 || errCode !== 0) {
              return fMessage(msg, 'error');
            }
            // uploadCancelHandler.current = null;
            await FUtil.Tool.promiseSleep(1000);
            // set$uploadingProgress(null);
            onChange_uploadingInfo && onChange_uploadingInfo(null);
            onSucceed && onSucceed({
              sha1: sha1,
              fileName: files[0].name,
            });
          }

        }}
      >本地上传</FComponentsLib.FRectBtn>
    </div>

    {/*<FModal*/}
    {/*  title={null}*/}
    {/*  width={920}*/}
    {/*  open={$selfUsedResource.length > 0}*/}
    {/*  onOk={() => {*/}
    {/*    set$selfUsedResource([]);*/}
    {/*    const fileInfo = get$fileInfo();*/}
    {/*    if (fileInfo) {*/}
    {/*      onSucceed && onSucceed(fileInfo);*/}
    {/*    }*/}
    {/*  }}*/}
    {/*  onCancel={() => {*/}
    {/*    set$selfUsedResource([]);*/}
    {/*  }}*/}
    {/*  okText={'继续上传'}*/}
    {/*  cancelText={'取消'}*/}
    {/*>*/}
    {/*  <div style={{ padding: 20 }}>*/}
    {/*    <div style={{ color: '#EE4040' }}>该文件已经发行过</div>*/}
    {/*  </div>*/}
    {/*  <div style={{ height: 5 }} />*/}
    {/*  <FTable*/}
    {/*    // rowClassName={styles.tableRowClassName}*/}
    {/*    scroll={{ y: $selfUsedResource.length > 5 ? 350 : undefined }}*/}
    {/*    columns={[*/}
    {/*      {*/}
    {/*        title: '资源',*/}
    {/*        dataIndex: 'resourceName',*/}
    {/*        width: 400,*/}
    {/*        render(value, record, index) {*/}
    {/*          return (<FComponentsLib.FContentText*/}
    {/*            text={record.resourceName}*/}
    {/*            style={{ maxWidth: 370 }}*/}
    {/*          />);*/}
    {/*        },*/}
    {/*      },*/}
    {/*      {*/}
    {/*        title: '类型',*/}
    {/*        dataIndex: 'resourceType',*/}
    {/*        width: 280,*/}
    {/*        render(value, record, index) {*/}
    {/*          return (<FComponentsLib.FContentText*/}
    {/*            text={record.resourceType.join(' / ')}*/}
    {/*          />);*/}
    {/*        },*/}
    {/*      },*/}
    {/*      {*/}
    {/*        title: '版本',*/}
    {/*        dataIndex: 'resourceVersion',*/}
    {/*        width: 160,*/}
    {/*        render(value, record, index) {*/}
    {/*          return (<FComponentsLib.FContentText*/}
    {/*            text={record.resourceVersion}*/}
    {/*          />);*/}
    {/*        },*/}
    {/*      },*/}
    {/*      {*/}
    {/*        title: '操作',*/}
    {/*        dataIndex: 'operation',*/}
    {/*        render(value, record, index) {*/}
    {/*          return (<FComponentsLib.FTextBtn onClick={() => {*/}
    {/*            window.open(record.url);*/}
    {/*          }}>查看</FComponentsLib.FTextBtn>);*/}
    {/*        },*/}
    {/*      },*/}
    {/*    ]}*/}
    {/*    dataSource={$selfUsedResource.map((sfur) => {*/}
    {/*      return {*/}
    {/*        key: sfur.url,*/}
    {/*        ...sfur,*/}
    {/*      };*/}
    {/*    })}*/}
    {/*  />*/}
    {/*</FModal>*/}
    {/*<FModal*/}
    {/*  title={null}*/}
    {/*  width={920}*/}
    {/*  open={$otherUsedResource.length > 0}*/}
    {/*  onCancel={() => {*/}
    {/*    set$otherUsedResource([]);*/}
    {/*  }}*/}
    {/*  onOk={() => {*/}
    {/*    set$otherUsedResource([]);*/}
    {/*  }}*/}
    {/*  okText={'关闭'}*/}
    {/*  // cancelText={'取消'}*/}
    {/*  cancelButtonProps={{*/}
    {/*    style: {*/}
    {/*      display: 'none',*/}
    {/*    },*/}
    {/*  }}*/}
    {/*>*/}
    {/*  <FTable*/}
    {/*    // rowClassName={styles.tableRowClassName}*/}
    {/*    scroll={{ y: $selfUsedResource.length > 5 ? 350 : undefined }}*/}
    {/*    columns={[*/}
    {/*      {*/}
    {/*        title: '资源',*/}
    {/*        dataIndex: 'resourceName',*/}
    {/*        width: 400,*/}
    {/*        render(value, record, index) {*/}
    {/*          return (<FComponentsLib.FContentText*/}
    {/*            text={record.resourceName}*/}
    {/*            style={{ maxWidth: 370 }}*/}
    {/*          />);*/}
    {/*        },*/}
    {/*      },*/}
    {/*      {*/}
    {/*        title: '类型',*/}
    {/*        dataIndex: 'resourceType',*/}
    {/*        width: 280,*/}
    {/*        render(value, record, index) {*/}
    {/*          return (<FComponentsLib.FContentText*/}
    {/*            text={record.resourceType.join(' / ')}*/}
    {/*          />);*/}
    {/*        },*/}
    {/*      },*/}
    {/*      {*/}
    {/*        title: '版本',*/}
    {/*        dataIndex: 'resourceVersion',*/}
    {/*        width: 160,*/}
    {/*        render(value, record, index) {*/}
    {/*          return (<FComponentsLib.FContentText*/}
    {/*            text={record.resourceVersion}*/}
    {/*          />);*/}
    {/*        },*/}
    {/*      },*/}
    {/*      {*/}
    {/*        title: '操作',*/}
    {/*        dataIndex: 'operation',*/}
    {/*        render(value, record, index) {*/}
    {/*          return (<FComponentsLib.FTextBtn onClick={() => {*/}
    {/*            window.open(record.url);*/}
    {/*          }}>查看</FComponentsLib.FTextBtn>);*/}
    {/*        },*/}
    {/*      },*/}
    {/*    ]}*/}
    {/*    dataSource={$otherUsedResource.map((sfur) => {*/}
    {/*      return {*/}
    {/*        key: sfur.url,*/}
    {/*        ...sfur,*/}
    {/*      };*/}
    {/*    })}*/}
    {/*  />*/}
    {/*</FModal>*/}
  </>);
}

export default LocalUpload;
