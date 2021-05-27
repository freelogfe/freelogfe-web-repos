import * as React from 'react';
import styles from './index.less';
import {LoadingOutlined} from '@ant-design/icons';
import {CSSProperties} from "react";

interface FInfoProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FInfo({className, ...props}: FInfoProps) {
  return (<LoadingOutlined className={[styles.icon, className].join(' ')} {...props}/>);
}

export default FInfo;
