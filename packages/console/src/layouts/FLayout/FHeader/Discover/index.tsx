import * as React from 'react';
import styles from './index.less';
// import sharedStyles from '../index.less';
import FMenu from "@/components/FMenu";
import {i18nMessage} from "@/utils/i18n";
import FDropdown from "@/components/FDropdown";
import {router, Link} from "umi";
import {connect, Dispatch, Router, RouterAPI} from 'dva';
import {ConnectState, GlobalModelState, MarketPageModelState, MarketResourcePageModelState} from "@/models/connect";
// import {market} from "@/utils/path-assembler";
import FNavLink from "@/layouts/FLayout/components/FNavLink";
import FUtil from "@/utils";

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
  global: GlobalModelState;
  marketPage: MarketPageModelState;
}

function Discover({global, marketPage}: DiscoverProps) {
  const cRoute = global.routerHistories[global.routerHistories.length - 1];
  const isCurrent: boolean = cRoute.pathname.startsWith('/market');

  function onDiscoverClick(value: string) {
    // console.log(params, 'paramsparams');
    if (value === '1' && cRoute.pathname !== '/market') {
      return router.push(FUtil.LinkTo.market());
    } else if (value === '2') {
      // return router.push('/market/example');
      return window.open('https://f-presentations.freelog.com');
    }
  }

  return (<FDropdown
    overlay={<FMenu
      value={isCurrent ? marketPage.tabValue : ''}
      onClick={onDiscoverClick}
      options={discoverOptions}
    />}
  >
    <FNavLink
      // onClick={() => onDiscoverClick('1')}
      text={i18nMessage('explorer')}
      to={FUtil.LinkTo.market()}
      active={isCurrent}
    />
  </FDropdown>);
}

export default connect(({global, marketPage}: ConnectState) => ({
  global,
  marketPage,
}))(Discover);
