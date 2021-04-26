import * as React from 'react';
import styles from "./index.less";
// import {FNormalButton, FTextButton} from "@/components/FButton";
import {Space} from "antd";
import FObjectCard from "./ObjectCard";
import {LoadingOutlined} from '@ant-design/icons';
import FUpload from "@/components/FUpload";
import {RcFile} from "antd/lib/upload/interface";
import FObjectSelector from "@/containers/FObjectSelector";
import {getSHA1Hash} from "@/utils/tools";
import FDrawer from "@/components/FDrawer";
import FUtil from "@/utils";
import {FApiServer} from "@/services";
import {FRectBtn} from '@/components/FButton';
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceVersionCreatorPageModelState} from "@/models/connect";
import {
  ChangeAction,
  FetchRawPropsAction,
  HandleObjectInfoAction,
  SelectLocalFile
} from "@/models/resourceVersionCreatorPage";
import FTable from "@/components/FTable";

const errorTexts = {
  duplicated: FUtil.I18n.message('resource_exist'),
  size: FUtil.I18n.message('limit_on_file_size'),
  resourceType: FUtil.I18n.message('error_wrongfileformat'),
};

// export interface ResourceObject {
//   sha1: string;
//   name: string;
//   size: number;
//   path: string;
//   type: string;
//   time: string;
//   objectId?: string;
// }

export interface FSelectObject {
  // resourceType: string;
  // resourceObject?: ResourceObject | null;

  // onChange?(file: FSelectObject['resourceObject']): void;

  // onError?(value: { sha1: string, text: string }): void;

  // errorText?: string;

  // onClickDuplicatedLook?: () => void;

  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

let uploadCancelHandler: any = null;

function FSelectObject({dispatch, resourceVersionCreatorPage}: FSelectObject) {

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [isChecking, setIsChecking] = React.useState<boolean>(false);
  // const [errorT, setErrorT] = React.useState<string>('');
  const [progress, setProgress] = React.useState<number | null>(null);

  async function onChange(payload: ChangeAction['payload']) {
    await dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload,
    });
  }

  // 选择对象
  async function onSelectObject(obj: { id: string; name: string; }) {
    setModalVisible(false);
    const params: Parameters<typeof FApiServer.Storage.objectDetails>[0] = {
      objectIdOrName: obj.id,
    };
    const {data} = await FApiServer.Storage.objectDetails(params);

    const params3: Parameters<typeof FApiServer.Resource.resourceIsUsedByOther>[0] = {
      fileSha1: data.sha1,
    };

    const {data: data3} = await FApiServer.Resource.resourceIsUsedByOther(params3);
    if (!data3) {
      return onError({
        sha1: data.sha1,
        text: errorTexts.duplicated
      });
    }

    onChange1 && onChange1({
      sha1: data.sha1,
      name: data.objectName,
      size: data.systemProperty.fileSize,
      path: data.bucketName,
      type: resourceVersionCreatorPage.resourceType,
      time: '',
      objectId: obj.id,
    });
  }

  async function beforeUpload(file: RcFile) {
    setIsChecking(true);
    // console.log(file.size, 50 * 1024 * 1024 * 1024, '########');
    if (file.size > 50 * 1024 * 1024) {
      setIsChecking(false);
      return onChange({
        selectedFileStatus: 1,
      });
    }

    const sha1: string = await getSHA1Hash(file);

    const params3: Parameters<typeof FApiServer.Resource.getResourceBySha1>[0] = {
      fileSha1: sha1,
    };

    const {data: data3} = await FApiServer.Resource.getResourceBySha1(params3);
    console.log(data3, 'data3data3data3data3data3@#########');
    if (data3.length > 0) {
      setIsChecking(false);
      console.log(data3, 'data3@@#$@#$#$@#');
      return onChange({
        selectedFileStatus: 3,
        selectedFileUsedResource: data3.map((d: any) => {
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
            }
          });
        }).flat(),
      });
    }

    const {data: isExists}: any = await FApiServer.Storage.fileIsExist({sha1});
    // console.log(isExist[0], 'datadata23089ujsd');

    if (isExists[0].isExisting) {
      setIsChecking(false);
      // return onChange1({
      //   sha1: sha1,
      //   name: file.name,
      //   size: file.size,
      //   path: '',
      //   type: resourceVersionCreatorPage.resourceType,
      //   time: '',
      // });
      return onChange({
        selectedFileName: file.name,
        selectedFileSha1: sha1,
        selectedFileOrigin: '本地上传',
        selectedFileStatus: -2,
      });
    }

    // onChange1({
    //   sha1: '',
    //   name: file.name,
    //   size: file.size,
    //   path: '',
    //   type: resourceVersionCreatorPage.resourceType,
    //   time: '',
    // });

    const [promise, cancel] = await FApiServer.Storage.uploadFile({
      file: file,
      resourceType: resourceVersionCreatorPage.resourceType,
    }, {
      onUploadProgress(progressEvent: any) {
        // console.log(progressEvent, 'PPPPPPPPPEEEEEEEEE');
        setProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
      },
    }, true);
    uploadCancelHandler = cancel;
    // console.log(returns, 'returnsreturns1234');
    const {data} = await promise;
    uploadCancelHandler = null;
    // console.log(data, 'data1241234');
    if (!data) {
      // onError({
      //   sha1: sha1,
      //   text: errorTexts.resourceType,
      // });

    }

    // onChange1({
    //   sha1: sha1,
    //   name: file.name,
    //   size: file.size,
    //   path: '',
    //   type: resourceVersionCreatorPage.resourceType,
    //   time: '',
    // });
    onChange({
      selectedFileName: file.name,
      selectedFileSha1: sha1,
      selectedFileOrigin: '本地上传',
      selectedFileStatus: -2,
    });
    setProgress(null);
  }

  async function onChange1(value: any) {
    // console.log(value, '#@ERWADFSASDFSADF');
    if (!value) {
      return onChange({
        // resourceObject: null,
        // resourceObjectError: {
        //   sha1: '',
        //   text: '',
        // },
        selectedFileName: '',

        rawProperties: [],
        baseProperties: [],
        customOptionsData: [],
        dataIsDirty: true,
      });
    }
    await onChange({
      // resourceObject: value,
      // resourceObjectError: {sha1: '', text: ''},
      dataIsDirty: true,
    });
    await dispatch<FetchRawPropsAction>({
      type: 'resourceVersionCreatorPage/fetchRawProps',
    });

    if (value.objectId) {
      dispatch<HandleObjectInfoAction>({
        type: 'resourceVersionCreatorPage/handleObjectInfo',
        payload: value.objectId,
      });
    }
  }

  function onError(value: any) {
    dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload: {
        // resourceObjectError: value,
        // resourceObject: null,
      },
    });
  }

  return (<div>
    {
      !resourceVersionCreatorPage.selectedFileName
        ? (<div>
          <Space size={50}>
            {
              isChecking
                ? (<Space size={50} className={styles.checking}>
                  <span>{FUtil.I18n.message('verifying')}<LoadingOutlined style={{paddingLeft: 10}}/></span>
                  <span style={{color: '#666'}}>正在校验对象参数，好的创作值得等待…</span>
                </Space>)
                : <Space size={15}>
                  <FUpload
                    // accept={resourceType === 'image' ? 'image/*' : '*'}
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                  >
                    <FRectBtn
                      type="default"
                    >{FUtil.I18n.message('upload_from_local')}</FRectBtn>
                  </FUpload>
                  <FRectBtn
                    type="default"
                    onClick={() => setModalVisible(true)}
                  >{FUtil.I18n.message('choose_from_storage')}</FRectBtn>
                </Space>}

            {
              resourceVersionCreatorPage.selectedFileStatus === 1 &&
              <div className={styles.objectErrorInfo}>
                <span>{errorTexts.size}</span>
              </div>
            }
          </Space>
          <div>
            <FTable
              columns={[
                {
                  title: '资源',
                  dataIndex: 'resource',
                  width: 400,
                },
                {
                  title: '类型',
                  dataIndex: 'type',
                  width: 100,
                },
                {
                  title: '版本',
                  dataIndex: 'version',
                },
                {
                  title: '操作',
                  dataIndex: 'operation',
                },
              ]}
              dataSource={[
                {}
              ]}
            />
          </div>

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
            });
          }}
        />)
    }

    <FDrawer
      title={'选择对象'}
      onClose={() => setModalVisible(false)}
      visible={modalVisible}
      width={820}
    >
      <FObjectSelector
        visibleResourceType={resourceVersionCreatorPage.resourceType}
        showRemoveIDsOrNames={[`${resourceVersionCreatorPage.selectedFileOrigin}/${resourceVersionCreatorPage.selectedFileName}`]}
        onSelect={onSelectObject}
        onDelete={() => onChange1(null)}
      />
    </FDrawer>
  </div>);
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(FSelectObject);


