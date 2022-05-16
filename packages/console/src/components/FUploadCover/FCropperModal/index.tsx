import * as React from 'react';
import styles from './index.less';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Modal } from 'antd';
import { FContentText, FTitleText } from '@/components/FText';
import FResourceContractLabels from '@/components/FResourceContractLabels';
import F_Contract_And_Policy_Labels from '@/components/F_Contract_And_Policy_Labels';

interface FCropperModalProps {
  imgSrc: string;
}

function FCropperModal({ imgSrc }: FCropperModalProps) {
  // const [image, setImage] = React.useState('');
  // const [cropData, setCropData] = React.useState('#');
  const [cropper, setCropper] = React.useState<any>();

  const [scale, setScale] = React.useState(5)
  const [rotate, setRotate] = React.useState(90)
  const [aspect, setAspect] = React.useState<number | undefined>(4 / 3)

  React.useEffect(() => {
    // setImage(imgSrc);
  });

  function getCropData() {
    if (typeof cropper !== 'undefined') {
      // setCropData(cropper.getCroppedCanvas().toDataURL());
    }
  }

  return (<Modal visible={!!imgSrc} width={950} title={'上传资源图片'} destroyOnClose>
    <div className={styles.content}>
      <div className={styles.contentLeft}>
        <FTitleText text={'图片选框'} type='h3' />
        <div style={{ height: 10 }} />
        <Cropper
          style={{ width: 560, height: 420 }}
          zoomTo={scale}
          // initialAspectRatio={1}
          aspectRatio={aspect}
          rotateTo={rotate}
          preview={'.' + styles.imgPreview}
          src={imgSrc}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          guides={true}
        />
      </div>
      <div className={styles.contentRight}>
        <FTitleText text={'资源卡片预览'} type='h3' />
        <div style={{ height: 10 }} />

        <div className={styles.previewCard}>
          <div className={styles.imgPreview} />
          <div style={{ height: 10 }} />
          <FContentText text={'资源名称'} type='highlight' />
          <div style={{ height: 8 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FContentText text={'资源类型'} type={'additional2'} />
            <FContentText text={'最新版本'} type={'additional2'} />
          </div>
          <div style={{ height: 12 }} />
          <F_Contract_And_Policy_Labels data={[{ text: '授权策略', dot: '' }]} />
        </div>

      </div>
    </div>
  </Modal>);
}

export default FCropperModal;
