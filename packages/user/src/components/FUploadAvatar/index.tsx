import * as React from 'react';
import styles from './index.less';
import { RcFile } from 'antd/lib/upload/interface';
import { Upload } from 'antd';
import FCropperModal from './FCropperModal';
import { FServiceAPI, FI18n, FUtil } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';

// import FUtil1 from '@/utils';

interface FUploadAvatarProps {
  children: React.ReactNode;

  onUploadSuccess?(url: string): void;

  onError?(error: string): void;
}

interface FUploadAvatarStates {
  image: string;
  uploading: boolean;
}

const initStates: FUploadAvatarStates = {
  image: '',
  uploading: false,
};

function FUploadAvatar({ children, onUploadSuccess, onError }: FUploadAvatarProps) {
  const ref = React.useRef<any>(null);
  // const [naturalFile, setNaturalFile] = React.useState<FUploadAvatarStates['naturalFile']>(initStates['naturalFile']);
  const [image, set_image] = React.useState<FUploadAvatarStates['image']>(initStates['image']);
  const [uploading, set_uploading] = React.useState<FUploadAvatarStates['uploading']>(initStates['uploading']);


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
      set_image(reader.result as any);
    };
    reader.readAsDataURL(file);
    return false;
  }

  async function upload(blob: Blob | null) {
    if (!blob) {
      fMessage('文件为空', 'error');
      return;
    }
    set_uploading(true);
    const myFile = new File([blob], 'image.jpeg', {
      type: blob.type,
    });
    const { ret, errCode, msg, data } = await FServiceAPI.User.uploadHeadImg({
      file: myFile,
    });
    await FUtil.Tool.promiseSleep(1000);
    if (ret !== 0 || errCode !== 0) {
      fMessage(msg, 'error');
    } else {
      onUploadSuccess && onUploadSuccess(FUtil.Tool.getAvatarUrl());
    }
    set_image(initStates['image']);
    set_uploading(false);
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
      uploading={uploading}
      uploadRef={ref}
      imgSrc={image}
      onOk={(blob) => {
        upload(blob);
      }}
      onCancel={() => {
        // setNaturalFile(initStates['naturalFile']);
        set_image(initStates['image']);
      }}
    />
  </div>);
}

export default FUploadAvatar;
