import * as React from 'react';
import styles from './index.less';
import {PlusOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FPlusProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FPlus({...props}: FPlusProps) {
  return (<PlusOutlined {...props} />);
}

export default FPlus;
