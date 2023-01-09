import * as React from 'react';
import styles from './index.less';
import Resources from './Resources';
import Contracts from './Contracts';
import Policies from './Policies';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceAuthPageModelState } from '@/models/connect';
import FComponentsLib from '@freelog/components-lib';
import fViewTerminatedContracts from '@/components/fViewTerminatedContracts';

export interface FAuthPanelProps {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function FAuthPanel({ resourceAuthPage }: FAuthPanelProps) {

  const activeResource = resourceAuthPage.contractsAuthorized.find((i) => i.activated);

  return (<div className={styles.DepPanel}>
    <div className={styles.DepPanelNavs}>
      <div>
        <Resources />
      </div>
    </div>
    <div className={styles.DepPanelContent}>
      <div className={styles.contentBox}>
        <Contracts />

        {
          activeResource && activeResource.terminatedContractIDs.length > 0 && (<>
            <div style={{ height: 15 }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/*<FContentText text={'查看已终止的合约请移至'} type='negative' />*/}
                <FComponentsLib.FTextBtn onClick={async () => {
                  // window.open(`${FUtil.Format.completeUrlByDomain('user')}${FUtil.LinkTo.contract()}`);
                  // set_TerminatedContractIDs(activeResource.terminatedContractIDs);
                  await fViewTerminatedContracts({
                    terminatedContractIDs: activeResource.terminatedContractIDs,
                  });
                }}>查看已终止合约</FComponentsLib.FTextBtn>
              </div>
            </div>
          </>)
        }

        <div style={{ height: 25 }} />

        <Policies />
      </div>
    </div>
  </div>);
}

export default connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage,
}))(FAuthPanel);
