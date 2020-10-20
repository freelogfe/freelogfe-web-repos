import * as React from 'react';
import styles from './index.less';
import {FileSearchOutlined} from '@ant-design/icons';
import {CSSProperties} from "react";

interface FFileTextProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FFileSearch({...props}: FFileTextProps) {
  return (<FileSearchOutlined {...props}/>);
}

export default FFileSearch;
