import * as React from 'react';
import styles from './index.less';
import {LoadingOutlined} from '@ant-design/icons';
import {CSSProperties} from "react";

interface FLoadingProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FLoading({className, ...props}: FLoadingProps) {
  // @ts-ignore
  return (<LoadingOutlined className={[styles.icon, className].join(' ')} {...props}/>);
}

export default FLoading;
