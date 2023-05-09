import * as React from 'react';
// import styles from './index.less';

interface FCancelCollectProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FCancelCollect({className, ...props}: FCancelCollectProps) {
  return (<i className={['freelog', 'fl-icon-yishoucang', className].join(' ')} {...props} />);
}

export default FCancelCollect;
