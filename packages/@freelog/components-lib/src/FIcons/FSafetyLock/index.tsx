import * as React from 'react';
import styles from './index.less';

interface FSafetyLockProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FSafetyLock({className, ...props}: FSafetyLockProps) {
  return (<i className={['freelog', 'fl-icon-zhongzhimima', styles.warning, className].join(' ')} {...props}/>);
}

export default FSafetyLock;
