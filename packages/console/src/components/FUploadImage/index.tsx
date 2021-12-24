import * as React from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import styles from './index.less';
import { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
import FUtil1 from '@/utils';
import { FServiceAPI } from '@freelog/tools-lib';
import { Area } from 'react-easy-crop/types';

interface FUploadImageProps {
  children: React.ReactNode;

  onUploadSuccess?(url: string): void;

  onError?(error: string): void;
}

export default function({ children, onUploadSuccess, onError }: FUploadImageProps) {

  const [naturalFile, setNaturalFile] = React.useState<File | null>(null);
  const [cropArea, setCropArea] = React.useState<Area | null>(null);

  async function upload(file: File) {
    // console.log(file, 'file!@$!@#$!@#$23423234234234234');
    if (!naturalFile || !cropArea) {
      return;
    }
    // console.log(naturalFile, 'naturalFilenaturalFile90234jlksdfl');
    const res = await FServiceAPI.Storage.uploadImage({
      file: naturalFile,
    });
    // console.log(res, '2342342');
    const img = new Image();
    img.src = res.data.url;

    img.onload = () => {
      // console.log(img.width, ' iiii爱上帝就发了；ksadjlfkj');
      // console.log(img.height, ' iiii爱上帝就发了；ksadjlfkj');
      const hash: string = `#x=${cropArea.x}&y=${cropArea.y}&w=${cropArea.width}&h=${cropArea.height}&width=${img.width}&height=${img.height}`;
      const url: string = res.data.url + hash;
      // console.log(url, 'url2222222');
      onUploadSuccess && onUploadSuccess(url);
    }

  }

  return (
    <div className={styles.styles}>
      <ImgCrop
        // onCropComplete={(croppedArea: Area, croppedAreaPixels: Area) => {
        //
        // }}
        // onCropAreaChange={(croppedArea: Area, croppedAreaPixels: Area) => {
        //
        // }}
        // zoom={false}
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

          setNaturalFile(file);

          return true;
        }}
        cropperProps={{
          onCropComplete(croppedArea: Area, croppedAreaPixels: Area) {
            // console.log(croppedArea, 'croppedArea');
            // console.log(croppedAreaPixels, 'croppedAreaPixels');
          },
          onCropAreaChange(croppedArea: Area, croppedAreaPixels: Area) {
            // console.log(croppedArea, 'croppedArea');
            // console.log(croppedAreaPixels, 'croppedAreaPixels');
            setCropArea(croppedAreaPixels);
          },
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
  );
}
