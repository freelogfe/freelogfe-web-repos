import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import {Dispatch, connect} from 'dva';
import {ConnectState, MarketResourcePageModelState, NodesModelState} from '@/models/connect';
import Contracts from './Contracts';
import Policies from './Policies';
import Resources from './Resources';
import NodeSelector from './NodeSelector';
import Bottom from './Bottom';
import * as cover from '@/assets/default-resource-cover.jpg';
import {Tooltip} from 'antd';

interface SignProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
  nodes: NodesModelState;
}

function Sign({dispatch, marketResourcePage, nodes}: SignProps) {

  const resourceInfoLength: number = marketResourcePage.resourceInfo?.about.length || 0;

  const contracts = marketResourcePage.signResources.find((r) => r.selected)?.contracts;
  const policies = marketResourcePage.signResources.find((r) => r.selected)?.policies;

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

        <Tooltip
          title={marketResourcePage.resourceInfo?.about}
          mouseEnterDelay={3}
          overlayClassName={styles.TooltipOverlay}
          color={'rgba(0, 0, 0, 0.5)'}
          // visible={true}
          placement="right"
        >
          <div>
            <FContentText
              text={resourceInfoLength < 205 ? (marketResourcePage.resourceInfo?.about || '') : (marketResourcePage.resourceInfo?.about.substr(0, 205) + '...')}/>
          </div>
        </Tooltip>
      </div>
    </div>
    <div className={styles.cell}/>
    <div className={styles.infoRight}>
      <div className={styles.top}>
        <NodeSelector/>
      </div>
      <div className={styles.mid}>
        <div className={styles.sign}>
          <div className={styles.signLeft}>
            <Resources/>
          </div>
          <div className={styles.signRight}>
            {
              marketResourcePage.selectedNodeID === -1
                ? (<div className={styles.noNode}>
                  请先选择签约的节点…
                </div>)
                : policies?.length === 0 && contracts?.length === 0
                ? (<div className={styles.noNode}>
                  无策略可用…
                </div>)
                : (<>
                  <div style={{height: 15}}/>
                  <Contracts/>
                  <Policies/>
                  <div style={{height: 15}}/>
                </>)
            }

          </div>
        </div>
      </div>
      <div className={styles.bot}>
        <Bottom/>
      </div>

    </div>
  </div>);
}

export default connect(({marketResourcePage, nodes}: ConnectState) => ({
  marketResourcePage,
  nodes,
}))(Sign);
