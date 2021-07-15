import * as React from 'react';
import styles from './index.less';
import FMenu from "@/components/FMenu";
import FDropdown from "@/components/FDropdown";
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalModelState} from "@/models/connect";
import {router} from "umi";
import FNavLink from "@/layouts/FLayout/components/FNavLink";
import FUtil1 from "@/utils";
import {FUtil} from '@freelog/tools-lib';

const resourcesOptions = [
  {
    text: '我的资源',
    value: FUtil.LinkTo.myResources()
  },
  {
    text: '我的收藏',
    value: FUtil.LinkTo.myCollects(),
  },
];

interface ResourceProps {
  router: {
    location: Location;
  };
}

function Resource({router: routerObj}: ResourceProps) {
  // console.log(window.location.pathname, 'router!Q@#$!2342342134');
  // const cRoute = global.routerHistories[global.routerHistories.length - 1];
  const isCurrent: boolean = routerObj.location.pathname === '/resource/list' || routerObj.location.pathname === '/resource/collect';

  // function onClickResource(value: string) {
  //   console.log(value, 'value!@#$@#$');
  //   if (value === '1' && !cRoute.pathname.startsWith('/resource/list')) {
  //     return router.push(value);
  //   }
  //   if (value === '2' && !cRoute.pathname.startsWith('/resource/collect')) {
  //     return router.push(value);
  //   }
  // }

  return (<FDropdown
    overlay={<FMenu
      // value={cRoute.pathname.startsWith('/resource/list') ? '1' : cRoute.pathname.startsWith('/resource/collect') ? '2' : ''}
      value={window.location.pathname}
      onClick={(value) => {
        router.push(value);
      }}
      options={resourcesOptions}
    />}>
    <FNavLink
      to={FUtil.LinkTo.myResources()}
      active={isCurrent}
      text={FUtil1.I18n.message('resource_manage')}
    />
  </FDropdown>);
}

export default connect(({router}: ConnectState) => ({
  router,
}))(Resource);
