import * as React from 'react';
// import styles from './index.less';

interface FUpdateVersionProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FUpdateVersion({className, ...props}: FUpdateVersionProps) {
  return (<i className={['freelog', 'fl-icon-gengxinbanben', className].join(' ')} {...props} />);
}

export default FUpdateVersion;
