import * as React from 'react';
import styles from './index.less';
import {SwapOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FFailProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FFail({className, ...props}: FFailProps) {
  // return (<SwapOutlined {...props}/>);
  return (<i
    className={['freelog', 'fl-icon-shibai', styles.warning, className].join(' ')}
    {...props}
  />);
}

export default FFail;
