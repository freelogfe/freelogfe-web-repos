import * as React from 'react';
import styles from './index.less';
// import { FI18n } from '@freelog/tools-lib';
import { Modal } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import * as ReactDOM from 'react-dom/client';

interface fPromiseModalConfirmProps {
  title: string;
  description: string;
  okText?: string;
  cancelText?: string;
}

type ReturnData = boolean;

function fPromiseModalConfirm({ ...props }: fPromiseModalConfirmProps): Promise<ReturnData> {
  // console.log(props, 'propsoi8wsjedflksdjflkj');
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('read-file-root') as HTMLDivElement);
    return root.render(<Middleware
      {...props}
      onOk={() => {
        resolve(true);
      }}
      onCancel={() => {
        resolve(false);
      }}
      afterClose={() => {
        root.unmount();
      }}
    />);
  });
}

export default fPromiseModalConfirm;

interface MiddlewareProps {
  title: string;
  description: string;
  okText?: string;
  cancelText?: string;

  onOk?(): void;

  onCancel?(): void;

  afterClose?(): void;
}

function Middleware({ title, description, okText, cancelText, onOk, onCancel, afterClose }: MiddlewareProps) {
  const [visible, set_visible] = React.useState<boolean>(true);
  return (<Modal
    title={null}
    open={visible}
    footer={null}
    centered
    className={styles.modal}
    width={490}
    onCancel={() => {
      onCancel && onCancel();
    }}
    afterClose={() => {
      afterClose && afterClose();
    }}
  >
    <div className={styles.modelContent}>
      <FComponentsLib.FTitleText type={'popup'} text={title} />
      <div className={styles.title2}>
        <FComponentsLib.FTipText text={description} type={'second'} />
      </div>
      <div className={styles.btn}>
        <FComponentsLib.FTextBtn
          type={'default'}
          onClick={() => {
            set_visible(false);
            onCancel && onCancel();
          }}
        >{cancelText || '取消'}</FComponentsLib.FTextBtn>
        <FComponentsLib.FRectBtn
          type={'primary'}
          onClick={() => {
            set_visible(false);
            onOk && onOk();
          }}
        >{okText || '确定'}</FComponentsLib.FRectBtn>
      </div>
    </div>
  </Modal>);
}
