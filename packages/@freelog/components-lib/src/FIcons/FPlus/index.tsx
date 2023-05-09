import * as React from 'react';
// import styles from './index.less';

interface FPlusProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FPlus({className, ...props}: FPlusProps) {
  return (<i
    className={['freelog', 'fl-icon-tianjia', className].join(' ')}
    {...props}
  />);
}

export default FPlus;
