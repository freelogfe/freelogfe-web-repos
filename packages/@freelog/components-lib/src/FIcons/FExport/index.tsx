import * as React from 'react';
// import styles from './index.less';

interface FLineProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FLine({className, ...props}: FLineProps) {
  return (<i className={['freelog', 'fl-icon-daochu', className].join(' ')} {...props} />);
}

export default FLine;
