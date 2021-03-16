import * as React from 'react';
import {FTitleText, FContentText} from '@/components/FText';
import styles from './index.less';
import {Space, Tooltip} from 'antd';
import {FInfo} from '@/components/FIcons';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketResourcePageModelState} from '@/models/connect';
import FTooltip from "@/components/FTooltip";

interface OptionProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
}

function Option({dispatch, marketResourcePage}: OptionProps) {

  if (marketResourcePage.options.length === 0) {
    return null;
  }

  return (<>
    <div style={{height: 30}}/>
    <div>
      <FTitleText text={'自定义选项'} type="h4"/>
      <div style={{height: 20}}/>
      <div className={styles.content}>
        {
          marketResourcePage.options.map((i) => (<div key={i.key}>
            <Space size={10}>
              <FContentText text={i.key}/>
              <FTooltip
                title={i.description}
                color={'#fff'}><FInfo/></FTooltip>
            </Space>
          </div>))
        }
      </div>
    </div>
    <div style={{height: 20}}/>
  </>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(Option);
