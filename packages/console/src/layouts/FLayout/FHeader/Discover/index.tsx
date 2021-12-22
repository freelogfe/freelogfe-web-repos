import * as React from 'react';
import styles from './index.less';
import FMenu from "@/components/FMenu";
import FDropdown from "@/components/FDropdown";
import {router} from "umi";
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketPageModelState} from "@/models/connect";
import FNavLink from "@/layouts/FLayout/components/FNavLink";
import FUtil1 from "@/utils";
import {FUtil} from '@freelog/tools-lib';

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

interface DiscoverProps {
  dispatch: Dispatch;
  router: {
    location: Location;
  };
  marketPage: MarketPageModelState;
}

function Discover({router: routerObj, marketPage}: DiscoverProps) {
  // const cRoute = global.routerHistories[global.routerHistories.length - 1];
  const isCurrent: boolean = routerObj.location.pathname.startsWith('/market');

  function onDiscoverClick(value: string) {
    // console.log(params, 'paramsparams');
    if (value === '1' && routerObj.location.pathname !== '/market') {
      return router.push(FUtil.LinkTo.market());
    } else if (value === '2') {
      return window.open('https://f-presentations.freelog.com');
    }
  }

  return (<FDropdown
    // visible={true}
    overlay={<FMenu
      value={isCurrent ? marketPage.tabValue : ''}
      onClick={onDiscoverClick}
      options={discoverOptions}
    />}
  >
    <FNavLink
      // onClick={() => onDiscoverClick('1')}
      text={FUtil1.I18n.message('explorer')}
      to={FUtil.LinkTo.market()}
      active={isCurrent}
    />
  </FDropdown>);
}

export default connect(({router, marketPage}: ConnectState) => ({
  router,
  marketPage,
}))(Discover);
