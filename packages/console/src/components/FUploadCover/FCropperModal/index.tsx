import * as React from 'react';
import styles from './index.less';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Modal, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FUtil } from '@freelog/tools-lib';

interface FCropperModalProps {
  uploadRef: any;
  imgSrc: string;

  // onOk?(info: {
  //   h: number;
  //   w: number;
  //   x: number;
  //   y: number;
  //   r: number;
  // }): void;
  onOK?(blob: Blob): void;


  onCancel?(): void;
}

function FCropperModal({
                         uploadRef,
                         imgSrc,
                         onOK,
                         onCancel,
                       }: FCropperModalProps) {
  const [$cropperInstance, set$cropperInstance, get$cropperInstance] = FUtil.Hook.useGetState<Cropper | null>(null);

  const [$aspectRatioChecked, set$aspectRatioChecked, get$aspectRatioChecked] = FUtil.Hook.useGetState<'free' | 'original' | number>('free');

  React.useEffect(() => {
    const cropperInstance = get$cropperInstance();
    if (!cropperInstance) {
      return;
    }
    const aspectRatioChecked = get$aspectRatioChecked();
    if (aspectRatioChecked === 'free') {
      cropperInstance.enable();
      cropperInstance.setAspectRatio(0);
    } else if (aspectRatioChecked === 'original') {
      cropperInstance.setAspectRatio(0);
      cropperInstance.disable();
    } else {
      cropperInstance.enable();
      cropperInstance.setAspectRatio(aspectRatioChecked);
    }

  }, [$aspectRatioChecked]);

  return (<Modal
    open={!!imgSrc}
    width={1000}
    title={<FComponentsLib.FTitleText text={'上传资源图片'} type='popup' />}
    destroyOnClose
    bodyStyle={{ padding: '20px 30px' }}
    onOk={() => {
      // const info = cropper.getData();
      // console.log(info, '##SDfsiodlk');
      // onOk && onOk({
      //   h: info.height,
      //   w: info.width,
      //   x: info.x,
      //   y: info.y,
      //   r: info.rotate,
      // });
      const cropperInstance = get$cropperInstance();
      if (!cropperInstance) {
        return;
      }
      cropperInstance.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          onOK && onOK(blob);
        }
      });
    }}
    onCancel={() => {
      onCancel && onCancel();
    }}
    okText={FI18n.i18nNext.t('btn_done')}
    cancelText={FI18n.i18nNext.t('btn_cancel')}
  >
    <div className={styles.content}>
      <div className={styles.contentLeft}>
        <FComponentsLib.FTitleText
          text={'图片选框'}
          type='h4'
        />
        <div style={{ height: 10 }} />
        {/*{console.log($aspectRatioChecked, '$aspectRatioChecked sdifjsdlkfjlkdsjflkjlkj')}*/}
        <Cropper
          style={{ width: 512, height: 384 }}
          // aspectRatio={($aspectRatioChecked === 'free' || $aspectRatioChecked === 'original')
          //   ? 1
          //   : $aspectRatioChecked}
          // rotatable={true}
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
            // setCropper(instance);
            set$cropperInstance(instance);
          }}
          // autoCapitalize={}
          guides={true}
          disabled={true}
          width={100}
          // onChange={(c) => {
          //   console.log(c, 'c9803iojsodlkfsjdl');
          // }}
          // onComplete={(c) => {
          //   console.log(c, '90io32jklfsdjlfk');
          // }}
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

        <div style={{ height: 15 }} />
        <FComponentsLib.FContentText
          text={'资源封面是资源对外展示的窗口，清晰美观的封面更容易被打开；'}
          type='additional2'
        />
        <div style={{ height: 5 }} />
        <FComponentsLib.FContentText
          text={'只支持JPG/PNG/GIF，GIF文件不能动画化，大小不超过5M，建议宽高不小于800px。'}
          type='additional2'
        />
      </div>
      <div style={{ width: 5 }} />
      <div className={styles.contentMiddle}>
        <FComponentsLib.FTitleText
          text={'尺寸选择'}
          type='h4'
        />
        <div style={{ height: 10 }} />
        <div className={styles.checkBox}>
          <div
            className={[styles.checkBoxItem, $aspectRatioChecked === 'free' ? styles.checked : ''].join(' ')}
            onClick={() => {
              set$aspectRatioChecked('free');
            }}
          >
            <span>自由尺寸</span>
          </div>
          <div
            className={[styles.checkBoxItem, $aspectRatioChecked === 'original' ? styles.checked : ''].join(' ')}
            onClick={() => {
              set$aspectRatioChecked('original');
            }}
          >
            <span>原图尺寸</span>
          </div>
          <div
            className={[styles.checkBoxItem, $aspectRatioChecked === 2 / 3 ? styles.checked : ''].join(' ')}
            onClick={() => {
              set$aspectRatioChecked(2 / 3);
            }}
          >
            <div
              className={styles.rect}
              style={{
                width: 10,
                height: 15,
              }}
            />
            <span>2 : 3</span>
          </div>
          <div
            className={[styles.checkBoxItem, $aspectRatioChecked === 3 / 2 ? styles.checked : ''].join(' ')}
            onClick={() => {
              set$aspectRatioChecked(3 / 2);
            }}
          >
            <div
              className={styles.rect}
              style={{
                width: 15,
                height: 10,
              }}
            />
            <span>3 : 2</span>
          </div>
          <div
            className={[styles.checkBoxItem, $aspectRatioChecked === 3 / 4 ? styles.checked : ''].join(' ')}
            onClick={() => {
              set$aspectRatioChecked(3 / 4);
            }}
          >
            <div
              className={styles.rect}
              style={{
                width: 9,
                height: 12,
              }}
            />
            <span>3 : 4</span>
          </div>
          <div
            className={[styles.checkBoxItem, $aspectRatioChecked === 4 / 3 ? styles.checked : ''].join(' ')}
            onClick={() => {
              set$aspectRatioChecked(4 / 3);
            }}
          >
            <div
              className={styles.rect}
              style={{
                width: 12,
                height: 9,
              }}
            />
            <span>4 : 3</span>
          </div>
          <div
            className={[styles.checkBoxItem, $aspectRatioChecked === 5 / 7 ? styles.checked : ''].join(' ')}
            onClick={() => {
              set$aspectRatioChecked(5 / 7);
            }}>
            <div
              className={styles.rect}
              style={{
                width: 10,
                height: 14,
              }}
            />
            <span>5 : 7</span>
          </div>
          <div
            className={[styles.checkBoxItem, $aspectRatioChecked === 7 / 5 ? styles.checked : ''].join(' ')}
            onClick={() => {
              set$aspectRatioChecked(7 / 5);
            }}>
            <div
              className={styles.rect}
              style={{
                width: 14,
                height: 10,
              }}
            />
            <span>7 : 5</span>
          </div>
          <div
            className={[styles.checkBoxItem, $aspectRatioChecked === 9 / 16 ? styles.checked : ''].join(' ')}
            onClick={() => {
              set$aspectRatioChecked(9 / 16);
            }}>
            <div
              className={styles.rect}
              style={{
                width: 9,
                height: 16,
              }}
            />
            <span>9 : 16</span>
          </div>
          <div
            className={[styles.checkBoxItem, $aspectRatioChecked === 16 / 9 ? styles.checked : ''].join(' ')}
            onClick={() => {
              set$aspectRatioChecked(16 / 9);
            }}>
            <div
              className={styles.rect}
              style={{
                width: 16,
                height: 9,
              }}
            />
            <span>16 : 9</span>
          </div>
        </div>
      </div>
      <div style={{ width: 30 }} />
      <div className={styles.contentRight}>
        <FComponentsLib.FTitleText
          text={'资源卡片预览'}
          type='h4'
        />
        <div style={{ height: 10 }} />

        <div className={styles.previewCard}>
          <div className={styles.imgPreviewBox}>
            <div className={styles.imgPreview} />
          </div>
          <div style={{ height: 10 }} />
          <FComponentsLib.FContentText text={'资源名称'} type='highlight' />
          <div style={{ height: 8 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FComponentsLib.FContentText text={'资源类型'} type={'additional2'} />
            <FComponentsLib.FContentText text={'最新版本'} type={'additional2'} />
          </div>
          <div style={{ height: 12 }} />
          <FComponentsLib.F_Contract_And_Policy_Labels data={[{ text: '授权策略', dot: '' }]} />
        </div>
      </div>
    </div>
  </Modal>);
}

export default FCropperModal;
