import * as React from 'react';
import styles from './index.less';
import FSiderLayout from '@/layouts/FSiderLayout';
import Sider from './Sider';

interface FInfoLayoutProps {
  children: React.ReactNodeArray | React.ReactNode;
}

export default function ({children}: FInfoLayoutProps) {
  return (<FSiderLayout sider={<Sider/>}>{children}</FSiderLayout>);
}


