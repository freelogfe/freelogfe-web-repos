import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import Resources from './Resources';
import Contracts from './Contracts';
import Policies from './Policies';
import {Space} from "antd";
import {connect} from "dva";
import {ConnectState, ResourceAuthPageModelState} from "@/models/connect";

export interface FAuthPanelProps {
  resourceAuthPage: ResourceAuthPageModelState;
}

function FAuthPanel({resourceAuthPage}: FAuthPanelProps) {

  const activeResource = resourceAuthPage.contractsAuthorized.find((i) => i.activated);

  return (<div className={styles.DepPanel}>
    <div className={styles.DepPanelNavs}>
      <div>
        <Resources/>
      </div>
    </div>
    <div className={styles.DepPanelContent}>
      <Space
        size={25}
        direction="vertical"
        className={styles.contentBox}
      >

        {
          activeResource && activeResource?.contracts.length > 0 && (
            <Space direction="vertical" size={15} style={{width: '100%'}}>
              {/*<FContentText type="additional2" text={FUtil.I18n.message('used_contract')}/>*/}
              <FContentText type="additional2" text={'当前合约'}/>
              <Contracts dataSource={activeResource.contracts}/>
            </Space>)
        }

        {
          activeResource && activeResource?.policies?.length > 0 && (
            <Space direction="vertical" size={15} style={{width: '100%'}}>
              {/*<FContentText type="additional2" text={FUtil.I18n.message('other_authorization_plan')}/>*/}
              <FContentText type="additional2" text={'可签约的合约'}/>
              <Policies dataSource={activeResource.policies}/>
            </Space>)
        }
      </Space>
    </div>
  </div>);
}

export default connect(({resourceAuthPage}: ConnectState) => ({
  resourceAuthPage,
}))(FAuthPanel);
