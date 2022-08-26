import * as React from 'react';
import styles from './index.less';
import { CSSProperties } from 'react';

interface FContentProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FContent({ className, ...props }: FContentProps) {
  return (<i className={['freelog', 'fl-icon-moban', className].join(' ')} {...props} />);
}

export default FContent;
