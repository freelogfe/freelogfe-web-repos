import * as React from 'react';
import styles from './index.less';
import {TagOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FFavoriteProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FFavorite({...props}: FFavoriteProps) {
  return (<TagOutlined {...props} />);
}

export default FFavorite;
