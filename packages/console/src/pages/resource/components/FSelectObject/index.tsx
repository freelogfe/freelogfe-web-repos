import * as React from 'react';
import styles from "./index.less";
import {FNormalButton, FTextButton} from "@/components/FButton";
import {Space, Drawer, Modal} from "antd";
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

const errorTexts = {
  duplicated: FUtil.I18n.message('resource_exist'),
  size: FUtil.I18n.message('limit_on_file_size'),
  resourceType: FUtil.I18n.message('error_wrongfileformat'),
};

export interface ResourceObject {
  sha1: string;
  name: string;
  size: number;
  path: string;
  type: string;
  time: string;
  objectId?: string;
}

export interface FSelectObject {
  resourceType: string;
  resourceObject?: ResourceObject | null;

  onChange?(file: FSelectObject['resourceObject']): void;

  onError?(value: { sha1: string, text: string }): void;

  errorText?: string;

  onClickDuplicatedLook?: () => void;
}

let uploadCancelHandler: any = null;

function FSelectObject({resourceObject, onChange, resourceType, errorText, onError, onClickDuplicatedLook}: FSelectObject) {

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [isChecking, setIsChecking] = React.useState<boolean>(false);
  // const [errorT, setErrorT] = React.useState<string>('');
  const [progress, setProgress] = React.useState<number | null>(null);

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
      return onError && onError({
        sha1: data.sha1,
        text: errorTexts.duplicated
      });
    }

    onChange && onChange({
      sha1: data.sha1,
      name: data.objectName,
      size: data.systemProperty.fileSize,
      path: data.bucketName,
      type: resourceType,
      time: '',
      objectId: obj.id,
    });
  }

  async function beforeUpload(file: RcFile) {
    setIsChecking(true);
    // console.log(file.size, 50 * 1024 * 1024 * 1024, '########');
    if (file.size > 50 * 1024 * 1024) {
      setIsChecking(false);
      // return setErrorT(errorTexts.size);
      return onError && onError({
        sha1: '',
        text: errorTexts.size
      });
    }

    const sha1: string = await getSHA1Hash(file);

    const params3: Parameters<typeof FApiServer.Resource.resourceIsUsedByOther>[0] = {
      fileSha1: sha1,
    };

    const {data: data3} = await FApiServer.Resource.resourceIsUsedByOther(params3);
    if (!data3) {
      setIsChecking(false);
      return onError && onError({
        sha1: sha1,
        text: errorTexts.duplicated
      });
    }

    const {data: isExists} = await FApiServer.Storage.fileIsExist({sha1});
    // console.log(isExist[0], 'datadata23089ujsd');
    setIsChecking(false);

    if (isExists[0].isExisting) {

      return onChange && onChange({
        sha1: sha1,
        name: file.name,
        size: file.size,
        path: '',
        type: resourceType,
        time: '',
      });
    }

    onChange && onChange({
      sha1: '',
      name: file.name,
      size: file.size,
      path: '',
      type: resourceType,
      time: '',
    });

    const [promise, cancel] = await FApiServer.Storage.uploadFile({
      file: file,
      resourceType: resourceType,
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
    console.log(data, 'data1241234');
    if (!data) {
      return onError && onError({
        sha1: sha1,
        text: errorTexts.resourceType,
      });
    }

    onChange && onChange({
      sha1: sha1,
      name: file.name,
      size: file.size,
      path: '',
      type: resourceType,
      time: '',
    });
    setProgress(null);
  }

  return (<div>
    {
      !resourceObject
        ? (<Space size={50}>
          {isChecking
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

          {errorText &&
          <div className={styles.objectErrorInfo}>
            <span>{errorText}</span>
            <span>&nbsp;&nbsp;</span>
            {errorText === errorTexts.duplicated && <FTextButton
              theme="primary"
              onClick={() => onClickDuplicatedLook && onClickDuplicatedLook()}
            >查看</FTextButton>}
          </div>}
        </Space>)
        : (<FObjectCard
          resourceObject={resourceObject}
          progress={progress}
          onClickDelete={() => {
            if (uploadCancelHandler) {
              uploadCancelHandler();
              uploadCancelHandler = null;
            }
            onChange && onChange(null);
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
        visibleResourceType={resourceType}
        showRemoveIDsOrNames={[`${resourceObject?.path}/${resourceObject?.name}`]}
        onSelect={onSelectObject}
        onDelete={() => onChange && onChange(null)}
      />
    </FDrawer>
  </div>);
}

export default FSelectObject;


