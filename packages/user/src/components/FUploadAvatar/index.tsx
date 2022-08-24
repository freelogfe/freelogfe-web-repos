import * as React from 'react';
import styles from './index.less';
import { RcFile } from 'antd/lib/upload/interface';
import { Upload } from 'antd';
import FCropperModal from '@/components/FUploadAvatar/FCropperModal';
import { FServiceAPI, FI18n } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';

// import FUtil1 from '@/utils';

interface FUploadAvatarProps {
  children: React.ReactNode;

  onUploadSuccess?(url: string): void;

  onError?(error: string): void;
}

interface FUploadAvatarStates {
  // naturalFile: File | null;
  image: string;
}

const initStates: FUploadAvatarStates = {
  // naturalFile: null,
  image: '',
};

function FUploadAvatar({ children, onUploadSuccess, onError }: FUploadAvatarProps) {
  const ref = React.useRef<any>(null);
  // const [naturalFile, setNaturalFile] = React.useState<FUploadAvatarStates['naturalFile']>(initStates['naturalFile']);
  const [image, setImage] = React.useState<FUploadAvatarStates['image']>(initStates['image']);

  function beforeUpload(file: RcFile) {
    if (file.type !== 'image/gif' && file.type !== 'image/png' && file.type !== 'image/jpeg') {
      onError && onError(FI18n.i18nNext.t('limit_resource_image_format'));
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError && onError(FI18n.i18nNext.t('limit_resource_image_size'));
      return false;
    }

    // setNaturalFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(file);
    return false;
  }

  async function upload(blob: Blob | null) {
    if (!blob) {
      fMessage('文件为空', 'error');
      return;
    }
    const myFile = new File([blob], 'image.jpeg', {
      type: blob.type,
    });
    const { data } = await FServiceAPI.User.uploadHeadImg({
      file: myFile,
    });
    onUploadSuccess && onUploadSuccess(data);
    setImage(initStates['image']);
    // console.log(data, 'data900iokewflsdjflkjlk');
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
      onOk={(blob) => {
        upload(blob);
      }}
      onCancel={() => {
        // setNaturalFile(initStates['naturalFile']);
        setImage(initStates['image']);
      }}
    />
  </div>);
}

export default FUploadAvatar;