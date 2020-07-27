import * as React from 'react';
import styles from './index.less';
import FUploadImage from '@/components/FUploadImage';
import {FContentText} from '@/components/FText';
import {RcFile, UploadChangeParam} from "antd/lib/upload/interface";
import {uploadImage} from "@/services/storages";

interface FUploadResourceCoverProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function ({value, onChange}: FUploadResourceCoverProps) {

  const uploadConfig = {
    accept: 'image/*',
    beforeUpload: (file: RcFile, FileList: RcFile[]) => {
      // console.log(file, 'file');
      upload(file);
      return false;
    },
    onChange: (info: UploadChangeParam) => {
      console.log(info, '########');
    },
    multiple: false,
  };

  async function upload(file: File) {
    // await uploadImage({file});
    let param = new FormData();
    param.append('file', file);
    const res = await uploadImage(param);
    console.log(res, 'RRRRRRRRR');
    // onChange && onChange('https://cn.bing.com/th?id=OHR.PantheonParis_ZH-CN1546295756_UHD.jpg&pid=hp&w=3840&h=2160&rs=1&c=4&r=0');
  }

  return (<div className={styles.cover}>
    {!value
      ? (<FUploadImage  {...uploadConfig}>
        <a className={styles.FUploadImageChildren}>
          <i className={'freelog fl-icon-shangchuanfengmian'}/>
          <span>上传封面</span>
        </a>
      </FUploadImage>)
      : (<div className={styles.FUploadImageChildren}>
        <img src={value} alt=""/>
      </div>)
    }
    <div className={styles.coverTip}>
      {value && <FUploadImage {...uploadConfig}>
        <a className={styles.ReUpload}>重新上传</a>
      </FUploadImage>}
      <div style={{height: 15}}/>
      <FContentText type="additional2" text={'只支持JPG/PNG/GIF，GIF文件不能动画化，大小不超过5M，建议尺寸为800X600；'}/>
      <div style={{height: 5}}/>
      <FContentText type="additional2" text={'未上传封面时，默认使用系统封面。'}/>
    </div>
  </div>);
}

// interface UploadProps {
//   children?: React.ReactNode;
//   on
// }
//
// function Upload() {
//
// }
