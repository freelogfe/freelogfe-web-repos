import * as React from 'react';
import {Upload} from 'antd';
import ImgCrop from 'antd-img-crop';
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import styles from './index.less';
import {RcFile, UploadChangeParam} from "antd/lib/upload/interface";
import FUtil1 from "@/utils";
import {FServiceAPI} from '@freelog/tools-lib';

interface FUploadImageProps {
  children: React.ReactNode;

  onUploadSuccess?(url: string): void;

  onError?(error: string): void;
}

export default function ({children, onUploadSuccess, onError}: FUploadImageProps) {

  async function upload(file: File) {
    // console.log(file, 'file!@$!@#$!@#$23423234234234234');
    const res = await FServiceAPI.Storage.uploadImage({
      file: file,
    });
    // console.log(res, 'RRRRRRRRR');
    onUploadSuccess && onUploadSuccess(res.data.url);
  }

  return (
    <div className={styles.styles}>
      <ImgCrop
        rotate
        grid
        aspect={4 / 3}
        beforeCrop={(file) => {
          // console.log(file, '#FSDFSDFSDF');
          if (file.type !== 'image/gif' && file.type !== 'image/png' && file.type !== 'image/jpeg') {
            onError && onError(FUtil1.I18n.message('limit_resource_image_format'));
            return false;
          }

          if (file.size > 5 * 1024 * 1024) {
            onError && onError(FUtil1.I18n.message('limit_resource_image_size'));
            return false;
          }

          return true;
        }}
      >
        <Upload
          // accept={'image/gif,image/png,.jpg'}
          accept={'.gif,.png,.jpg,.jpeg,.jpe'}
          beforeUpload={(file: RcFile, FileList: RcFile[]) => {
            // console.log(file, 'file20934u23');
            upload(file);
            return false;
          }}
          onChange={(info: UploadChangeParam) => {
            // console.log(info, '########');
          }}
          multiple={false}
          showUploadList={false}
        >
          {children}
        </Upload>
      </ImgCrop>
    </div>
  )
}
