import * as React from 'react';
import styles from './index.less';
import Poster from './Poster';
import FNavTabs from '@/components/FNavTabs';
import { FUtil } from '@freelog/tools-lib';
import FCenterLayout from '@/layouts/FCenterLayout';
import Resources from './market';
import Examples from './examples';
import { withRouter } from 'umi';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { ConnectState, DiscoverPageModelState } from '@/models/connect';
import { RouteComponentProps } from 'react-router';
import { OnChange_ShowPage_Action } from '@/models/discoverPage';
import FComponentsLib from '@freelog/components-lib';

// import * as AHooks from 'ahooks';

interface DiscoverProps extends RouteComponentProps {
  dispatch: Dispatch;
  discoverPage: DiscoverPageModelState;
}

function Discover({ dispatch, discoverPage, match }: DiscoverProps) {
  React.useEffect(() => {
    // console.log(match, '3908iojskdfjlskj');
    if (match.path.startsWith(FUtil.LinkTo.market())) {
      dispatch<OnChange_ShowPage_Action>({
        type: 'discoverPage/onChange_ShowPage',
        payload: {
          value: 'market',
        },
      });
    }
    if (match.path.startsWith(FUtil.LinkTo.exampleNodes())) {
      dispatch<OnChange_ShowPage_Action>({
        type: 'discoverPage/onChange_ShowPage',
        payload: {
          value: 'example',
        },
      });
    }
  }, [match]);

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
        activated={discoverPage.showPage}
      />
    </div>
    <FCenterLayout>
      {discoverPage.showPage === 'market' && <Resources />}
      {discoverPage.showPage === 'example' && <Examples />}
    </FCenterLayout>
    {/*<FFooter />*/}
    <FComponentsLib.FPageFooter />
  </div>);
}

export default withRouter(connect(({ discoverPage }: ConnectState) => ({
  discoverPage,
}))(Discover));
