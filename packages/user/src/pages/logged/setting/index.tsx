import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, SettingPageModelState } from '@/models/connect';
import Profile from './Profile';
import Security from './Security';
import Privacy from './Privacy';
import {
  OnChange_ShowPage_Action,
  OnMount_Page_Action,
  OnUnmount_Page_Action,
} from '@/models/settingPage';
import * as AHooks from 'ahooks';
import useUrlState from '@ahooksjs/use-url-state';

interface SettingProps {
  dispatch: Dispatch;
  settingPage: SettingPageModelState;
}

function Setting({ dispatch, settingPage }: SettingProps) {
  // console.log(settingPage, 'settingPagesettingPagesettingPage1111');
  const [urlParams] = useUrlState<{ type: string }>();
  AHooks.useMount(() => {
    // console.log('setting/onMountPage');
    dispatch<OnMount_Page_Action>({
      type: 'settingPage/onMount_Page',
    });
    if ((urlParams.type === 'wechat')) {
      dispatch<OnChange_ShowPage_Action>({
        type: 'settingPage/onChange_ShowPage',
        payload: {
          value: 'security',
        },
      });
    }
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_Page_Action>({
      type: 'settingPage/onUnmount_Page',
    });
  });

  return (
    <div className={styles.styles}>
      <div className={styles.header}>
        <a
          className={settingPage.showPage === 'profile' ? styles.active : ''}
          onClick={() => {
            dispatch<OnChange_ShowPage_Action>({
              type: 'settingPage/onChange_ShowPage',
              payload: {
                value: 'profile',
              },
            });
          }}
        >
          个人资料
        </a>
        <div style={{ width: 30 }} />
        <a
          onClick={() => {
            dispatch<OnChange_ShowPage_Action>({
              type: 'settingPage/onChange_ShowPage',
              payload: {
                value: 'security',
              },
            });
          }}
          className={settingPage.showPage === 'security' ? styles.active : ''}
        >
          账号安全
        </a>
        {/*<div style={{ width: 30 }} />*/}
        {/*<a*/}
        {/*  onClick={() => {*/}
        {/*    // console.log('123412341234');*/}
        {/*    dispatch<OnChange_ShowPage_Action>({*/}
        {/*      type: 'settingPage/onChange_ShowPage',*/}
        {/*      payload: {*/}
        {/*        value: 'privacy',*/}
        {/*      },*/}
        {/*    });*/}
        {/*  }}*/}
        {/*  className={settingPage.showPage === 'privacy' ? styles.active : ''}*/}
        {/*>*/}
        {/*  隐私*/}
        {/*</a>*/}
      </div>
      <div className={styles.content}>
        {settingPage.showPage === 'profile' && <Profile />}

        {settingPage.showPage === 'security' && <Security />}

        {settingPage.showPage === 'privacy' && <Privacy />}
      </div>
    </div>
  );
}

export default connect(({ settingPage }: ConnectState) => ({
  settingPage,
}))(Setting);
