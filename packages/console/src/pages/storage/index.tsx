import * as React from 'react';
import styles from './index.less';
import FSiderLayout from '@/layouts/FSiderLayout';
import Sider from './Sider';
import Content from './Content';
import NoContent from './NoContent';
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import FContentLayout from "@/layouts/FContentLayout";
import Header from "./Header";

interface StorageProps {

}

function Storage({}: StorageProps) {
  return (<FLeftSiderLayout
    header={<Header/>}
    sider={<Sider/>}
    type="table"
  >
    <Content/>
  </FLeftSiderLayout>);
}

export default Storage;
