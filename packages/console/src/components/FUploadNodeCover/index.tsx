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
  naturalFile: File | null;
  image: string;
  uploading: boolean;
}

const initStates: FUploadAvatarStates = {
  naturalFile: null,
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

    $setState({
      naturalFile: file,
    });

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

  // async function upload(blob: Blob | null) {
  async function upload(cropArea: { x: number, y: number, r: number, w: number, h: number }) {
    if (!$state.image || !$state.naturalFile) {
      fMessage('文件为空', 'error');
      return;
    }
    // set_uploading(true);
    $setState({
      uploading: true,
    });
    // const myFile = new File([blob], 'image.jpeg', {
    //   type: blob.type,
    // });
    const { ret, errCode, msg, data: data_uploadImage }: {
      ret: number;
      errCode: number;
      msg: string;
      data: {
        url: string;
      };
    } = await FServiceAPI.Storage.uploadImage({
      // file: myFile,
      file: $state.naturalFile,
    });
    await FUtil.Tool.promiseSleep(1000);
    $setState({
      uploading: initStates['uploading'],
    });
    if (ret !== 0 || errCode !== 0) {
      fMessage(msg, 'error');
      return;
    }

    // $prop.onUploadSuccess && $prop.onUploadSuccess(data_uploadImage.url);
    // $setState(initStates);

    const img = new Image();
    img.src = data_uploadImage.url;

    img.onload = () => {
      const hash: string = `#x=${cropArea.x}&y=${cropArea.y}&r=${cropArea.r}&w=${cropArea.w}&h=${cropArea.h}&width=${img.width}&height=${img.height}`;
      const url: string = data_uploadImage.url + hash;
      // console.log(url, 'url2222222');
      $prop.onUploadSuccess && $prop.onUploadSuccess(url);

      // setNaturalFile(initStates['naturalFile']);
      // setImage(initStates['image']);
      $setState(initStates);
    };
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
      onOk={(info) => {
        upload(info);
      }}
      onCancel={() => {
        $setState({
          image: initStates['image'],
          naturalFile: initStates['naturalFile'],
        });
      }}
    />
  </div>);
}

export default FUploadNodeCover;
