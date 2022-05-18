import * as React from 'react';
import styles from './index.less';
import { RcFile } from 'antd/lib/upload/interface';
import { Upload } from 'antd';
import FCropperModal from '@/components/FUploadCover/FCropperModal';
import { FServiceAPI } from '@freelog/tools-lib';
import FUtil1 from '@/utils';

interface FUploadCoverProps {
  children: React.ReactNode;

  onUploadSuccess?(url: string): void;

  onError?(error: string): void;
}

interface FUploadCoverStates {
  naturalFile: File | null;
  image: string;
}

const initStates: FUploadCoverStates = {
  naturalFile: null,
  image: '',
};

function FUploadCover({ children, onUploadSuccess, onError }: FUploadCoverProps) {
  const ref = React.useRef<any>(null);
  const [naturalFile, setNaturalFile] = React.useState<FUploadCoverStates['naturalFile']>(initStates['naturalFile']);
  const [image, setImage] = React.useState<FUploadCoverStates['image']>(initStates['image']);

  function beforeUpload(file: RcFile) {
    if (file.type !== 'image/gif' && file.type !== 'image/png' && file.type !== 'image/jpeg') {
      onError && onError(FUtil1.I18n.message('limit_resource_image_format'));
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError && onError(FUtil1.I18n.message('limit_resource_image_size'));
      return false;
    }

    setNaturalFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(file);
    return false;
  }

  async function upload(cropArea: { x: number, y: number, r: number, w: number, h: number }) {
    if (!image || !naturalFile) {
      return;
    }
    const res = await FServiceAPI.Storage.uploadImage({
      file: naturalFile,
    });
    const img = new Image();
    img.src = res.data.url;

    img.onload = () => {
      const hash: string = `#x=${cropArea.x}&y=${cropArea.y}&r=${cropArea.r}&w=${cropArea.w}&h=${cropArea.h}&width=${img.width}&height=${img.height}`;
      const url: string = res.data.url + hash;
      // console.log(url, 'url2222222');
      onUploadSuccess && onUploadSuccess(url);

      setNaturalFile(initStates['naturalFile']);
      setImage(initStates['image']);
    };


  }

  return (<div className={styles.styles}>

    <Upload
      // accept={'image/gif,image/png,.jpg'}
      accept={'.gif,.png,.jpg,.jpeg,.jpe'}
      beforeUpload={beforeUpload}
      multiple={false}
      showUploadList={false}
    >
      <div ref={ref} className={styles.uploadContainer}>
        {children}
      </div>
    </Upload>
    <FCropperModal
      uploadRef={ref}
      imgSrc={image}
      onOk={(info) => {
        upload(info);
      }}
      onCancel={() => {
        setNaturalFile(initStates['naturalFile']);
        setImage(initStates['image']);
      }}
    />
  </div>);
}

export default FUploadCover;
