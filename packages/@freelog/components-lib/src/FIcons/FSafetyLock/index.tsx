import * as React from 'react';
import styles from './index.less';
import {SwapOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FSafetyLockProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FSafetyLock({className, ...props}: FSafetyLockProps) {
  // return (<SwapOutlined {...props}/>);
  return (<i className={['freelog', 'fl-icon-zhongzhimima', styles.warning, className].join(' ')} {...props}/>);
}

export default FSafetyLock;
