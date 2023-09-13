import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { Modal } from 'antd';

interface FInProcessModalProps {
  open?: boolean;
}

function FInProcessModal({ open = false }: FInProcessModalProps) {
  return (<Modal
    open={open}
    title={null}
    footer={null}
    closable={false}
    width={320}
    centered={true}
    style={{ borderRadius: 6, overflow: 'hidden' }}
    bodyStyle={{ height: 200 }}
  >
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      color: '#2784FF',
      gap: 10,
    }}>
      <FComponentsLib.FIcons.FLoading style={{ fontSize: 16 }} />
      <span>处理中</span>
    </div>
  </Modal>);
}

export default FInProcessModal;
