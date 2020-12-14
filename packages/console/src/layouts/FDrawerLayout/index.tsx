import * as React from 'react';
import styles from './index.less';
import {Drawer} from 'antd';

interface FDrawerLayoutProps {
  header: string;
  children: React.ReactNode;
  visible: boolean;
  width?: number;

  onClose?(): void;
}

function FDrawerLayout({}: FDrawerLayoutProps) {
  return (<Drawer>

  </Drawer>);
}

export default FDrawerLayout;
