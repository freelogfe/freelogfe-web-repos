import * as React from 'react';
import styles from './index.less';
import {router, withRouter} from "umi";
import FCopyToClipboard from "@/components/FCopyToClipboard";
import {FTitleText, FContentText} from '@/components/FText';
import {Popconfirm, Space} from "antd";
import FInput from "@/components/FInput";
import FTable from "@/components/FTable";
import {FTextButton} from "@/components/FButton";
import {FDelete, FEdit, FFileSearch, FWarning} from "@/components/FIcons";
import FSwitch from "@/components/FSwitch";
import FTooltip from "@/components/FTooltip";
import FMappingRuleAdd from "@/components/FIcons/FMappingRuleAdd";
import FMappingRuleAttr from "@/components/FIcons/FMappingRuleAttr";
import FMappingRuleCover from "@/components/FIcons/FMappingRuleCover";
import FMappingRuleLabel from "@/components/FIcons/FMappingRuleLabel";
import FMappingRuleOffline from "@/components/FIcons/FMappingRuleOffline";
import FMappingRuleOnline from "@/components/FIcons/FMappingRuleOnline";
import FMappingRuleReplace from "@/components/FIcons/FMappingRuleReplace";
import FMappingRuleTitle from "@/components/FIcons/FMappingRuleTitle";
import FMappingRuleVersion from "@/components/FIcons/FMappingRuleVersion";
import FNoDataTip from "@/components/FNoDataTip";
import Sider from './Sider';
import Exhibit from './Exhibit';
import {nodeManagement} from "@/utils/path-assembler";

interface InformalNodeProps {
  match: {
    params: {
      id: string;
    }
  }
}


function InformalNode({match}: InformalNodeProps) {

  return (<div>
    <div className={styles.headerTip}>这里是测试节点管理页面，如需管理正式节点，你可以 <a onClick={() => {
      // router.push(`/node/${match.params.id}/formal`);
      router.push(nodeManagement({nodeID: Number(match.params.id)}));
    }}>进入正式节点</a></div>
    <div style={{height: 24}}/>
    <div style={{minHeight: 'calc(100vh - 94px)'}} className={styles.container}>

      <div className={styles.sider}>
        <Sider/>
      </div>

      <div className={styles.content}>
        <Exhibit/>
      </div>
    </div>
  </div>);
}

export default withRouter(InformalNode);
