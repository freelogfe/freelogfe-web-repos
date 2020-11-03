import React, {ChangeEvent, ChangeEventHandler} from 'react';
import styles from './index.less';
import {Layout, Dropdown, Affix} from 'antd';
import FMenu from '@/components/FMenu';
import {FCircleButton, FNormalButton} from '@/components/FButton';
import FInput from '@/components/FInput';
import {router, withRouter} from 'umi';
import {connect, Dispatch} from 'dva';
import {
  ConnectState,
  GlobalModelState,
  GlobalSearchingModelState, NodesModelState, StorageHomePageModelState,
  // RouterHistoriesModelState,
  UserModelState
} from '@/models/connect';
import {RouteComponentProps} from "react-router";
import FLayoutFooter from "@/layouts/FLayoutFooter";
import {setLocale} from 'umi-plugin-react/locale';
import {FTitleText, FContentText} from '@/components/FText';
import {i18nMessage} from "@/utils/i18n";
import {ChangeAction, FetchBucketsAction, OnChangeActivatedBucketAction} from "@/models/storageHomePage";
// import {
//   formatDate,
//   formatTime,
//   formatRelative,
//   formatNumber,
//   formatPlural,
//   formatMessage,
//   formatHTMLMessage
// } from 'umi-plugin-react/locale';
import {FPlus} from '@/components/FIcons';
import FDropdown from "@/components/FDropdown";
import Discover from "./Discover";
import Storage from "./Storage";
import Resource from "./Resource";
import Node from "./Node";
import Contract from "./Contract";

const creatorOptions = [
  {
    text: '创建资源',
    value: '1'
  },
  {
    text: '创建节点',
    value: '2'
  },
];

interface FLayoutProps extends RouteComponentProps {
  children: React.ReactNode | React.ReactNodeArray;
  dispatch: Dispatch;
  globalSearching: GlobalSearchingModelState;
  // routerHistories: GlobalModelState['routerHistories'];
  user: UserModelState,
  global: GlobalModelState;
  nodes: NodesModelState;
  storage: StorageHomePageModelState,
}

function FLayout({
                   children,
                   global,
                   dispatch,
                   globalSearching,
                   user,
                   nodes,
                   storage,
                   // ...props
                 }: FLayoutProps) {
  // console.log(props, 'propspropspropsLayout');

  React.useEffect(() => {
    dispatch<FetchBucketsAction>({
      type: 'storageHomePage/fetchBuckets',
    });
  }, []);

  function onDiscoverClick(value: string) {
    // console.log(params, 'paramsparams');
    if (value === '1' && global.routerHistories[global.routerHistories.length - 1].pathname !== '/market') {
      return router.push('/market');
    }
    if (value === '2' && !global.routerHistories[global.routerHistories.length - 1].pathname.startsWith('/example')) {
      return router.push('/example');
    }
  }


  function onCreateClick(value: string) {
    // console.log(params, 'params');
    if (value === '1') {
      return router.push('/resource/creator');
    }
    if (value === '2') {
      return router.push('/node/creator');
    }
  }

  return (
    <Layout
      className={styles.Layout}
      style={{backgroundColor: global.backgroundColor || 'transparent'}}
    >
      <Layout.Header className={styles.header}>
        <div className={styles.headerLeft}>
          <a
            onClick={() => onDiscoverClick('1')}
            className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')}
          />
          <div className={styles.MenuBar}>

            <Discover/>

            <Storage/>

            <Resource/>

            <Node/>

            <Contract/>

          </div>
        </div>

        <div className={styles.headerRight}>
          <FInput
            value={globalSearching.input}
            className={styles.FInput}
            // placeholder="Search in Freelog"
            size="small"
            theme="dark"
            onChange={(event: ChangeEvent<HTMLInputElement>) => dispatch({
              type: 'globalSearching/onInputChange',
              payload: event.target.value,
            })}
            // disabled={true}
          />

          <FDropdown overlay={<FMenu
            onClick={onCreateClick}
            options={creatorOptions}
          />}>
            <a
              className={styles.create}
              // onClick={() => onCreateClick('1')}
            >
              <FCircleButton/>
            </a>
          </FDropdown>

          <FDropdown overlay={<div className={styles.userPanel}>
            <div className={styles.userPanelHeader}>
              <img src={user.info?.headImage} alt="headImage"/>
              <div style={{height: 10}}/>
              <FTitleText type="h4" text={user.info?.username}/>
              <div style={{height: 8}}/>
              <FContentText text={user.info?.mobile || user.info?.email}/>
            </div>
            <div className={styles.userPanelMenu}>
              <a>个人中心</a>
              <a>登出</a>
            </div>
          </div>}>
            <a className={styles.avatar}>
              <img src={user.info?.headImage} alt={'avatar'}/>
            </a>
          </FDropdown>
        </div>
      </Layout.Header>

      {children}

      {/*{*/}
      {/*  global.route?.meta?.footer && (<FLayoutFooter/>)*/}
      {/*}*/}

    </Layout>
  );
}

export default withRouter(connect(({
                                     globalSearching,
                                     user,
                                     global,
                                     nodes,
                                     storageHomePage
                                   }: ConnectState) => ({
  globalSearching: globalSearching,
  routerHistories: global.routerHistories,
  user: user,
  global: global,
  nodes: nodes,
  storage: storageHomePage,
}))(FLayout));

// parse()
// router.
