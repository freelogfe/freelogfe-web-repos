import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import Resources from './Resources';
import Contracts from './Contracts';
import Policies from './Policies';
import FUtil from "@/utils";
import {Space} from "antd";

export interface FAuthPanelProps {
  dataSource: {
    id: string | number;
    activated: boolean;
    title: string;
    resourceType: string;
    version: string;
    contracts: {
      checked: boolean;
      title: string;
      status: string;
      code: string;
      id: string;
      date: string;
      policyId: string;
      versions: { version: string; checked: boolean; disabled: boolean }[];
    }[];
    policies: {
      id: string;
      title: string;
      code: string;
      allEnabledVersions: string[];
    }[];
  }[];

  onChangeActivatedResource?(dataSource: FAuthPanelProps['dataSource']): void;
}

function FAuthPanel({dataSource, onChangeActivatedResource}: FAuthPanelProps) {

  const [activeResource, setActiveResource] = React.useState<FAuthPanelProps['dataSource'][0] | null>(null);

  React.useEffect(() => {
    const resource = dataSource.find((i) => i.activated);
    setActiveResource(resource || null);
  }, [dataSource]);

  // function onChangeActivated(id: number | string) {
  //   onChangeActivatedResource && onChangeActivatedResource(dataSource.map((i) => ({
  //     ...i,
  //     activated: i.id === id,
  //   })));
  // }

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
        // id={'DepPanelContent'}
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

export default FAuthPanel;
