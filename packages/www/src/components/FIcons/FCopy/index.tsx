import * as React from 'react';
import styles from './index.less';
import {DeleteOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FCopyProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FCopy({className, ...props}: FCopyProps) {
  return (<i className={['freelog', 'fl-icon-fuzhimingcheng', className].join(' ')} {...props} />);
}

//

export default FCopy;
