import * as React from 'react';
// import styles from './index.less';

interface FUnbindingProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FUnbinding({className, ...props}: FUnbindingProps) {
  return (<i
    className={['freelog', 'fl-icon-jiechubangding', className].join(' ')}
    {...props}
  />);
}

export default FUnbinding;
