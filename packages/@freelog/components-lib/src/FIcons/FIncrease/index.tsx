import * as React from 'react';
// import styles from './index.less';

interface FIncreaseProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FIncrease({className, ...props}: FIncreaseProps) {
  return (<i className={['freelog', 'fl-icon-zhankai1', className].join(' ')} {...props} />);
}

export default FIncrease;
