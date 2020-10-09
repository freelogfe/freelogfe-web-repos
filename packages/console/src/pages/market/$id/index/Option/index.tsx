import * as React from 'react';
import {FTitleText, FContentText} from '@/components/FText';
import styles from './index.less';
import {Space} from 'antd';
import {FInfo} from '@/components/FIcons';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketResourcePageState} from '@/models/connect';

interface OptionProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
}

function Option({dispatch, marketResourcePage}: OptionProps) {
  return (<div>
    <FTitleText text={'自定义选项'} type="h3"/>
    <div style={{height: 20}}/>
    <div className={styles.content}>
      {
        marketResourcePage.options.map((i) => (<div key={i.key}>
          <Space size={10}>
            <FContentText text={i.key}/>
            <FInfo/>
          </Space>
        </div>))
      }
    </div>
  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(Option);
