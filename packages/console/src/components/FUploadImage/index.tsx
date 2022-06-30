import * as React from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import styles from './index.less';
import { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
// import FUtil1 from '@/utils';
import { FServiceAPI, fI18nNext } from '@freelog/tools-lib';
import { Area } from 'react-easy-crop/types';

interface FUploadImageProps {
  children: React.ReactNode;

  onUploadSuccess?(url: string): void;

  onError?(error: string): void;
}

export default function({ children, onUploadSuccess, onError }: FUploadImageProps) {

  const [naturalFile, setNaturalFile] = React.useState<File | null>(null);
  const [cropArea, setCropArea] = React.useState<Area | null>(null);

  async function upload() {
    if (!naturalFile || !cropArea) {
      return;
    }
    const res = await FServiceAPI.Storage.uploadImage({
      file: naturalFile,
    });
    const img = new Image();
    img.src = res.data.url;

    img.onload = () => {
      const hash: string = `#x=${cropArea.x}&y=${cropArea.y}&w=${cropArea.width}&h=${cropArea.height}&width=${img.width}&height=${img.height}`;
      const url: string = res.data.url + hash;
      // console.log(url, 'url2222222');
      onUploadSuccess && onUploadSuccess(url);
    }

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
            onError && onError(fI18nNext.t('limit_resource_image_format'));
            return false;
          }

          if (file.size > 5 * 1024 * 1024) {
            onError && onError(fI18nNext.t('limit_resource_image_size'));
            return false;
          }

          setNaturalFile(file);

          return true;
        }}
        cropperProps={{
          onCropComplete(croppedArea: Area, croppedAreaPixels: Area) {
          },
          onCropAreaChange(croppedArea: Area, croppedAreaPixels: Area) {
            setCropArea(croppedAreaPixels);
          },
        }}
      >
        <Upload
          // accept={'image/gif,image/png,.jpg'}
          accept={'.gif,.png,.jpg,.jpeg,.jpe'}
          beforeUpload={(file: RcFile, FileList: RcFile[]) => {
            // console.log(file, 'file20934u23');
            upload();
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
  );
}
