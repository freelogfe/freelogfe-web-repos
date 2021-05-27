import * as React from 'react';
import styles from './index.less';
import {UpOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FUpProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FUp({...props}: FUpProps) {
  return (<UpOutlined {...props} />);
}

export default FUp;
