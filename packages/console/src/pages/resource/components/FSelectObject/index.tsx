import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FObjectCard from './ObjectCard';
import { LoadingOutlined } from '@ant-design/icons';
import FUpload from '@/components/FUpload';
import { RcFile } from 'antd/lib/upload/interface';
import FObjectSelector from '@/containers/FObjectSelector';
import FDrawer from '@/components/FDrawer';
import FUtil1 from '@/utils';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceVersionCreatorPageModelState, UserModelState } from '@/models/connect';
import {
  ChangeAction,
  FetchRawPropsAction,
  HandleObjectInfoAction,
} from '@/models/resourceVersionCreatorPage';
import FTable from '@/components/FTable';
import { FContentText } from '@/components/FText';
import * as AHooks from 'ahooks';
// import FLoadingTip from "@/components/FLoadingTip";
import { FLoading } from '@/components/FIcons';

const errorTexts = {
  duplicated: FUtil1.I18n.message('resource_exist'),
  size: FUtil1.I18n.message('limit_on_file_size'),
  resourceType: FUtil1.I18n.message('error_wrongfileformat'),
};

export interface FSelectObject {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
  user: UserModelState;
}

let uploadCancelHandler: any = null;
let handleDataUploadOrImportObject: any = null;

function FSelectObject({ dispatch, resourceVersionCreatorPage, user }: FSelectObject) {

  const [progress, setProgress] = React.useState<number | null>(null);

  async function onChange(payload: ChangeAction['payload']) {
    await dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload,
      caller: '234532434345234324534%#$%#$%#$%#$#$',
    });
  }

  AHooks.useUnmount(() => {
    uploadCancelHandler = null;
    handleDataUploadOrImportObject = null;
  });

  function handleDataUploadOrImportObjectFunc(obj?: { id: string; name: string; }) {

    return function() {
      onChange({
        selectedFileStatus: -3,
      });
      if (obj) {
        dispatch<HandleObjectInfoAction>({
          type: 'resourceVersionCreatorPage/handleObjectInfo',
          payload: obj.id,
        });
      } else {
        dispatch<FetchRawPropsAction>({
          type: 'resourceVersionCreatorPage/fetchRawProps',
        });
      }
    };
  }

  /**
   * 选择对象调用函数
   * @param obj
   */
  async function onSelectObject(obj: { id: string; name: string; }) {
    // setModalVisible(false);
    const params: Parameters<typeof FServiceAPI.Storage.objectDetails>[0] = {
      objectIdOrName: obj.id,
    };
    const { data } = await FServiceAPI.Storage.objectDetails(params);

    const params4: Parameters<typeof FServiceAPI.Storage.fileProperty>[0] = {
      sha1: data.sha1,
      resourceType: resourceVersionCreatorPage.resourceType,
    };

    const { data: data4 } = await FServiceAPI.Storage.fileProperty(params4);
    // console.log(data4, 'data4data4data4data4');
    if (!data4) {
      return onChange({
        selectedFileStatus: 2,
        selectedFileObjectDrawerVisible: false,
      });
    }

    await onChange({
      selectedFileName: data.objectName,
      selectedFileSha1: data.sha1,
      selectedFileOrigin: data.bucketName,
    });

    const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
      fileSha1: data.sha1,
    };

    const { data: data3 } = await FServiceAPI.Resource.getResourceBySha1(params3);
    // console.log(data3, 'data3data3data3data3data3@#########');

    // 如果之前已经被使用过，展示使用列表
    if (data3.length > 0) {
      // console.log(data3, 'data3@@#$@#$#$@#');
      handleDataUploadOrImportObject = handleDataUploadOrImportObjectFunc({
        id: data.objectId,
        name: data.objectName,
      });
      await onChange({
        selectedFileStatus: data3[0].userId === user.info?.userId ? 3 : 4,
        selectedFileUsedResource: data3.map((d: any) => {
          const isSelf: boolean = d.userId === user.info?.userId;
          return d.resourceVersions.map((v: any) => {
            return {
              resourceId: d.resourceId,
              resourceName: d.resourceName,
              resourceType: d.resourceType,
              resourceVersion: v.version,
              url: isSelf
                ? FUtil.LinkTo.resourceVersion({
                  resourceID: d.resourceId,
                  version: v.version,
                })
                : FUtil.LinkTo.resourceDetails({
                  resourceID: d.resourceId,
                  version: v.version,
                }),
            };
          });
        }).flat(),
      });
    } else {

      await onChange({
        selectedFileStatus: -3,
      });

      await dispatch<HandleObjectInfoAction>({
        type: 'resourceVersionCreatorPage/handleObjectInfo',
        payload: data.objectId,
      });
    }

    onChange({
      selectedFileObjectDrawerVisible: false,
      dataIsDirty: true,
    });
  }

  /**
   * 本地上传文件处理函数
   * @param file
   */
  async function beforeUpload(file: RcFile) {
    // setIsChecking(true);
    // console.log(file.size, 50 * 1024 * 1024 * 1024, '########');
    if (file.size > 50 * 1024 * 1024) {
      // setIsChecking(false);
      return onChange({
        selectedFileStatus: 1,
      });
    }

    onChange({
      selectedFileStatus: -1,
    });

    const sha1: string = await FUtil.Tool.getSHA1Hash(file);

    const { data: isExists }: any = await FServiceAPI.Storage.fileIsExist({ sha1 });
    if (isExists[0].isExisting) {

      const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
        fileSha1: sha1,
      };

      const { data: data3 } = await FServiceAPI.Resource.getResourceBySha1(params3);
      // console.log(data3, 'data3data3data3data3data3@#########');

      // 如果之前已经被使用过，展示使用列表
      if (data3.length > 0) {
        // console.log(data3, 'data3@@#$@#$#$@#');
        handleDataUploadOrImportObject = handleDataUploadOrImportObjectFunc();
        return onChange({
          selectedFileName: file.name,
          selectedFileSha1: sha1,
          selectedFileOrigin: '本地上传',
          selectedFileStatus: data3[0].userId === user.info?.userId ? 3 : 4,
          selectedFileUsedResource: data3.map((d: any) => {
            const isSelf: boolean = d.userId === user.info?.userId;
            return d.resourceVersions.map((v: any) => {
              return {
                resourceId: d.resourceId,
                resourceName: d.resourceName,
                resourceType: d.resourceType,
                resourceVersion: v.version,
                url: isSelf
                  ? FUtil.LinkTo.resourceVersion({
                    resourceID: d.resourceId,
                    version: v.version,
                  })
                  : FUtil.LinkTo.resourceDetails({
                    resourceID: d.resourceId,
                    version: v.version,
                  }),
              };
            });
          }).flat(),
        });
      }

    } else {
      onChange({
        selectedFileStatus: -2,
      });
      const [promise, cancel] = await FServiceAPI.Storage.uploadFile({
        file: file,
        resourceType: resourceVersionCreatorPage.resourceType,
      }, {
        onUploadProgress(progressEvent: any) {
          setProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
        },
      }, true);
      uploadCancelHandler = cancel;
      // console.log(returns, 'returnsreturns1234');
      const { data } = await promise;
      uploadCancelHandler = null;
      // console.log(data, 'data1241234');
      // if (!data) {
      //
      // }

      setProgress(null);
    }

    onChange({
      selectedFileName: file.name,
      selectedFileSha1: sha1,
      selectedFileOrigin: '本地上传',
      selectedFileStatus: -3,
      dataIsDirty: true,
    });

    dispatch<FetchRawPropsAction>({
      type: 'resourceVersionCreatorPage/fetchRawProps',
    });

  }

  function onError(value: any) {
    dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload: {
        // resourceObjectError: value,
        // resourceObject: null,
      },
      caller: '234532434345234324534%#$%#$%#--=--09-090-%#$#$',
    });
  }

  return (<div>
    {
      resourceVersionCreatorPage.selectedFileStatus !== -3 && resourceVersionCreatorPage.selectedFileStatus !== -2
        ? (<div>
          <Space size={50} style={{ height: 38 }}>
            {
              resourceVersionCreatorPage.selectedFileStatus === -1
                ? (<Space size={50} className={styles.checking}>
                  <span>{FUtil1.I18n.message('verifying')}<FLoading style={{ paddingLeft: 10 }} /></span>
                  <span style={{ color: '#666' }}>正在校验对象参数，好的创作值得等待…</span>
                </Space>)
                : (<Space size={15}>
                  <FUpload
                    // accept={resourceType === 'image' ? 'image/*' : '*'}
                    beforeUpload={(file, FileList) => {
                      beforeUpload(file);
                      return false;
                    }}
                    showUploadList={false}
                  >
                    <FRectBtn
                      type='default'
                    >{FUtil1.I18n.message('upload_from_local')}</FRectBtn>
                  </FUpload>
                  <FRectBtn
                    type='default'
                    onClick={() => {
                      // setModalVisible(true)
                      onChange({
                        selectedFileObjectDrawerVisible: true,
                      });
                    }}
                  >{FUtil1.I18n.message('choose_from_storage')}</FRectBtn>
                </Space>)
            }

            {
              resourceVersionCreatorPage.selectedFileStatus === 1 &&
              (<Space>
                <span className={styles.objectErrorInfo}>{errorTexts.size}</span>
              </Space>)
            }

            {
              resourceVersionCreatorPage.selectedFileStatus === 2 &&
              (<Space>
                <span className={styles.objectErrorInfo}>{errorTexts.resourceType}</span>
              </Space>)
            }

            {
              resourceVersionCreatorPage.selectedFileStatus === 3 &&
              (<Space size={10}>
                <span className={styles.objectErrorInfo}>该文件/对象已经发行过。</span>
                <FTextBtn onClick={() => {
                  onChange({
                    // resourceObject: value,
                    // resourceObjectError: {sha1: '', text: ''},
                    selectedFileStatus: -3,
                    dataIsDirty: true,
                  });
                  // dispatch<FetchRawPropsAction>({
                  //   type: 'resourceVersionCreatorPage/fetchRawProps',
                  // });
                  handleDataUploadOrImportObject();
                }}>继续上传/导入</FTextBtn>
              </Space>)
            }

            {
              resourceVersionCreatorPage.selectedFileStatus === 4 &&
              (<Space>
                <span className={styles.objectErrorInfo}>{errorTexts.duplicated}</span>
              </Space>)
            }
          </Space>
          {
            (resourceVersionCreatorPage.selectedFileStatus === 3 || resourceVersionCreatorPage.selectedFileStatus === 4) && (<>
              <div style={{ height: 20 }} />
              <div className={styles.tableWrap}>
                <FTable
                  rowClassName={styles.tableRowClassName}
                  scroll={{ y: resourceVersionCreatorPage.selectedFileUsedResource.length > 5 ? 350 : undefined }}
                  columns={[
                    {
                      title: '资源',
                      dataIndex: 'resourceName',
                      width: 400,
                      render(value: any, record: any, index: number) {
                        return (<FContentText
                          text={record.resourceName}
                          style={{ maxWidth: 370 }}
                        />);
                      },
                    },
                    {
                      title: '类型',
                      dataIndex: 'resourceType',
                      width: 100,
                      render(value: any, record: any, index: number) {
                        return (<FContentText
                          text={record.resourceType}
                        />);
                      },
                    },
                    {
                      title: '版本',
                      dataIndex: 'resourceVersion',
                      render(value: any, record: any, index: number) {
                        return (<FContentText
                          text={record.resourceVersion}
                        />);
                      },
                    },
                    {
                      title: '操作',
                      dataIndex: 'operation',
                      render(value: any, record: any, index: number) {
                        return (<FTextBtn onClick={() => {
                          window.open(record.url);
                        }}>查看</FTextBtn>);
                      },
                    },
                  ]}
                  dataSource={resourceVersionCreatorPage.selectedFileUsedResource.map((sfur) => {
                    return {
                      key: sfur.url,
                      ...sfur,
                    };
                  })}
                />
              </div>
            </>)
          }

        </div>)
        : (<FObjectCard
          resourceObject={{
            name: resourceVersionCreatorPage.selectedFileName,
            path: resourceVersionCreatorPage.selectedFileOrigin,
          }}
          progress={progress}
          onClickDelete={() => {
            if (uploadCancelHandler) {
              uploadCancelHandler();
              uploadCancelHandler = null;
            }
            onChange({
              selectedFileSha1: '',
              selectedFileName: '',
              selectedFileOrigin: '',
              selectedFileStatus: 0,
              rawProperties: [],
              baseProperties: [],
              customOptionsData: [],
            });
          }}
        />)
    }

    <FDrawer
      title={'选择对象'}
      onClose={() => {
        // setModalVisible(false)
        onChange({
          selectedFileObjectDrawerVisible: false,
        });
      }}
      visible={resourceVersionCreatorPage.selectedFileObjectDrawerVisible}
      width={820}
    >
      <FObjectSelector
        visibleResourceType={resourceVersionCreatorPage.resourceType}
        // showRemoveIDsOrNames={[`${resourceVersionCreatorPage.selectedFileOrigin}/${resourceVersionCreatorPage.selectedFileName}`]}
        disabledIDsOrNames={[`${resourceVersionCreatorPage.selectedFileOrigin}/${resourceVersionCreatorPage.selectedFileName}`]}
        onSelect={onSelectObject}
      />
    </FDrawer>
  </div>);
}

export default connect(({ resourceVersionCreatorPage, user }: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
  user: user,
}))(FSelectObject);


