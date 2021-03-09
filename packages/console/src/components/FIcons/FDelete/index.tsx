import * as React from 'react';
import styles from './index.less';
import {DeleteOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FDeleteProps {
  className?: string;
  style?: CSSProperties;

  // onClick?(): void;
}

function FDelete({className, ...props}: FDeleteProps) {
  return (<i className={['freelog', 'fl-icon-shanchu', className].join(' ')} {...props} />);
}

export default FDelete;
