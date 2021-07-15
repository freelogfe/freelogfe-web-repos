import React from 'react';
import styles from './index.less';
import FAffixTabs from '@/components/FAffixTabs';
import {withRouter} from 'umi';
import Resources from "./Resources";
import Examples from "@/pages/market/Examples";
import {connect, Dispatch} from "dva";
import {
  OnMountPageAction,
  OnUnmountPageAction,
} from "@/models/marketPage";
import {ConnectState, MarketPageModelState} from "@/models/connect";
import FFooter from '@/layouts/FFooter';
import FCenterLayout from "@/layouts/FCenterLayout";
import * as AHooks from 'ahooks';

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

  marketPage: MarketPageModelState;
}

function Market({dispatch, marketPage, ...props}: MarketProps) {

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'marketPage/onMountPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'marketPage/onUnmountPage',
    });
  });


  // React.useEffect(() => {
  //   // console.log('@#WERF09ujiojlFetchDataSourceAction');
  //   dispatch<FetchDataSourceAction>({
  //     type: 'marketPage/fetchDataSource',
  //     payload: true,
  //   });
  // }, []);

  function onChangeTab(value: '1' | '2') {
    // if (value === '1' && marketPage.tabValue !== '1') {
    // }

    if (value === '2' && marketPage.tabValue !== '2') {
      return window.open('https://f-presentations.freelog.com');
    }
  }

  return (<>
    <FCenterLayout>
      <FAffixTabs
        options={navs}
        value={marketPage.tabValue}
        // onChange={(value) => dispatch<OnChangeTabValueAction>({type: 'marketPage/onChangeTabValue', payload: value})}
        onChange={onChangeTab}
      />
      {marketPage.tabValue === '1' && <Resources/>}
      {marketPage.tabValue === '2' && <Examples/>}
    </FCenterLayout>
    {/*<FLayoutFooter/>*/}
    <FFooter/>
  </>);
}

export default withRouter(connect(({marketPage}: ConnectState) => ({
  marketPage,
}))(Market));

