import * as React from 'react';
// import styles from './index.less';

interface FContentProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FContent({ className, ...props }: FContentProps) {
  return (<i className={['freelog', 'fl-icon-moban', className].join(' ')} {...props} />);
}

export default FContent;
