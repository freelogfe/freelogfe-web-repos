import * as React from 'react';
import styles from './index.less';
import {Space} from "antd";
import FBlock from './FBlock';

interface FFormLayoutProps {
  children: React.ReactNodeArray | React.ReactNode;
}

function FFormLayout({children}: FFormLayoutProps) {
  return (<Space size={50} direction="vertical" className={styles.workspace}>
    {children}
  </Space>);
}

FFormLayout.FBlock = FBlock;

export default FFormLayout;
