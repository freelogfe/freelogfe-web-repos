import * as React from 'react';
import styles from './index.less';

interface FCheckProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FCheck({className, ...props}: FCheckProps) {
  return (<i className={['freelog', 'fl-icon-shenqingchenggong1', styles.icon, className].join(' ')} {...props}/>);
}

export default FCheck;
