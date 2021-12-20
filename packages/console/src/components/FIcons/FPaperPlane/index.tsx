import * as React from 'react';
import styles from './index.less';
import { CSSProperties } from 'react';

interface FUserProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FPaperPlane({ className, ...props }: FUserProps) {
  // return (<SwapOutlined {...props}/>);
  return (<i className={['freelog', 'fl-icon-fahang', className, styles.style].join(' ')} {...props} />);
}

export default FPaperPlane;
