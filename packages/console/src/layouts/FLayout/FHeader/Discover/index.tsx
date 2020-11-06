import * as React from 'react';
import styles from './index.less';
// import sharedStyles from '../index.less';
import FMenu from "@/components/FMenu";
import {i18nMessage} from "@/utils/i18n";
import FDropdown from "@/components/FDropdown";
import {router} from "umi";
import {connect, Dispatch, Router, RouterAPI} from 'dva';
import {ConnectState, GlobalModelState, MarketPageModelState, MarketResourcePageState} from "@/models/connect";
import Nav from "../../components/Nav";

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
      return router.push('/market');
    } else if (value === '2' && cRoute.pathname !== '/market/example') {
      return router.push('/market/example');
    }
  }

  return (<FDropdown overlay={<FMenu
    value={isCurrent ? marketPage.tabValue : ''}
    onClick={onDiscoverClick}
    options={discoverOptions}
  />}>
    <Nav
      onClick={() => onDiscoverClick('1')}
      active={isCurrent}
    >
      {i18nMessage('explorer')}
    </Nav>
  </FDropdown>);
}

export default connect(({global, marketPage}: ConnectState) => ({
  global,
  marketPage,
}))(Discover);
