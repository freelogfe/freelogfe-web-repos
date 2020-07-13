import * as React from 'react';
import styles from './index.less';
import FUploadImage from '@/components/FUploadImage';
import {FContentText} from '@/components/FText';

export default function () {
  return (<div className={styles.cover}>
    <FUploadImage>
      <a className={styles.FUploadImageChildren}>
        <i className={'freelog fl-icon-shangchuanfengmian'}/>
        <span>上传封面</span>
      </a>
    </FUploadImage>
    <div className={styles.coverTip}>
      <FUploadImage>
        <a className={styles.ReUpload}>重新上传</a>
      </FUploadImage>
      <div style={{height: 15}}/>
      <FContentText type="additional2" text={'只支持JPG/PNG/GIF，GIF文件不能动画化，大小不超过5M，建议尺寸为800X600；'}/>
      <div style={{height: 5}}/>
      <FContentText type="additional2" text={'未上传封面时，默认使用系统封面。'}/>
    </div>
  </div>);
}
