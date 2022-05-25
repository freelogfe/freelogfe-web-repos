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
import { connect, Dispatch } from 'dva';
import { ConnectState, MarketPageModelState } from '@/models/connect';
import { RouteComponentProps } from 'react-router';
import { OnChange_ShowPage_Action } from '@/models/marketPage';

interface DiscoverProps extends RouteComponentProps {
  dispatch: Dispatch;
  marketPage: MarketPageModelState;
}

function Discover({ dispatch, marketPage, match }: DiscoverProps) {


  React.useEffect(() => {
    // console.log(match, '3908iojskdfjlskj');
    if (match.path.startsWith(FUtil.LinkTo.market())) {
      dispatch<OnChange_ShowPage_Action>({
        type: 'marketPage/onChange_ShowPage',
        payload: {
          value: 'market',
        },
      });
    }
    if (match.path.startsWith(FUtil.LinkTo.exampleNodes())) {
      dispatch<OnChange_ShowPage_Action>({
        type: 'marketPage/onChange_ShowPage',
        payload: {
          value: 'example',
        },
      });
    }
  }, [match]);

  return (<div>
    <div className={styles.top}>
      <div style={{ height: 20 }} />
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
        activated={marketPage.showPage}
      />
      {/*{console.log(marketPage.showPage, 'marketPage.showPage903iolskfdfjl')}*/}
    </div>
    <FCenterLayout>
      {/*<FAffixTabs*/}
      {/*  options={marketPage.navOptions}*/}
      {/*  value={marketPage.tabValue}*/}
      {/*  onChange={onChangeTab}*/}
      {/*/>*/}

      {marketPage.showPage === 'market' && <Resources />}
      {marketPage.showPage === 'example' && <Examples />}
    </FCenterLayout>
    <FFooter />
  </div>);
}

export default withRouter(connect(({ marketPage }: ConnectState) => ({
  marketPage,
}))(Discover));
