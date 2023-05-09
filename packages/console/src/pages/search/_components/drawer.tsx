import { Drawer } from 'antd';
import React, { useState } from 'react';
import styles from './drawer.less';

interface ImageProps {
  className?: string;
  children?: any;
  close: any;
}
export default function Image(props: ImageProps) {
  return (
    <Drawer
      className={styles.drawer}
      closable={false}
      onClose={props.close}
      open={true}
      bodyStyle={{ borderRadius: '10px', background: '#FAFBFC' }}
      contentWrapperStyle={{ borderRadius: '10px',overflow: 'hidden' }}
      height="calc(100vh - 80px)"
      placement="bottom"
    >
      {props.children}
    </Drawer>
  );
}
