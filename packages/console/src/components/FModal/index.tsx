import * as React from 'react';
import { Modal } from 'antd';

import styles from './index.less';
import { ModalProps } from 'antd/lib/modal';

interface FModal extends ModalProps {
  children?: React.ReactNode | React.ReactNodeArray;
}

function FModal({ children, ...props }: FModal) {
  return (<Modal
    className={styles.styles}
    {...props}
  >{children}</Modal>);
}

export default FModal;
