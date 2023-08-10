import * as React from 'react';
import styles from './index.less';
import img_upload from '@/assets/createVersion_upload.png';
import img from '@/assets/file-object.svg';
import img_markdown from '@/assets/createVersion_markdown.png';
import FComponentsLib from '@freelog/components-lib';

interface Step2Props {

}

function Step2({}: Step2Props) {
  return (<>
    <div style={{ height: 40 }} />
    <div className={styles.styles}>
      <div className={styles.localUpload}>
        <FComponentsLib.FIcons.FLocalUpload style={{ fontSize: 60 }} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FContentText text={'选择本地文件作为发行对象'} type={'additional2'} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FRectBtn type={'primary'}>本地上传</FComponentsLib.FRectBtn>
      </div>

      <div className={styles.storageSpace}>
        <FComponentsLib.FIcons.FStorageSpace style={{ fontSize: 60 }} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FContentText text={'选择存储空间对象作为发行对象'} type={'additional2'} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FRectBtn type={'primary'}>存储空间导入</FComponentsLib.FRectBtn>
      </div>

      <div className={styles.markdownEditor}>
        <img
          src={img_markdown}
          alt={''}
          style={{ width: 56, height: 64 }}
        />
        <div style={{ height: 40 }} />
        <FComponentsLib.FContentText text={'markdown编辑器'} type={'additional2'} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FRectBtn type={'primary'}>立即体验</FComponentsLib.FRectBtn>
      </div>

    </div>
  </>);
}

export default Step2;
