import * as React from 'react';
import {Upload} from 'antd';
import ImgCrop from 'antd-img-crop';
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import styles from './index.less';

interface FUploadImageProps {
  children: React.ReactNode;
}

export default function ({children}: FUploadImageProps) {
  return (
    <div className={styles.styles}>
      <ImgCrop rotate grid aspect={4 / 3}>
        <Upload showUploadList={false}>
          {children}
        </Upload>
      </ImgCrop>
    </div>
  )
}
