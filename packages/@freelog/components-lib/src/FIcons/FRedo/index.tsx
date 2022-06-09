import * as React from 'react';
import styles from './index.less';
import {RedoOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FRedoProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FRedo({...props}: FRedoProps) {
  return (<RedoOutlined {...props} />);
}

export default FRedo;
