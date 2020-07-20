import * as React from 'react';
import styles from "./index.less";
import {FNormalButton, FTextButton} from "@/components/FButton";
import {Space, Drawer, Modal} from "antd";
import FObjectCard from "./ObjectCard";
import {LoadingOutlined} from '@ant-design/icons';
import FDropdown from "@/components/FDropdown";
import FInput from "@/components/FInput";
import {FContentText} from "@/components/FText";
// import CryptoJS from 'crypto-js';

import Storage from './Storage';

const errorText = {
  duplicated: '该资源已存在，不能重复创建，请重新选择。',
  size: '文件大小不能超过50MB，请重新选择。',
  resourceType: '所选文件格式和资源类型不匹配，请重新选择。',
};

interface FSelectObject {
  resourceObject?: {
    id: string;
    name: string;
    size: number;
    path: string;
  } | null;
}

export default function ({resourceObject}: FSelectObject) {

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [isChecking, setIsChecking] = React.useState<boolean>(false);

  const [errorT, setErrorT] = React.useState<string>('');

  return (<div>
    {
      !resourceObject
        ? (<div className={styles.object}>

          {errorT &&
          <div className={styles.objectErrorInfo}>{errorT}&nbsp;&nbsp;<FTextButton theme="primary">查看</FTextButton></div>}

          <Space size={30}>
            <FNormalButton
              theme={'weaken'}
              onClick={() => setModalVisible(true)}
            >从存储空间选择</FNormalButton>
            <FNormalButton theme={'weaken'}>本地上传</FNormalButton>
          </Space>

          {isChecking && (<div className={styles.checking}>校验中 <LoadingOutlined/></div>)}
        </div>)
        : (<FObjectCard resourceObject={resourceObject} progress={75}/>)
    }

    <Drawer
      title={'选择对象'}
      onClose={() => setModalVisible(false)}
      visible={modalVisible}
      width={820}
      bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
    ><Storage onSelect={() => setModalVisible(false)}/></Drawer>
  </div>);
}

/**
 * 根据 File 获取 SHA1 Hash 字符串
 * @param file
 * @return {Promise<string>}
 */
// function getSHA1Hash(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = function (evt) {
//       var wordArray = CryptoJS.lib.WordArray.create(reader.result);
//       var hash = CryptoJS.SHA1(wordArray).toString();
//       resolve(hash);
//
//       // const sha1sum = crypto.createHash('sha1');
//       // sha1sum.update(chunk)
//       // console.log(sha1sum.digest('hex'), 'sha1sum.digest(\'hex\')');
//       // resolve(sha1sum.digest('hex'));
//
//     };
//     // reader.readAsBinaryString(file);
//     reader.readAsArrayBuffer(file);
//   });
// }
