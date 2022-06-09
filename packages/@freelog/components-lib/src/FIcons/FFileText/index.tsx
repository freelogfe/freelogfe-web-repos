import * as React from 'react';
import styles from './index.less';
import {FileTextOutlined} from '@ant-design/icons';
import {CSSProperties} from "react";

interface FFileTextProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FFileText({...props}: FFileTextProps) {
  return (<FileTextOutlined {...props}/>);
}

export default FFileText;
