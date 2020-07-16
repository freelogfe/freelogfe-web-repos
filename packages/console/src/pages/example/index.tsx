import React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import FAffixTabs from '@/components/FAffixTabs';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketPageModelState} from "@/models/connect";
import {router} from 'umi';

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
}, ...['json', 'widget', 'image', 'audio', 'markdown', 'theme', 'reveal_slide', 'license', 'video', 'catalog'].map((i) => ({value: i}))];

interface MarketProps {
  dispatch: Dispatch;
  market: MarketPageModelState,
}

function Market({dispatch, market}: MarketProps) {

  function onChangeTab(value: '1' | '2') {
    if (value === '1') {
      return router.push('/market');
    }
  }

  return (
    <FCenterLayout>
      <FAffixTabs
        options={navs}
        value={'2'}
        // onChange={(value) => dispatch<OnChangeTabValueAction>({type: 'marketPage/onChangeTabValue', payload: value})}
        onChange={onChangeTab}
      />
      <div style={{height: 30}}/>


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
