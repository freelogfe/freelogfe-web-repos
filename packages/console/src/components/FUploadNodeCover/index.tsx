import * as React from 'react';
import styles from './index.less';
import { RcFile } from 'antd/lib/upload/interface';
import { Upload } from 'antd';
import FCropperModal from './FCropperModal';
import { FServiceAPI, FI18n, FUtil } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';
import * as AHooks from 'ahooks';

interface FUploadNodeCoverProps {
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

function FUploadNodeCover($prop: FUploadNodeCoverProps) {
  const ref = React.useRef<any>(null);
  const [$state, $setState] = AHooks.useSetState<FUploadAvatarStates>(initStates);

  function beforeUpload(file: RcFile) {
    if (file.type !== 'image/gif' && file.type !== 'image/png' && file.type !== 'image/jpeg') {
      $prop.onError && $prop.onError(FI18n.i18nNext.t('limit_resource_image_format'));
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      $prop.onError && $prop.onError(FI18n.i18nNext.t('limit_resource_image_size'));
      return false;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // set_image(reader.result as any);
      $setState({
        image: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
    return false;
  }

  async function upload(blob: Blob | null) {
    if (!blob) {
      fMessage('文件为空', 'error');
      return;
    }
    // set_uploading(true);
    $setState({
      uploading: true,
    });
    const myFile = new File([blob], 'image.jpeg', {
      type: blob.type,
    });
    const { ret, errCode, msg, data: data_uploadImage }: {
      ret: number;
      errCode: number;
      msg: string;
      data: {
        url: string;
      };
    } = await FServiceAPI.Storage.uploadImage({
      file: myFile,
    });
    await FUtil.Tool.promiseSleep(1000);
    if (ret !== 0 || errCode !== 0) {
      fMessage(msg, 'error');
    } else {
      $prop.onUploadSuccess && $prop.onUploadSuccess(data_uploadImage.url);
    }
    $setState(initStates);
  }

  return (<div className={styles.styles}>

    <Upload
      accept={'.gif,.png,.jpg,.jpeg,.jpe'}
      beforeUpload={beforeUpload}
      multiple={false}
      showUploadList={false}
    >
      <div ref={ref} className={styles.uploadContainer}>
        {$prop.children}
      </div>
    </Upload>
    <FCropperModal
      uploading={$state.uploading}
      uploadRef={ref}
      imgSrc={$state.image}
      onOk={(blob) => {
        upload(blob);
      }}
      onCancel={() => {
        $setState({
          image: initStates['image'],
        });
      }}
    />
  </div>);
}

export default FUploadNodeCover;
