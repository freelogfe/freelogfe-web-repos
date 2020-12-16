import * as React from 'react';
import styles from './index.less';
import FSiderLayout from '@/layouts/FSiderLayout';
import Sider from './Sider';
import Content from './Content';
import NoContent from './NoContent';
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import FContentLayout from "@/layouts/FContentLayout";
import Header from "./Header";
import {connect} from 'dva';
import {ConnectState, StorageHomePageModelState} from "@/models/connect";

interface StorageProps {
  storageHomePage: StorageHomePageModelState;
}

function Storage({storageHomePage}: StorageProps) {
  return (<FLeftSiderLayout
    // contentClassName={storageHomePage.objectList.length === 0 ? styles.backgroundTransparent : ''}
    header={<Header/>}
    sider={<Sider/>}
    type="table"
    contentStyles={{
      backgroundColor: storageHomePage.objectList.length === 0 ? 'transparent': undefined,
      boxShadow: storageHomePage.objectList.length === 0 ? 'none' : undefined,
    }}
    hasBottom={storageHomePage.objectList.length !== 0}
  >
    <Content/>
  </FLeftSiderLayout>);
}

export default connect(({storageHomePage}: ConnectState) => ({
  storageHomePage,
}))(Storage);
