import * as React from 'react';
// import styles from './index.less';

interface FBindingProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FBinding({className, ...props}: FBindingProps) {
  return (<i
    className={['freelog', 'fl-icon-bangding', className].join(' ')}
    {...props}
  />);
}

export default FBinding;
