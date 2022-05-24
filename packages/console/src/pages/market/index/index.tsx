import React from 'react';
import styles from './index.less';
import FAffixTabs from '@/components/FAffixTabs';
import { withRouter } from 'umi';
import Resources from './Resources';
import Examples from '@/pages/market/Examples';
import { connect, Dispatch } from 'dva';
import {
  OnMountPageAction,
  OnUnmountPageAction,
} from '@/models/marketPage';
import { ConnectState, MarketPageModelState } from '@/models/connect';
import FFooter from '@/layouts/FFooter';
import FCenterLayout from '@/layouts/FCenterLayout';
import * as AHooks from 'ahooks';
import FNavTabs from '@/components/FNavTabs';
import Poster from '@/pages/market/index/Poster';
import { FUtil } from '@freelog/tools-lib';

interface MarketProps {
  dispatch: Dispatch;

  marketPage: MarketPageModelState;
}

function Market({ dispatch, marketPage, ...props }: MarketProps) {

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'marketPage/onMountPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'marketPage/onUnmountPage',
    });
  });

  function onChangeTab(value: '1' | '2') {
    if (value === '2' && marketPage.tabValue !== '2') {
      return window.open('https://f-presentations.freelog.com');
    }
  }

  return (<>
    <div className={styles.top}>
      <Poster />
      <div style={{ height: 10 }} />
      <FNavTabs
        options={[
          {
            value: 'market',
            label: '资源市场',
            href: FUtil.LinkTo.market(),
          },
          {
            value: 'example',
            label: '示例节点',
            href: FUtil.LinkTo.market(),
          },
        ]}
        activated={'market'}
      />
    </div>
    <FCenterLayout>
      {/*<FAffixTabs*/}
      {/*  options={marketPage.navOptions}*/}
      {/*  value={marketPage.tabValue}*/}
      {/*  onChange={onChangeTab}*/}
      {/*/>*/}

      {marketPage.tabValue === '1' && <Resources />}
      {marketPage.tabValue === '2' && <Examples />}
    </FCenterLayout>
    <FFooter />
  </>);
}

export default withRouter(connect(({ marketPage }: ConnectState) => ({
  marketPage,
}))(Market));

