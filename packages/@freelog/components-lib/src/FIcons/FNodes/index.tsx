import * as React from 'react';
import styles from './index.less';

interface FNodesProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FNodes({className, ...props}: FNodesProps) {
  return (<i className={['freelog', 'fl-icon-jiedian', className, styles.style].join(' ')} {...props}/>);
}

export default FNodes;
