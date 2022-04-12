import * as React from 'react';
import {Modal, Space} from 'antd';
import styles from './index.less';
import {FWarning} from "../FIcons";
import {ModalFuncProps} from "antd/lib/modal";

interface FConfirmModalParamsType extends ModalFuncProps {
  message?: string;
}

function fConfirmModal({message, ...config}: FConfirmModalParamsType) {
  Modal.confirm({
    icon: null,
    content: (<Space size={10}>
      <FWarning style={{display: 'inline-block'}}/>
      <span>{message}</span>
    </Space>),
    ...config,
  });
}

export default fConfirmModal;
