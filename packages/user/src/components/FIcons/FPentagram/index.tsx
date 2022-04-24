import * as React from 'react';
import styles from './index.less';
import { PlusOutlined } from '@ant-design/icons';
import { CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes } from 'react';

interface FPentagramProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FPentagram({ className, style, ...props }: FPentagramProps) {
  return (<i
    className={['freelog', 'fl-icon-xing', className].join(' ')}
    style={style}
    {...props}
  />);
}

export default FPentagram;
