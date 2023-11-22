import * as React from 'react';
import styles from './index.less';
import { Modal, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';

interface FResourceFeedbackProps {

}

function FResourceFeedback({}: FResourceFeedbackProps) {
  return (<Modal
    open={true}
    title={null}
    footer={null}
    closable={false}
    width={310}
    centered={true}
    bodyStyle={{
      padding: 0,
      height: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    style={{
      borderRadius: 6,
      overflow: 'hidden',
    }}
  >
    <Space size={10} className={styles.operating}>
      <FComponentsLib.FIcons.FLoading style={{ fontSize: 16 }} />
      <div>正在上架/下架</div>
    </Space>
  </Modal>);
}

export default FResourceFeedback;
