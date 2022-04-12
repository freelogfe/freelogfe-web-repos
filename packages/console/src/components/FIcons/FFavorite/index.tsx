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

function FFavorite({filled = false, className, ...props}: FFavoriteProps) {
  if (!filled) {
    // return (<TagOutlined {...props} />);
    return (<i
      className={['freelog', 'fl-icon-shoucang', className].join(' ')}
      {...props}
    />);
  }
  // return (<TagFilled  {...props} />);
  return (<i
    className={['freelog', 'fl-icon-yishoucang', className].join(' ')}
    {...props}
  />);
}

export default FFavorite;
