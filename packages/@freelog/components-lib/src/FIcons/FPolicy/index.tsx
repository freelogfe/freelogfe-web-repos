import * as React from 'react';
import styles from './index.less';

interface FPolicyProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FPolicy({className, style, ...props}: FPolicyProps) {
  return (<i
    className={[styles.styles, 'freelog', 'fl-icon-celve', className].join(' ')}
    style={style}
    {...props}
  />);
}

export default FPolicy;
