import * as React from 'react';
import styles from './index.less';
import {DownOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FDownProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FDown({...props}: FDownProps) {
  return (<DownOutlined {...props} />);
}

export default FDown;
