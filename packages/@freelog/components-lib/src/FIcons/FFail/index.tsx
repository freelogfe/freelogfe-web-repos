import * as React from 'react';
import styles from './index.less';

interface FFailProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FFail({className, ...props}: FFailProps) {
  return (<i
    className={['freelog', 'fl-icon-shibai', styles.warning, className].join(' ')}
    {...props}
  />);
}

export default FFail;
