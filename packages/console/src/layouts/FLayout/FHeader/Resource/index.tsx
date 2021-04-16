import * as React from 'react';
import styles from './index.less';
import FMenu from "@/components/FMenu";
// import {i18nMessage} from "@/utils/i18n";
import FDropdown from "@/components/FDropdown";
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalModelState} from "@/models/connect";
import {router} from "umi";
// import {myResources} from "@/utils/path-assembler";
import FNavLink from "@/layouts/FLayout/components/FNavLink";
import FUtil from "@/utils";

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

interface ResourceProps {
  global: GlobalModelState;
}

function Resource({global}: ResourceProps) {

  const cRoute = global.routerHistories[global.routerHistories.length - 1];
  const isCurrent: boolean = cRoute.pathname === '/resource/list' || cRoute.pathname === '/resource/collect';

  function onClickResource(value: string) {
    if (value === '1' && !cRoute.pathname.startsWith('/resource/list')) {
      return router.push(FUtil.LinkTo.myResources());
    }
    if (value === '2' && !cRoute.pathname.startsWith('/resource/collect')) {
      return router.push(FUtil.LinkTo.myCollects());
    }
  }

  return (<FDropdown
    overlay={<FMenu
      value={cRoute.pathname.startsWith('/resource/list') ? '1' : cRoute.pathname.startsWith('/resource/collect') ? '2' : ''}
      onClick={onClickResource}
      options={resourcesOptions}
    />}>
    <FNavLink
      to={FUtil.LinkTo.myResources()}
      active={isCurrent}
      text={FUtil.I18n.message('resource_manage')}
    />
  </FDropdown>);
}

export default connect(({global}: ConnectState) => ({
  global
}))(Resource);
