import * as React from 'react';
import styles from './index.less';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Modal, Space } from 'antd';
import { FContentText, FTitleText } from '@/components/FText';
import F_Contract_And_Policy_Labels from '@/components/F_Contract_And_Policy_Labels';
import { FTextBtn } from '@/components/FButton';
import FIncrease from '@/components/FIcons/FIncrease';
import FDecrease from '@/components/FIcons/FDecrease';
import FRotate from '@/components/FIcons/FRotate';

interface FCropperModalProps {
  uploadRef: any;
  imgSrc: string;

  onOk?(info: {
    h: number;
    w: number;
    x: number;
    y: number;
  }): void;

  onCancel?(): void;
}

function FCropperModal({ uploadRef, imgSrc, onOk, onCancel }: FCropperModalProps) {
  const [cropper, setCropper] = React.useState<any>();

  return (<Modal
    visible={!!imgSrc}
    width={950}
    title={'上传资源图片'}
    destroyOnClose
    bodyStyle={{ padding: '20px 30px' }}
    onOk={() => {
      const info = cropper.getData();
      // console.log(info, '##SDfsiodlk');
      onOk && onOk({
        h: info.height,
        w: info.width,
        x: info.x,
        y: info.y,
      });
    }}
    onCancel={() => {
      onCancel && onCancel();
    }}
  >
    <div className={styles.content}>
      <div className={styles.contentLeft}>
        <FTitleText text={'图片选框'} type='h3' />
        <div style={{ height: 10 }} />
        <Cropper
          style={{ width: 560, height: 420 }}
          aspectRatio={4 / 3}
          rotatable={true}
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
          // onChange={(c) => {
          //   console.log(c, 'c9803iojsodlkfsjdl');
          // }}
          // onComplete={(c) => {
          //   console.log(c, '90io32jklfsdjlfk');
          // }}
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
              cropper.rotate(90);
            }}
          >
            <FRotate
              style={{ fontSize: 16 }}
            />
          </FTextBtn>
          <FTextBtn
            type='primary'
            onClick={() => {
              uploadRef.current.click();
            }}
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
