import * as React from 'react';
import styles from './index.less';

interface FResourceFileProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FResourceFile({className, ...props}: FResourceFileProps) {
  return (<i className={['freelog', 'fl-icon-ziyuanwenjian', className, styles.style].join(' ')} {...props}/>);
}

export default FResourceFile;
