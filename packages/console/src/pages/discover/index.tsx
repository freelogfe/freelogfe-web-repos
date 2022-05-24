import * as React from 'react';
import styles from './index.less';
import Poster from '@/pages/market/index/Poster';
import FNavTabs from '@/components/FNavTabs';
import { FUtil } from '@freelog/tools-lib';
import FCenterLayout from '@/layouts/FCenterLayout';
import Resources from '@/pages/discover/market';
import Examples from '@/pages/market/examples';
import FFooter from '@/layouts/FFooter';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { ConnectState, MarketPageModelState } from '@/models/connect';
import { RouteComponentProps } from 'react-router';

interface DiscoverProps extends RouteComponentProps{
  children: React.ReactNode | React.ReactNodeArray;
  marketPage: MarketPageModelState;
}

function Discover({ children, marketPage }: DiscoverProps) {

  // function onChangeTab(value: '1' | '2') {
  //   if (value === '2' && marketPage.tabValue !== '2') {
  //     return window.open('https://f-presentations.freelog.com');
  //   }
  // }

  return (<div>
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
            href: FUtil.LinkTo.exampleNodes(),
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
  </div>);
}

export default withRouter(connect(({ marketPage }: ConnectState) => ({
  marketPage,
}))(Discover));
