import * as React from 'react';
import {Button} from 'antd';
import styles from './index.less';
import {ButtonProps} from "antd/lib/button/button";

export default function ({children, shape, ...props}: ButtonProps) {
  if (shape === 'circle') {
    return (<Button
      shape={shape}
      className={styles.Button}
      {...props}
    >
      {children}
    </Button>);
  }
  return (
    <Button {...props}>
      {children}
    </Button>
  )
}
