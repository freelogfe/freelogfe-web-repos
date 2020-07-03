import * as React from 'react';
import styles from './index.less';
import FLayout from '@/layouts/FLayout';
import Sider from './Sider';

interface FInfoLayoutProps {
  children: React.ReactNodeArray | React.ReactNode;
}

export default function ({children}: FInfoLayoutProps) {
  return (<FLayout sider={<Sider/>} structure="left-right">{children}</FLayout>);
}


