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

        <Policies />
      </Space>
    </div>
  </div>);
}

export default connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage,
}))(FAuthPanel);
