import * as React from 'react';
import {FTitleText} from '@/components/FText';
import styles from './index.less';
import {FTextButton} from '@/components/FButton';
import {FDown} from '@/components/FIcons';
import {Dispatch, connect} from 'dva';
import {ConnectState, MarketResourcePageState} from '@/models/connect';

interface DescriptionProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
}

function Description({dispatch, marketResourcePage}: DescriptionProps) {
  return (<div>
    <FTitleText text={'版本描述'} type={'h3'}/>
    <div style={{height: 20}}/>
    <div
      dangerouslySetInnerHTML={{__html: marketResourcePage.description}}
      className={styles.content + ' ' + styles.container}
    />
    <div className={styles.mask}/>
    <div className={styles.footer}>
      <FTextButton theme="primary">展开查看全部 <FDown/></FTextButton>
    </div>
  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(Description);
