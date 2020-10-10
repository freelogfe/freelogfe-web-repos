import * as React from 'react';
import styles from './index.less';
import {TagOutlined, TagFilled} from '@ant-design/icons';
import {CSSProperties} from "react";

interface FFavoriteProps {
  className?: string;
  style?: CSSProperties;
  filled?: boolean;

  onClick?(): void;
}

function FFavorite({filled = false, ...props}: FFavoriteProps) {
  if (!filled) {
    return (<TagOutlined {...props} />);
  }
  return (<TagFilled  {...props} />);
}

export default FFavorite;
