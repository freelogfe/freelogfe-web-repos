import * as React from 'react';
import styles from './index.less';
import FSiderLayout from '@/layouts/FSiderLayout';
import Sider from './Sider';
import Content from './Content';
import NoContent from './NoContent';

interface StorageProps {

}

function Storage({}: StorageProps) {
  return (<FSiderLayout sider={<Sider/>}>
    <Content/>
  </FSiderLayout>);
}

export default Storage;
