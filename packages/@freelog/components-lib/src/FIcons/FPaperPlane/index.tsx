import * as React from 'react';
// import styles from './index.less';

interface FPaperPlaneProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FPaperPlane({ className, ...props }: FPaperPlaneProps) {
  // return (<SwapOutlined {...props}/>);
  return (<i className={['freelog', 'fl-icon-fahang', className].join(' ')} {...props} />);
}

export default FPaperPlane;
