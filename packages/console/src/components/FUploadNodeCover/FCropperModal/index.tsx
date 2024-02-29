import * as React from 'react';
import styles from './index.less';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Modal, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { FI18n } from '@freelog/tools-lib';

interface FCropperModalProps {
  uploadRef: any;
  imgSrc: string;
  uploading: boolean;

  onOk?(blob: Blob): void;

  // onOk?(info: {
  //   h: number;
  //   w: number;
  //   x: number;
  //   y: number;
  //   r: number;
  // }): void;

  onCancel?(): void;
}

function FCropperModal({ uploadRef, imgSrc, uploading, onOk, onCancel }: FCropperModalProps) {
  const [cropper, setCropper] = React.useState<Cropper>();

  return (<Modal
    open={!!imgSrc}
    width={950}
    title={<FComponentsLib.FTitleText
      // text={'上传头像'}
      text={FI18n.i18nNext.t('nodemgnt_nodesetting_nodelogo_crop_title')}
      type='popup'
    />}
    destroyOnClose
    bodyStyle={{ padding: '20px 30px' }}
    onOk={() => {
      if (!cropper) {
        return;
      }
      // const info = cropper.getData();
      // // console.log(info, '##SDfsiodlk');
      // onOk && onOk({
      //   h: info.height,
      //   w: info.width,
      //   x: info.x,
      //   y: info.y,
      //   r: info.rotate,
      // });
      cropper.getCroppedCanvas().toBlob((blob) => {
        // console.log(blob, '90iowe3jlskdfjsldkjl');
        if (blob) {
          onOk && onOk(blob);
        }

      });
    }}
    onCancel={() => {
      onCancel && onCancel();
    }}
    okText={uploading ? '更换中' : '确认'}
    okButtonProps={{
      loading: uploading,
    }}
    cancelText={'取消'}
  >
    <div className={styles.content}>
      <div className={styles.contentLeft}>
        <FComponentsLib.FTitleText text={'图片选框'} type='h3' />
        <div style={{ height: 10 }} />
        <Cropper
          style={{ width: 560, height: 420 }}
          // aspectRatio={1}
          rotatable={true}
          preview={'.' + styles.imgPreview}
          src={imgSrc}
          viewMode={1}
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
          // aspectRatio={1}
          // viewMode={1}
          // onChange={(c) => {
          //   console.log(c, 'c9803iojsodlkfsjdl');
          // }}
          // onComplete={(c) => {
          //   console.log(c, '90io32jklfsdjlfk');
          // }}
          // crop={()}
        />
        <div style={{ height: 8 }} />
        <Space size={15}>
          {/*<FTextBtn*/}
          {/*  type='default'*/}
          {/*  onClick={() => {*/}
          {/*    cropper.zoom(0.1);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <FIncrease*/}
          {/*    style={{ fontSize: 16 }}*/}
          {/*  />*/}
          {/*</FTextBtn>*/}
          {/*<FTextBtn*/}
          {/*  type='default'*/}
          {/*  onClick={() => {*/}
          {/*    cropper.zoom(-0.1);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <FDecrease*/}
          {/*    style={{ fontSize: 16 }}*/}
          {/*  />*/}
          {/*</FTextBtn>*/}
          {/*<FTextBtn*/}
          {/*  type='default'*/}
          {/*  onClick={() => {*/}
          {/*    cropper.rotate(90);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <FRotate*/}
          {/*    style={{ fontSize: 16 }}*/}
          {/*  />*/}
          {/*</FTextBtn>*/}
          <FComponentsLib.FTextBtn
            type='primary'
            onClick={() => {
              uploadRef.current.click();
            }}
          >重新选择</FComponentsLib.FTextBtn>
        </Space>
      </div>
      <div className={styles.contentRight}>
        <FComponentsLib.FTitleText
          text={FI18n.i18nNext.t('nodemgnt_nodesetting_nodelogo_crop_preview')}
          type='h3'
        />
        <div style={{ height: 10 }} />

        <div className={styles.previewCard}>
          <div className={styles.imgPreview} />
        </div>

        <div style={{ height: 20 }} />
        <FComponentsLib.FContentText text={'只支持JPG/PNG/GIF，GIF文件不能动画化，大小不超过5M；'} type='additional2' />
        <div style={{ height: 10 }} />
        <FComponentsLib.FContentText
          // text={'未上传头像时，使用系统默认头像。'}
          text={FI18n.i18nNext.t('nodemgnt_nodesetting_nodelogo_crop_info')}
          type='additional2'
        />

      </div>
    </div>
  </Modal>);
}

export default FCropperModal;

function getRoundedCanvas(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;

  canvas.width = width;
  canvas.height = height;
  context && (context.imageSmoothingEnabled = true);
  context && context.drawImage(sourceCanvas, 0, 0, width, height);
  context && (context.globalCompositeOperation = 'destination-in');
  context && context.beginPath();
  context && context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
  context && context.fill();
  return canvas;
}
