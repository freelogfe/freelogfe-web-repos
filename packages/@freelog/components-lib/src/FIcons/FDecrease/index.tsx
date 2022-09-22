import * as React from 'react';
// import styles from './index.less';

interface FDecreaseProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FDecrease({className = '', ...props}: FDecreaseProps) {
  return (<i className={['freelog', 'fl-icon-shouqi2', className].join(' ')} {...props} />);
}

export default FDecrease;
