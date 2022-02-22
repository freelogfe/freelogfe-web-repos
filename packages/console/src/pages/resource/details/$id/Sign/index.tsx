import * as React from 'react';
import styles from './index.less';
import { FContentText } from '@/components/FText';
import { Dispatch, connect } from 'dva';
import { ConnectState, MarketResourcePageModelState, NodesModelState } from '@/models/connect';
import Contracts from './Contracts';
import Policies from './Policies';
import Resources from './Resources';
import NodeSelector from './NodeSelector';
import Bottom from './Bottom';
import { Space, Tooltip } from 'antd';
import FCoverImage from '@/components/FCoverImage';
import { FWarning } from '@/components/FIcons';

interface SignProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
  nodes: NodesModelState;
}

function Sign({ dispatch, marketResourcePage, nodes }: SignProps) {

  const resourceInfoLength: number = marketResourcePage.resourceInfo?.about.length || 0;

  const resource = marketResourcePage.signResources.find((r) => r.selected);

  return (<div className={styles.info}>
    <div className={styles.infoLeft}>
      <div>
        <FCoverImage src={marketResourcePage.resourceInfo?.cover || ''} width={260} style={{ borderRadius: 10 }} />
        <div style={{ height: 20 }} />
        <div className={styles.babels}>
          {
            (marketResourcePage.resourceInfo?.tags || []).filter((t, i) => i < 5).map((t) => (
              <label key={t}>{t}</label>))
          }
        </div>
        <div style={{ height: 20 }} />

        <Tooltip
          title={marketResourcePage.resourceInfo?.about}
          mouseEnterDelay={3}
          overlayClassName={styles.TooltipOverlay}
          color={'rgba(0, 0, 0, 0.5)'}
          // visible={true}
          placement='right'
        >
          <div>
            <FContentText
              text={resourceInfoLength < 205 ? (marketResourcePage.resourceInfo?.about || '') : (marketResourcePage.resourceInfo?.about.substr(0, 205) + '...')} />
          </div>
        </Tooltip>
      </div>
    </div>
    <div className={styles.cell} />
    <div className={styles.infoRight}>
      <div className={styles.top}>
        <NodeSelector />
      </div>
      <div className={styles.mid}>
        <div className={styles.sign}>
          <div className={styles.signLeft}>
            <Resources />
          </div>
          <div className={styles.signRight}>
            {
              marketResourcePage.selectedNodeID === -1
                ? (<div className={styles.noNode}>
                  请先选择签约的节点…
                </div>)
                : (resource?.policies || []).length === 0 && (resource?.contracts || []).length === 0
                  ? (<div className={styles.noNode}>
                    无策略可用…
                  </div>)
                  : (<>
                    {
                      resource?.status === 1 && resource.authProblem && (<>
                        <div style={{ height: 15 }} />
                        <Space size={10}>
                          <FWarning style={{ fontSize: 20 }} />
                          <span style={{ fontSize: 16, color: '#C78D12' }}>该资源授权链异常，请谨慎签约。</span>
                        </Space>
                      </>)
                    }
                    <div style={{ height: 15 }} />
                    <Contracts />
                    <Policies />
                    <div style={{ height: 15 }} />
                  </>)
            }

          </div>
        </div>
      </div>
      <div className={styles.bot}>
        <Bottom />
      </div>

    </div>
  </div>);
}

export default connect(({ marketResourcePage, nodes }: ConnectState) => ({
  marketResourcePage,
  nodes,
}))(Sign);
