import * as React from 'react';
import styles from './index.less';

interface FResourceProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FResource({className, ...props}: FResourceProps) {
  return (<i className={['freelog', 'fl-icon-ziyuan', className, styles.style].join(' ')} {...props}/>);
}

export default FResource;
