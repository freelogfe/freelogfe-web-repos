import * as React from 'react';
import styles from './index.less';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {FContentText, FTitleText} from '@/components/FText';
import {FFavorite} from '@/components/FIcons';
import {Dispatch, connect} from 'dva';
import {ConnectState, MarketResourcePageModelState, NodesModelState} from '@/models/connect';
import Contracts from './Contracts';
import Policies from './Policies';
import Resources from './Resources';
import NodeSelector from './NodeSelector';
import Bottom from './Bottom';
import * as cover from '@/assets/default-resource-cover.jpg';
import {OnClickCollectionAction} from '@/models/marketResourcePage';

interface SignProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
  nodes: NodesModelState;
}

function Sign({dispatch, marketResourcePage, nodes}: SignProps) {

  const resourceInfoLength: number = marketResourcePage.resourceInfo?.about.length || 0;

  return (<div className={styles.info}>
    <div className={styles.infoLeft}>
      <div>
        <img
          className={styles.cover}
          src={marketResourcePage.resourceInfo?.cover || cover}
          alt={''}
        />
        <div style={{height: 20}}/>
        <div className={styles.babels}>
          {
            (marketResourcePage.resourceInfo?.tags || []).filter((t, i) => i < 5).map((t) => (
              <label key={t}>{t}</label>))
          }
        </div>
        <div style={{height: 20}}/>
        <FContentText
          text={resourceInfoLength < 205 ? (marketResourcePage.resourceInfo?.about || '') : (marketResourcePage.resourceInfo?.about.substr(0, 205) + '...')}/>
      </div>
    </div>
    <div className={styles.cell}/>
    <div className={styles.infoRight}>
      <NodeSelector/>
      <div style={{height: 15}}/>
      <div className={styles.sign}>
        <div className={styles.signLeft}>
          <Resources/>
        </div>
        <div className={styles.signRight}>
          <Contracts/>
          <Policies/>
        </div>
      </div>
      <div style={{height: 15}}/>
      <Bottom/>
    </div>
  </div>);
}

export default connect(({marketResourcePage, nodes}: ConnectState) => ({
  marketResourcePage,
  nodes,
}))(Sign);
