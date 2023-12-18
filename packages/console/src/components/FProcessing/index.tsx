import * as React from 'react';
import styles from './index.less';
import { Modal, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';

interface FProcessingProps {
  open?: boolean;
  message: string;
}

function FProcessing({ open, message }: FProcessingProps) {
  return (<Modal
    open={open}
    title={null}
    footer={null}
    width={312}
    // style={{ backgroundColor: 'rgba(0,0,0,.2)' }}
    bodyStyle={{
      backgroundColor: 'white',
      borderRadius: 6,
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#2784FF',
      // padding: '30px 60px',
      height: 200,
      fontSize: 16,
      lineHeight: '22px',
    }}
    style={{ backgroundColor: 'transparent', borderRadius: 10, overflow: 'hidden' }}
    mask={true}
    centered={true}
    closable={false}
    afterClose={() => {
      // onClose && onClose();
    }}
    focusTriggerAfterClose={false}
  >
    <Space size={10}>
      <FComponentsLib.FIcons.FLoading style={{ fontSize: 16 }} />
      <span>{message}</span>
    </Space>
  </Modal>);
}

export default FProcessing;
