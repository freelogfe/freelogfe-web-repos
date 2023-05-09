import * as React from 'react';
// import styles from './index.less';

interface FForbidProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FForbid({className, ...props}: FForbidProps) {
  return (<i className={['freelog', 'fl-icon-jinzhi', className].join(' ')} {...props}/>);
}

export default FForbid;
