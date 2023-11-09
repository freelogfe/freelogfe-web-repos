import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

interface UploadFileProps {

}

function UploadFile({}: UploadFileProps) {
  return (<div className={styles.container2}>
    <div style={{ height: 35 }} />
    <div className={styles.nav}>
      <div className={styles.left}>批量发行资源</div>
      <div style={{ width: 10 }} />
      <div className={styles.other}>{'>'}</div>
      <div style={{ width: 7 }} />
      <div className={styles.other}>上传资源文件</div>
    </div>
    <div style={{ height: 35 }} />
    <div className={styles.cards}>
      <div className={styles.localUpload}>
        <FComponentsLib.FIcons.FLocalUpload style={{ fontSize: 60 }} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FContentText text={'选择本地文件作为发行对象'} type={'additional2'} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FRectBtn
          type={'primary'}
        >本地上传</FComponentsLib.FRectBtn>
      </div>

      <div className={styles.storageSpace}>
        <FComponentsLib.FIcons.FStorageSpace style={{ fontSize: 60 }} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FContentText
          text={'选择存储空间对象作为发行对象'}
          type={'additional2'}
        />
        <div style={{ height: 40 }} />
        <FComponentsLib.FRectBtn
          type={'primary'}
        >存储空间导入</FComponentsLib.FRectBtn>
      </div>
    </div>
  </div>);
}

export default UploadFile;
