import * as React from 'react';
import styles from './index.less';
import sharedStyles from '../index.less';
import FMenu from "@/components/FMenu";
import {i18nMessage} from "@/utils/i18n";
import FDropdown from "@/components/FDropdown";
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalModelState} from "@/models/connect";
import {router} from "umi";
import Nav from "../components/Nav";

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
  const isCurrent: boolean = cRoute.pathname.startsWith('/resource');

  function onClickResource(value: string) {
    if (value === '1' && !cRoute.pathname.startsWith('/resource/list')) {
      return router.push('/resource/list');
    }
    if (value === '2' && !cRoute.pathname.startsWith('/resource/collect')) {
      return router.push('/resource/collect');
    }
  }

  return (<FDropdown
    overlay={<FMenu
      value={cRoute.pathname.startsWith('/resource/list') ? '1' : cRoute.pathname.startsWith('/resource/collect') ? '2' : ''}
      onClick={onClickResource}
      options={resourcesOptions}
    />}>
    <Nav
      onClick={() => onClickResource('1')}
      active={isCurrent}>{i18nMessage('resource_manage')}</Nav>
  </FDropdown>);
}

export default connect(({global}: ConnectState) => ({
  global
}))(Resource);
