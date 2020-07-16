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

const filters = [{
  value: -1,
  text: '全部类型'
}, ...resourceTypes.map((i) => ({value: i}))];

interface MarketProps {
  dispatch: Dispatch;
  market: MarketPageModelState,
}

function Market({dispatch, market}: MarketProps) {

  function onChangeTab(value: '1' | '2') {
    if (value === '2') {
      return router.push('/example');
    }
  }

  return (
    <FCenterLayout>
      <FAffixTabs
        options={navs}
        value={'1'}
        // onChange={(value) => dispatch<OnChangeTabValueAction>({type: 'marketPage/onChangeTabValue', payload: value})}
        onChange={onChangeTab}
      />
      <div style={{height: 30}}/>
      <div className={styles.filter}>
        <Labels
          options={filters}
          value={market.resourceType}
          onChange={(value) => dispatch<OnChangeResourceTypeAction>({
            type: 'marketPage/onChangeResourceType',
            payload: value,
          })}
        />
        <FInput
          value={market.inputText}
          onChange={(e) => dispatch<OnChangeInputTextAction>({
            type: 'marketPage/onChangeInputText',
            payload: e.target.value
          })}
          theme="dark"
          size="small"
          className={styles.filterInput}
        />
      </div>

      <div style={{height: 30}}/>

      <div className={styles.Content}>
        {
          market.dataSource.map((resource: any) => (
            <FResourceCard key={resource.id} resource={resource} className={styles.FResourceCard}/>))
        }

        <div className={styles.bottomPadding}/>
        <div className={styles.bottomPadding}/>
        <div className={styles.bottomPadding}/>
        <div className={styles.bottomPadding}/>
      </div>

      <div style={{height: 100}}/>

      <div className={styles.bottom}>
        <Button className={styles.loadMore}>加载更多</Button>
      </div>

      {/*<div style={{height: 100}}/>*/}
    </FCenterLayout>
  );
}

export default connect(({marketPage}: ConnectState) => ({
  market: marketPage,
}))(Market);

interface Labels {
  options: {
    value: string | number;
    text?: string | number;
  }[];
  value: string | number;
  onChange?: (value: string | number) => void;
}

function Labels({options, value, onChange}: Labels) {
  return (<div>
    {
      options.map((i, j) => (
        <a key={i.value}
           className={styles.filterTag + ' ' + (i.value === value ? styles.filterTagActive : '')}
           onClick={() => onChange && onChange(i.value)}
        >{i.text || i.value}</a>))
    }
  </div>)
}
