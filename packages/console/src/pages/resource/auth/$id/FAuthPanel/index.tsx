import * as React from 'react';
import styles from './index.less';
import Resources from './Resources';
import Contracts from './Contracts';
import Policies from './Policies';
import { Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceAuthPageModelState } from '@/models/connect';
import { FContentText } from '@/components/FText';
import { FTextBtn } from '@/components/FButton';
import { FUtil } from '@freelog/tools-lib';

export interface FAuthPanelProps {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function FAuthPanel({ resourceAuthPage }: FAuthPanelProps) {

  // const activeResource = resourceAuthPage.contractsAuthorized.find((i) => i.activated);

  return (<div className={styles.DepPanel}>
    <div className={styles.DepPanelNavs}>
      <div>
        <Resources />
      </div>
    </div>
    <div className={styles.DepPanelContent}>
      <Space
        size={15}
        direction='vertical'
        className={styles.contentBox}
      >
        <Contracts />
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FContentText text={'查看已终止的合约请移至'} type='negative' />
            <FTextBtn onClick={() => {
              window.open(`${FUtil.Format.completeUrlByDomain('user')}${FUtil.LinkTo.contract()}`);
            }}>合约管理</FTextBtn>
          </div>
          <div style={{ height: 5 }} />
        </div>
        <Policies />
      </Space>
    </div>
  </div>);
}

export default connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage,
}))(FAuthPanel);
