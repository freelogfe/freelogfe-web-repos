import * as React from 'react';
import styles from './index.less';
import {InfoCircleOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FInfoProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FInfo({className,...props}: FInfoProps) {
  return (<i className={['freelog', 'fl-icon-tishixinxi', className].join(' ')} {...props} />);

}

export default FInfo;
