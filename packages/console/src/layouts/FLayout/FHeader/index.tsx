import * as React from 'react';
import styles from './index.less';
import Discover from "@/layouts/FLayout/FHeader/Discover";
import Storage from "@/layouts/FLayout/FHeader/Storage";
import Resource from "@/layouts/FLayout/FHeader/Resource";
import Node from "@/layouts/FLayout/FHeader/Node";
import Search from "@/layouts/FLayout/FHeader/Search";
import Create from "@/layouts/FLayout/FHeader/Create";
import User from "@/layouts/FLayout/FHeader/User";
import {} from "antd";
import {router, NavLink} from "umi";
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalModelState} from "@/models/connect";
import {market} from "@/utils/path-assembler";


interface FHeaderProps {
  global: GlobalModelState;
}

function FHeader({global}: FHeaderProps) {

  function onDiscoverClick(value: string) {
    // console.log(params, 'paramsparams');
    if (value === '1' && global.routerHistories[global.routerHistories.length - 1].pathname !== '/market') {
      return router.push(market());
    }
    if (value === '2' && !global.routerHistories[global.routerHistories.length - 1].pathname.startsWith('/example')) {
      return router.push('/example');
    }
  }

  return (<>
    <div className={styles.headerLeft}>
      <NavLink
        // onClick={() => onDiscoverClick('1')}
        to={market()}
        className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')}
      />
      <div className={styles.MenuBar}>

        <Discover/>

        <Storage/>

        <Resource/>

        <Node/>

      </div>
    </div>

    <div className={styles.headerRight}>

      <Search/>

      <Create/>

      <User/>
    </div>
  </>);
}

export default connect(({global}: ConnectState) => ({
  global,
}))(FHeader);
