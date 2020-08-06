import React, {ChangeEvent, ChangeEventHandler} from 'react';
import styles from './index.less';
import {Layout, Dropdown, Affix} from 'antd';
import FMenu from '@/components/FMenu';
// import avatarSrc from '../../assets/avatar.png';
import {FCircleButton} from '@/components/FButton';
import FInput from '@/components/FInput';
import {router, withRouter} from 'umi';
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalSearchingModelState, RouterHistoriesModelState, UserModelState} from '@/models/connect';
import {RouteComponentProps} from "react-router";
import FLayoutFooter from "@/layouts/FLayoutFooter";
import {setLocale} from 'umi-plugin-react/locale';
import {FTitleText, FContentText} from '@/components/FText';
import {i18nMessage} from "@/utils/i18n";
// import {
//   formatDate,
//   formatTime,
//   formatRelative,
//   formatNumber,
//   formatPlural,
//   formatMessage,
//   formatHTMLMessage
// } from 'umi-plugin-react/locale';

const discoverOptions = [
  {
    text: '发现资源',
    value: '1'
  },
  {
    text: '发现节点',
    value: '2'
  },
];

const resourcesOptions = [
  {
    text: '我的资源',
    value: '1'
  },
  {
    text: '我的收藏',
    value: '2'
  },
];

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
  global: GlobalSearchingModelState;
  routerHistories: RouterHistoriesModelState;
  user: UserModelState,
}

function FLayout({children, dispatch, global, routerHistories, user, ...props}: FLayoutProps) {
  // console.log(props, 'propspropspropsLayout');

  function onDiscoverClick(value: string) {
    // console.log(params, 'paramsparams');
    if (value === '1' && routerHistories[routerHistories.length - 1].pathname !== '/market') {
      return router.push('/market');
    }
    if (value === '2' && routerHistories[routerHistories.length - 1].pathname !== '/example') {
      return router.push('/example');
    }
  }

  function onClickResource(value: string) {
    if (value === '1') {
      return router.push('/resource/list');
    }
    if (value === '2') {
      return router.push('/resource/collect');
    }
  }

  function onCreateClick(value: string) {
    // console.log(params, 'params');
    if (value === '1') {
      return router.push('/resource/creator');
    }
    if (value === '2') {

    }
  }

  return (
    <Layout className={styles.Layout}>
      <Layout.Header className={styles.header}>
        <div className={styles.headerLeft}>
          <a
            onClick={() => onDiscoverClick('1')}
            className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')}
          />
          <div className={styles.MenuBar}>
            <Dropdown overlay={<FMenu
              onClick={onDiscoverClick}
              options={discoverOptions}
            />}>
              <a onClick={() => onDiscoverClick('1')} className={styles.Menu}>
                {i18nMessage('explorer')}
              </a>
            </Dropdown>
            <a className={styles.Menu}>{i18nMessage('storage')}</a>
            <Dropdown overlay={<FMenu
              onClick={onClickResource}
              options={resourcesOptions}
            />}>
              <a onClick={() => onClickResource('1')}
                 className={styles.Menu}>{i18nMessage('resource_manage')}</a>
            </Dropdown>
            <a className={styles.Menu}>{i18nMessage('node_manage')}</a>
            <a className={styles.Menu}>{i18nMessage('contract_manage')}</a>
          </div>
        </div>
        <div className={styles.headerRight}>
          <FInput
            value={global.input}
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

          <Dropdown overlay={<FMenu
            onClick={onCreateClick}
            options={creatorOptions}
          />}
          >
            <a className={styles.create} onClick={() => onCreateClick('1')}>
              <FCircleButton/>
            </a>
          </Dropdown>

          <Dropdown overlay={<div className={styles.userPanel}>
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
          </Dropdown>
        </div>
      </Layout.Header>

      {children}

      <div style={{height: 100}}/>

      <FLayoutFooter/>

    </Layout>
  );
}

export default withRouter(connect(({globalSearching, routerHistories, user}: ConnectState) => ({
  global: globalSearching,
  routerHistories: routerHistories,
  user: user,
}))(FLayout));

// parse()
// router.
