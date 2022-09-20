import * as React from 'react';
import styles from './index.less';

interface FWarningProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FWarning({className, ...props}: FWarningProps) {
  return (<i
    className={['freelog', 'fl-icon-warning1', styles.warning, className].join(' ')}
    {...props}
  />);
}

export default FWarning;
