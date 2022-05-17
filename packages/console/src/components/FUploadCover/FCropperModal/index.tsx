import * as React from 'react';
import styles from './index.less';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Modal, Space } from 'antd';
import { FContentText, FTitleText } from '@/components/FText';
import FResourceContractLabels from '@/components/FResourceContractLabels';
import F_Contract_And_Policy_Labels from '@/components/F_Contract_And_Policy_Labels';
import { FTextBtn } from '@/components/FButton';
import { FClose } from '@/components/FIcons';
import FIncrease from '@/components/FIcons/FIncrease';
import FDecrease from '@/components/FIcons/FDecrease';
import FRotate from '@/components/FIcons/FRotate';

interface FCropperModalProps {
  imgSrc: string;
}

function FCropperModal({ imgSrc }: FCropperModalProps) {
  // const [image, setImage] = React.useState('');
  // const [cropData, setCropData] = React.useState('#');
  const [cropper, setCropper] = React.useState<any>();

  const [rotate, setRotate] = React.useState(0);
  // const [aspect, setAspect] = React.useState<number | undefined>(4 / 3);

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
          // zoomTo={scale}
          // initialAspectRatio={1}
          aspectRatio={4 / 3}
          rotatable={true}
          rotateTo={rotate}
          preview={'.' + styles.imgPreview}
          src={imgSrc}
          viewMode={2}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={true}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          guides={true}
        />
        <div style={{ height: 8 }} />
        <Space size={15}>
          <FTextBtn
            type='default'
            onClick={() => {
              cropper.zoom(0.1);

            }}
          >
            <FIncrease
              style={{ fontSize: 16 }}
            />
          </FTextBtn>
          <FTextBtn
            type='default'
            onClick={() => {
              cropper.zoom(-0.1);
            }}
          >
            <FDecrease
              style={{ fontSize: 16 }}
            />
          </FTextBtn>
          <FTextBtn
            type='default'
            onClick={() => {
              // setRotate((rotate + 90) % 360);
              // console.log('********8329iosd')
              cropper.rotate(90);
            }}
          >
            <FRotate
              style={{ fontSize: 16 }}
            />
          </FTextBtn>
          <FTextBtn
            type='primary'
          >重新选择</FTextBtn>
        </Space>
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

        <div style={{ height: 20 }} />
        <FContentText text={'只支持JPG/PNG/GIF，GIF文件不能动画化，大小不超过5M，建议尺寸为800X600；'} type='additional2' />
        <div style={{ height: 10 }} />
        <FContentText text={'未上传封面时，使用系统默认封面。'} type='additional2' />

      </div>
    </div>
  </Modal>);
}

export default FCropperModal;
