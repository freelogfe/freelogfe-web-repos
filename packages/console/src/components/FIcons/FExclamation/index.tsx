import * as React from 'react';
import styles from './index.less';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FUpProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FExclamation({...props}: FUpProps) {
  return (<ExclamationCircleOutlined {...props} />);
}

export default FExclamation;
