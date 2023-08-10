import * as React from 'react';
import styles from './index.less';

interface FStorageSpaceProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FStorageSpace({className, style, ...props}: FStorageSpaceProps) {
  return (<i
    className={[styles.styles, 'freelog', 'fl-icon-congcunchukongjianxuanze', className].join(' ')}
    style={style}
    {...props}
  />);

}

export default FStorageSpace;
