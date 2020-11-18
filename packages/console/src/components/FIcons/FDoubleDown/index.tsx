import * as React from 'react';
import styles from './index.less';
import {DoubleRightOutlined} from '@ant-design/icons';

interface FCloseProps {
  className?: string;
}

function FDoubleUp({className = '', ...props}: FCloseProps) {
  return (<DoubleRightOutlined
    className={[className, styles.icon].join(' ')}
    {...props}
  />);
}

export default FDoubleUp;
