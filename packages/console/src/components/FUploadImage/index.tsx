import * as React from 'react';
import {Upload} from 'antd';
import ImgCrop from 'antd-img-crop';
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import styles from './index.less';
import {UploadProps} from 'antd/lib/upload';
import {RcFile, UploadChangeParam} from "antd/lib/upload/interface";
import {uploadImage} from "@/services/storages";

//extends UploadProps
interface FUploadImageProps {
  children: React.ReactNode;

  onUploadSuccess?(url: string): void;
}

export default function ({children, onUploadSuccess}: FUploadImageProps) {

  const uploadConfig = {
    accept: 'image/*',
    beforeUpload: (file: RcFile, FileList: RcFile[]) => {
      // console.log(file, 'file1');
      upload(file);
      return false;
    },
    onChange: (info: UploadChangeParam) => {
      // console.log(info, '########');
    },
    multiple: false,
    showUploadList: false,
    // ...props,
  };

  async function upload(file: File) {
    const res = await uploadImage({
      file: file,
    });
    // console.log(res, 'RRRRRRRRR');
    onUploadSuccess && onUploadSuccess(res.data.url);
  }

  return (
    <div className={styles.styles}>
      <ImgCrop rotate grid aspect={4 / 3}>
        <Upload{...uploadConfig}>
          {children}
        </Upload>
      </ImgCrop>
    </div>
  )
}
