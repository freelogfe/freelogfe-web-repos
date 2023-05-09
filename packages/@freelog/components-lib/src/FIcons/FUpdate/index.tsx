import * as React from 'react';
// import styles from './index.less';

interface FUpdateProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FUpdate({className, ...props}: FUpdateProps) {
  return (<i className={['freelog', 'fl-icon-gengxin', className].join(' ')} {...props} />);
}

export default FUpdate;
