import * as React from 'react';
import {Modal, Space} from 'antd';
import styles from './index.less';
import {ModalFuncProps} from "antd/lib/modal";
import FComponentsLib from '@freelog/components-lib';

interface FConfirmModalParamsType extends ModalFuncProps {
  message?: string;
}

function fConfirmModal({message, ...config}: FConfirmModalParamsType) {
  Modal.confirm({
    icon: null,
    content: (<Space size={10}>
      <FComponentsLib.FIcons.FWarning style={{display: 'inline-block'}}/>
      <span>{message}</span>
    </Space>),
    ...config,
  });
}

export default fConfirmModal;
