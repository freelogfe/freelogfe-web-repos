import * as React from 'react';
// import styles from './index.less';

interface FExitProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FExit({className, ...props}: FExitProps) {
  return (<i className={['freelog', 'fl-icon-tuichu', className].join(' ')} {...props} />);
}

export default FExit;
