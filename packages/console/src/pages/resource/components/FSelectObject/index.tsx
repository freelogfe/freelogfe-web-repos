import * as React from 'react';
import styles from "./index.less";
import {FNormalButton, FTextButton} from "@/components/FButton";
import {Space, Drawer, Modal} from "antd";
import FObjectCard from "./ObjectCard";
import {LoadingOutlined} from '@ant-design/icons';
import FUpload from "@/components/FUpload";
import * as CryptoJS from 'crypto-js';

import Storage, {ResourceObject} from './Storage';
import {RcFile} from "antd/lib/upload/interface";
import {fileIsExist, uploadFile} from "@/services/storages";

const errorTexts = {
  duplicated: '该资源已存在，不能重复创建，请重新选择。',
  size: '文件大小不能超过50MB，请重新选择。',
  resourceType: '所选文件格式和资源类型不匹配，请重新选择。',
};

export interface FSelectObject {
  readonly resourceType: string;
  readonly resourceObject?: ResourceObject | null;
  readonly onChange?: (file: FSelectObject['resourceObject']) => void;
  errorText?: string;

  onChangeErrorText?(text: string): void;
}

export default function ({resourceObject, onChange, resourceType, errorText, onChangeErrorText}: FSelectObject) {

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [isChecking, setIsChecking] = React.useState<boolean>(false);
  const [errorT, setErrorT] = React.useState<string>('');
  const [progress, setProgress] = React.useState<number | null>(null);

  function onSelect(resource: ResourceObject) {
    setModalVisible(false);
    return onChange && onChange(resource);
  }

  async function beforeUpload(file: RcFile) {
    setIsChecking(true);
    if (file.size > 50 * 1024 * 1024 * 1024) {
      setIsChecking(false);
      // return setErrorT(errorTexts.size);
      return onChangeErrorText && onChangeErrorText(errorTexts.size);
    }

    const sha1 = await getSHA1Hash(file);
    const {data: isExist} = await fileIsExist({sha1});
    setIsChecking(false);

    if (isExist) {
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
      }
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
              <span>校验中<LoadingOutlined style={{paddingLeft: 10}}/></span>
              <span style={{color: '#666'}}>正在校验对象参数，好的创作值得等待…</span>
            </Space>)
            : <Space size={30}>
              <FNormalButton
                theme={'weaken'}
                onClick={() => setModalVisible(true)}
              >从存储空间选择</FNormalButton>
              <FUpload
                beforeUpload={beforeUpload}
                showUploadList={false}
              >
                <FNormalButton
                  theme={'weaken'}
                >本地上传</FNormalButton>
              </FUpload>
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
      <Storage
        onSelect={onSelect}
      />
    </Drawer>
  </div>);
}

/**
 * 根据 File 获取 SHA1 Hash 字符串
 * @param file
 * @return {Promise<string>}
 */
function getSHA1Hash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (evt) {
      const wordArray = CryptoJS.lib.WordArray.create(reader.result);
      const hash = CryptoJS.SHA1(wordArray).toString();
      resolve(hash);

      // const sha1sum = crypto.createHash('sha1');
      // sha1sum.update(chunk)
      // console.log(sha1sum.digest('hex'), 'sha1sum.digest(\'hex\')');
      // resolve(sha1sum.digest('hex'));

    };
    // reader.readAsBinaryString(file);
    reader.readAsArrayBuffer(file);
  });
}
