import React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import {Button} from 'antd';
import FAffixTabs from '@/components/FAffixTabs';
import FInput from '@/components/FInput';
import FResourceCard from "@/components/FResourceCard";
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketPageModelState} from "@/models/connect";
import {OnChangeInputTextAction, OnChangeResourceTypeAction, OnChangeTabValueAction} from "@/models/marketPage";
import {router} from 'umi';
import {resourceTypes} from "@/utils/globals";
import Resources from "./Resources";
import Examples from "@/pages/market/Examples";

const navs = [
  {
    value: '1',
    text: '资源市场',
  },
  {
    value: '2',
    text: '示例节点',
  },
];


interface MarketProps {
  dispatch: Dispatch;
  market: MarketPageModelState,
}

function Market({dispatch, market}: MarketProps) {

  function onChangeTab(value: '1' | '2') {
    if (value === '1' && market.tabValue !== '1') {
      return router.push('/market');
    }
    if (value === '2' && market.tabValue !== '2') {
      return router.push('/example');
    }
  }

  return (
    <FCenterLayout>
      <FAffixTabs
        options={navs}
        value={market.tabValue}
        // onChange={(value) => dispatch<OnChangeTabValueAction>({type: 'marketPage/onChangeTabValue', payload: value})}
        onChange={onChangeTab}
      />
      {market.tabValue === '1' && <Resources/>}
      {market.tabValue === '2' && <Examples/>}

    </FCenterLayout>
  );
}

export default connect(({marketPage}: ConnectState) => ({
  market: marketPage,
}))(Market);

