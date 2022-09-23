import * as React from 'react';
// import styles from './index.less';

interface FObjectProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FObject({className, ...props}: FObjectProps) {
  // return (<SwapOutlined {...props}/>);
  return (<i className={['freelog', 'fl-icon-duixiang', className].join(' ')} {...props}/>);
}

export default FObject;
