import * as React from 'react';
import styles from './index.less';
import {FNormalButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketResourcePageState} from '@/models/connect';
import {router} from 'umi';

interface BottomProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
}

function Bottom({dispatch, marketResourcePage}: BottomProps) {
  return (<div className={styles.signBottom}>
    <FNormalButton
      className={styles.signButton}
      disabled={!marketResourcePage.selectedNodeDomain}
      onClick={() => router.push(`/resource/${marketResourcePage.resourceId}/sign`)}
    >签约</FNormalButton>
    {/*<span>该资源已签约，可进入<a>展品管理</a>进行授权管理</span>*/}
  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(Bottom);
