import * as React from 'react';
import styles from './index.less';
import {DeleteOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface DeleteProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function Delete({...props}: DeleteProps) {
  return (<DeleteOutlined {...props} />);
}

export default Delete;
