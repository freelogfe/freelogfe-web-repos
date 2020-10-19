import * as React from 'react';
import styles from './index.less';
import FSiderLayout from '@/layouts/FSiderLayout';
import Sider from './Sider';

interface NodeManagerProps {

}

function NodeManager({}: NodeManagerProps) {
  return (<FSiderLayout sider={<Sider/>}>
    5678
  </FSiderLayout>);
}

export default NodeManager;
