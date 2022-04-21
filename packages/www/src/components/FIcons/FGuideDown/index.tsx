import * as React from 'react';
import styles from './index.less';
import { CSSProperties } from 'react';

interface FGuideDownProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FGuideDown({ className, ...props }: FGuideDownProps) {
  return (<i
    className={['freelog', 'fl-icon-xiangxia', className].join(' ')}
    {...props}
  />);
}

export default FGuideDown;
