import React from 'react';
import styles from './index.less';
import FLayout from '@/layouts/FLayout';
import {Button} from 'antd';
import FAffixTabs from '@/components/FAffixTabs';
import Finput from '@/components/Finput';
import FResourceCard from "@/components/FResourceCard";
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketPageModelState} from "@/models/connect";

const navs = [
  {
    id: 1,
    text: '资源市场',
  },
  {
    id: 2,
    text: '示例节点',
  },
];

const filters = ['全部类型', 'json', 'widget', 'image', 'audio', 'markdown', 'theme', 'reveal_slide', 'license', 'video', 'catalog'];

interface MarketProps {
  dispatch: Dispatch;
  market: MarketPageModelState,
}

function Market({dispatch, market}: MarketProps) {
  return (
    <FLayout>
      <FAffixTabs tabs={navs}/>
      <div style={{height: 30}}/>
      <div className={styles.filter}>
        <div>
          {
            filters.map((i: string, j: number) => (
              <a key={i} className={styles.filterTag + ' ' + (j === 0 ? styles.filterTagActive : '')}>{i}</a>))
          }
        </div>
        <Finput theme="dark" size="small" className={styles.filterInput}/>
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

      <div style={{height: 100}}/>
    </FLayout>
  );
}

export default connect(({marketPage}: ConnectState) => ({
  market: marketPage,
}))(Market);
