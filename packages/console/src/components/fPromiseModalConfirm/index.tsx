import * as React from 'react';
import styles from './index.less';
// import { FI18n } from '@freelog/tools-lib';
import { Modal } from 'antd';

interface fPromiseModalConfirmProps {
  title: React.ReactNode;
  icon: React.ReactNode;
  content: React.ReactNode;
  okText: React.ReactNode;
  cancelText: React.ReactNode;
}

function fPromiseModalConfirm({ ...props }: fPromiseModalConfirmProps): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    Modal.confirm({
      ...props,
      onOk() {
        resolve(true);
      },
      onCancel() {
        resolve(false);
      },
    });
  });
}

export default fPromiseModalConfirm;
