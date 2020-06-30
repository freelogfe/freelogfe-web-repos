import * as React from 'react';
import {Upload} from 'antd';
import styles from './index.less';
import ImgCrop from 'antd-img-crop';
import 'antd/es/modal/style';
import 'antd/es/slider/style';

export default function () {
  return (
    <div className={styles.styles}>
      <ImgCrop rotate grid aspect={4 / 3}>
        <Upload showUploadList={false}>
          <div className={styles.div}>

          </div>
        </Upload>
      </ImgCrop>
    </div>
  )
}
