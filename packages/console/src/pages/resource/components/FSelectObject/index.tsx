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

const errorTexts = {
  duplicated: i18nMessage('resource_exist'),
  size: i18nMessage('limit_on_file_size'),
  resourceType: i18nMessage('file_format_incorrect'),
};

export interface ResourceObject {
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly path: string;
  readonly type: string;
  readonly time: string;
}

export interface FSelectObject {
  readonly resourceType: string;
  readonly resourceObject?: ResourceObject | null;
  readonly onChange?: (file: FSelectObject['resourceObject'], deps?: { name: string; type: 'resource' | 'object'; versionRange: string; }[]) => void;
  errorText?: string;

  onChangeErrorText?(text: string): void;
}

function FSelectObject ({resourceObject, onChange, resourceType, errorText, onChangeErrorText}: FSelectObject) {

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [isChecking, setIsChecking] = React.useState<boolean>(false);
  const [errorT, setErrorT] = React.useState<string>('');
  const [progress, setProgress] = React.useState<number | null>(null);

  async function onSelectObject(obj: { id: string; name: string; }) {
    setModalVisible(false);
    // return onChange && onChange(resource);
    // console.log(obj, 'obj903iodslk');
    const params: ObjectDetailsParamsType2 = {
      objectIdOrName: obj.id,
    };
    const {data} = await objectDetails(params);
    // console.log(data, '@#RCXFW');
    onChange && onChange({
      id: data.sha1,
      name: data.objectName,
      size: data.systemProperty.fileSize,
      path: data.bucketName,
      type: resourceType,
      time: '',
    }, data.dependencies);
  }

  async function beforeUpload(file: RcFile) {
    setIsChecking(true);
    if (file.size > 50 * 1024 * 1024 * 1024) {
      setIsChecking(false);
      // return setErrorT(errorTexts.size);
      return onChangeErrorText && onChangeErrorText(errorTexts.size);
    }

    const sha1 = await getSHA1Hash(file);
    const {data: isExists} = await fileIsExist({sha1});
    // console.log(isExist[0], 'datadata23089ujsd');
    setIsChecking(false);

    if (isExists[0].isExisting) {
      return onChange && onChange({
        id: sha1,
        name: file.name,
        size: file.size,
        path: '',
        type: resourceType,
        time: '',
      });
    }

    onChange && onChange({
      id: '',
      name: file.name,
      size: file.size,
      path: '',
      type: resourceType,
      time: '',
    });

    const {data} = await uploadFile({
      file: file,
      resourceType: resourceType,
    }, {
      onUploadProgress(progressEvent: any) {
        setProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
      },
    });

    onChange && onChange({
      id: data.sha1,
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
        ? (<div className={styles.object}>

          {errorText &&
          <div className={styles.objectErrorInfo}>
            <span>{errorText}</span>
            <span>&nbsp;&nbsp;</span>
            {errorText === errorTexts.duplicated && <FTextButton theme="primary">查看</FTextButton>}
          </div>}

          {isChecking
            ? (<Space size={50} className={styles.checking}>
              <span>{i18nMessage('verifying')}<LoadingOutlined style={{paddingLeft: 10}}/></span>
              <span style={{color: '#666'}}>正在校验对象参数，好的创作值得等待…</span>
            </Space>)
            : <Space size={30}>
              <FUpload
                beforeUpload={beforeUpload}
                showUploadList={false}
              >
                <FNormalButton
                >{i18nMessage('upload_from_local')}</FNormalButton>
              </FUpload>
              <FNormalButton
                onClick={() => setModalVisible(true)}
              >{i18nMessage('choose_from_storage')}</FNormalButton>
            </Space>}
        </div>)
        : (<FObjectCard
          resourceObject={resourceObject}
          progress={progress}
          onClickDelete={() => onChange && onChange(null)}
        />)
    }

    <Drawer
      title={'选择对象'}
      onClose={() => setModalVisible(false)}
      visible={modalVisible}
      width={820}
      bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
    >
      {/*<Storage*/}
      {/*  onSelect={onSelect}*/}
      {/*/>*/}
      <FObjectSelector
        visibleResourceType={resourceType}
        // isLoadingTypeless={1}
        // onSelect={(value) => console.log(value, '32dsf8ioj')}
        showRemoveIDsOrNames={[`${resourceObject?.path}/${resourceObject?.name}`]}
        onSelect={onSelectObject}
        // onDelete={(value) => console.log(value, '32dsfewc8ioj')}
        onDelete={() => onChange && onChange(null)}
      />
    </Drawer>
  </div>);
}

export default FSelectObject;


