import * as React from 'react';
import styles from './index.less';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Modal } from 'antd';

interface FCropperModalProps {
  imgSrc: string;
}

function FCropperModal({ imgSrc }: FCropperModalProps) {
  // const [image, setImage] = React.useState('');
  // const [cropData, setCropData] = React.useState('#');
  const [cropper, setCropper] = React.useState<any>();

  React.useEffect(() => {
    // setImage(imgSrc);
  });

  function getCropData() {
    if (typeof cropper !== 'undefined') {
      // setCropData(cropper.getCroppedCanvas().toDataURL());
    }
  }

  return (<Modal visible={!!imgSrc} width={1000} title={'上传资源图片'} destroyOnClose>
    <div>
      <div style={{ width: '100%' }}>
        <Cropper
          style={{ height: 400, width: '100%' }}
          zoomTo={0.5}
          initialAspectRatio={1}
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
      <div>
        <div
          className={styles.imgPreview}
          style={{ width: '100%', float: 'left', height: '300px' }}
        />
      </div>
    </div>
  </Modal>);
}

export default FCropperModal;
