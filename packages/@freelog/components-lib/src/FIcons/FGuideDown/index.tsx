import * as React from 'react';
// import styles from './index.less';

interface FGuideDownProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FGuideDown({ className, ...props }: FGuideDownProps) {
  return (<i
    className={['freelog', 'fl-icon-xiangxia', className].join(' ')}
    {...props}
  />);
}

export default FGuideDown;
