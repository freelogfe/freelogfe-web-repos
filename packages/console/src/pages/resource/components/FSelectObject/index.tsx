import * as React from 'react';
import styles from "./index.less";
import {FNormalButton, FTextButton} from "@/components/FButton";
import {Space, Drawer, Modal} from "antd";
import FObjectCard from "./ObjectCard";
import {LoadingOutlined} from '@ant-design/icons';
import FUpload from "@/components/FUpload";
import * as CryptoJS from 'crypto-js';

// import Storage, {ResourceObject} from './Storage';
import {RcFile} from "antd/lib/upload/interface";
import {fileIsExist, objectDetails, ObjectDetailsParamsType2, uploadFile} from "@/services/storages";
import {i18nMessage} from "@/utils/i18n";
import FObjectSelector from "@/containers/FObjectSelector";
import {getSHA1Hash} from "@/utils/tools";
import {resourceIsUsedByOther, ResourceIsUsedByOtherParamsType} from "@/services/resources";
import FDrawer from "@/components/FDrawer";

const errorTexts = {
  duplicated: i18nMessage('resource_exist'),
  size: i18nMessage('limit_on_file_size'),
  resourceType: i18nMessage('file_format_incorrect'),
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

  onError?(value: { sha1: string, errorText: string }): void;

  errorText?: string;

  onChangeErrorText?(text: string): void;
}

let uploadCancelHandler: any = null;

function FSelectObject({resourceObject, onChange, resourceType, errorText, onChangeErrorText, onError}: FSelectObject) {

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [isChecking, setIsChecking] = React.useState<boolean>(false);
  const [errorT, setErrorT] = React.useState<string>('');
  const [progress, setProgress] = React.useState<number | null>(null);

  // 选择对象
  async function onSelectObject(obj: { id: string; name: string; }) {
    setModalVisible(false);
    const params: ObjectDetailsParamsType2 = {
      objectIdOrName: obj.id,
    };
    const {data} = await objectDetails(params);

    const params3: ResourceIsUsedByOtherParamsType = {
      fileSha1: data.sha1,
    };

    const {data: data3} = await resourceIsUsedByOther(params3);
    if (!data3) {
      return onChangeErrorText && onChangeErrorText(errorTexts.duplicated);
    }

    // TODO: 检查类型是否匹配


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
      return onChangeErrorText && onChangeErrorText(errorTexts.size);
    }

    const sha1: string = await getSHA1Hash(file);

    const params3: ResourceIsUsedByOtherParamsType = {
      fileSha1: sha1,
    };

    const {data: data3} = await resourceIsUsedByOther(params3);
    if (!data3) {
      setIsChecking(false);
      return onChangeErrorText && onChangeErrorText(errorTexts.duplicated);
    }

    const {data: isExists} = await fileIsExist({sha1});
    // console.log(isExist[0], 'datadata23089ujsd');
    setIsChecking(false);

    if (isExists[0].isExisting) {

      // TODO: 检查类型是否匹配


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

    // TODO: 检查异常
    const [promise, cancel] = await uploadFile({
      file: file,
      resourceType: resourceType,
    }, {
      onUploadProgress(progressEvent: any) {
        console.log(progressEvent, 'PPPPPPPPPEEEEEEEEE');
        setProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
      },
    }, true);
    uploadCancelHandler = cancel;
    // console.log(returns, 'returnsreturns1234');
    await promise;
    uploadCancelHandler = null;

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
              <span>{i18nMessage('verifying')}<LoadingOutlined style={{paddingLeft: 10}}/></span>
              <span style={{color: '#666'}}>正在校验对象参数，好的创作值得等待…</span>
            </Space>)
            : <Space size={15}>
              <FUpload
                accept={resourceType === 'image' ? 'image/*' : '*'}
                beforeUpload={beforeUpload}
                showUploadList={false}
              >
                <FNormalButton
                  theme="grey"
                >{i18nMessage('upload_from_local')}</FNormalButton>
              </FUpload>
              <FNormalButton
                theme="grey"
                onClick={() => setModalVisible(true)}
              >{i18nMessage('choose_from_storage')}</FNormalButton>
            </Space>}

          {errorText &&
          <div className={styles.objectErrorInfo}>
            <span>{errorText}</span>
            <span>&nbsp;&nbsp;</span>
            {errorText === errorTexts.duplicated && <FTextButton theme="primary">查看</FTextButton>}
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


