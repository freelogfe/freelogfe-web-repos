import * as React from 'react';
import styles from './index.less';
import {EditOutlined} from '@ant-design/icons';
import {CSSProperties} from "react";

interface FFileTextProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FEdit({...props}: FFileTextProps) {
  return (<EditOutlined {...props}/>);
}

export default FEdit;
