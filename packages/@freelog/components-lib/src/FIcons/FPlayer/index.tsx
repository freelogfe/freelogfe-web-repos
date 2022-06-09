import * as React from 'react';
import styles from './index.less';
import { CSSProperties } from 'react';

interface FPlayerProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FPlayer({className, ...props}: FPlayerProps) {
  return (<i className={['freelog', 'fl-icon-bofang', className, styles.style].join(' ')} {...props}/>);
}

export default FPlayer;
