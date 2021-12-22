import * as React from 'react';
import styles from './index.less';
import sharedStyles from '../iconShared.less';
import {CSSProperties} from "react";

interface FCheckProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FCheck({className, ...props}: FCheckProps) {
  // return (<SwapOutlined {...props}/>);
  return (<i className={['freelog', 'fl-icon-shenqingchenggong1', sharedStyles.shared, styles.icon, className].join(' ')} {...props}/>);
}

export default FCheck;
