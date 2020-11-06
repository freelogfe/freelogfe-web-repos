import React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import FAffixTabs from '@/components/FAffixTabs';
import {router, withRouter} from 'umi';
import Resources from "./Resources";
import Examples from "@/pages/market/Examples";
import {RouteComponentProps} from "react-router";
import {connect, Dispatch} from "dva";
import {ChangeAction as GlobalChangeAction} from "@/models/global";
import {ChangeAction} from "@/models/marketPage";
import FLayoutFooter from "@/layouts/FLayoutFooter";
import {ConnectState, MarketPageModelState} from "@/models/connect";

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


interface MarketProps extends RouteComponentProps {
  dispatch: Dispatch;
  route: any;

  marketPage: MarketPageModelState;
}

function Market({dispatch, match, history, location, route, marketPage, ...props}: MarketProps) {

  // 路由更新路由匹配信息
  React.useEffect(() => {
    dispatch<GlobalChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'marketPage/change',
      payload: {
        tabValue: match.path === '/market' ? '1' : '2',
      },
    })
  }, [match.path]);

  function onChangeTab(value: '1' | '2') {
    if (value === '1' && marketPage.tabValue !== '1') {
      return router.push('/market');
    }
    if (value === '2' && marketPage.tabValue !== '2') {
      return router.push('/market/example');
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
  </>);
}


export default withRouter(connect(({marketPage}: ConnectState) => ({
  marketPage,
}))(Market));

