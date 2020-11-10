import * as React from 'react';
import styles from './index.less';
import {FileSearchOutlined} from '@ant-design/icons';
import {CSSProperties} from "react";

interface FFileTextProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FFileSearch({className, ...props}: FFileTextProps) {
  // return (<FileSearchOutlined {...props}/>);
  return (<i className={['freelog', 'fl-icon-chakanziyuan', className].join(' ')} {...props}/>);
}

export default FFileSearch;
