import * as React from 'react';
import styles from './index.less';
// import {PlusOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FPlusProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FPlus({className, style, ...props}: FPlusProps) {
  return (<i
    className={['freelog', 'fl-icon-tianjia', className].join(' ')}
    style={style}
    {...props}
  />);
}

export default FPlus;
