import * as React from 'react';
// import styles from './index.less';

interface FFavoriteProps {
  className?: string;
  style?: React.CSSProperties;
  filled?: boolean;

  onClick?(): void;
}

function FFavorite({filled = false, className, ...props}: FFavoriteProps) {
  if (!filled) {
    return (<i
      className={['freelog', 'fl-icon-shoucang', className].join(' ')}
      {...props}
    />);
  }
  return (<i
    className={['freelog', 'fl-icon-yishoucang', className].join(' ')}
    {...props}
  />);
}

export default FFavorite;
