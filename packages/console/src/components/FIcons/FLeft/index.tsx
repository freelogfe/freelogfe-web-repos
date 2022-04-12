import * as React from 'react';
import styles from './index.less';
import {LeftOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FLeftProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FLeft({...props}: FLeftProps) {
  return (<LeftOutlined {...props} />);
}

export default FLeft;
