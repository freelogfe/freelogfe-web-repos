import * as React from 'react';
import styles from './index.less';
import {SwapOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FWarningProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FWarning({className, ...props}: FWarningProps) {
  // return (<SwapOutlined {...props}/>);
  return (<i className={['freelog', 'fl-icon-warning1', styles.warning, className].join(' ')} {...props}/>);
}

export default FWarning;
