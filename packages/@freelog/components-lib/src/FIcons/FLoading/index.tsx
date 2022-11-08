import * as React from 'react';
import styles from './index.less';
// import {LoadingOutlined} from '@ant-design/icons';

interface FLoadingProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FLoading({className, ...props}: FLoadingProps) {
  return (<i className={['freelog', 'fl-icon-zhongzhi', styles.icon, className].join(' ')} {...props} />);
}

export default FLoading;
