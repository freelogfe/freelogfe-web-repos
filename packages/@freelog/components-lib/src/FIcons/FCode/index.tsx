import * as React from 'react';
// import styles from './index.less';

interface FCodeProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FCode({className, ...props}: FCodeProps) {
  return (<i className={['freelog', 'fl-icon-daima', className].join(' ')} {...props} />);
}

export default FCode;
