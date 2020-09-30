import * as React from 'react';
import styles from './index.less';
import {InfoCircleOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FInfoProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FInfo({...props}: FInfoProps) {
  return (<InfoCircleOutlined {...props}/>);
}

export default FInfo;
