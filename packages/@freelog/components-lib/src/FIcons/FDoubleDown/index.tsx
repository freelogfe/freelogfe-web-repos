import * as React from 'react';
// import styles from './index.less';
// import {DoubleRightOutlined} from '@ant-design/icons';

interface FCloseProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(e: any): void;
}

function FDoubleUp({className = '', ...props}: FCloseProps) {
  return (<i className={['freelog', 'fl-icon-shouqi1', className].join(' ')} {...props} />);
}

export default FDoubleUp;
