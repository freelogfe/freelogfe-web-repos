import * as React from 'react';
import styles from './index.less';
import {Space} from "antd";
import {FContentText, FTitleText} from "@/components/FText";
import {
  FEdit, FLine,
  FMappingRuleAdd,
  FMappingRuleAttr,
  FMappingRuleCover,
  FMappingRuleLabel,
  FMappingRuleOffline,
  FMappingRuleOnline,
  FMappingRuleReplace,
  FMappingRuleTitle,
  FMappingRuleVersion
} from "@/components/FIcons";
import FPopover from "@/components/FPopover";
import TypesCaption from "../../components/TypesCaption";
import {
  AddRule,
  AlterRule,
  AttrRule,
  CoverRule,
  LabelRule,
  OfflineRule,
  OnlineRule,
  ReplaceRule,
  TitleRule,
  VersionRule
} from "../../components/MappingRules";

interface MappingRuleProps {

}

function MappingRule({}: MappingRuleProps) {

  if (false) {
    return (<FLine/>);
  }

  return (<FPopover
    // visible={true}
    content={<Space
      className={styles.rules}
      direction="vertical"
      size={15}
    >
      <AddRule/>
      <AlterRule/>
      <VersionRule/>
      <CoverRule/>
      <TitleRule/>
      <LabelRule/>
      <OnlineRule/>
      <OfflineRule/>
      <ReplaceRule/>
      <AttrRule/>
    </Space>}
    title={<div className={styles.popoverTitle}>
      <FTitleText
        type="h5"
        text={'映射规则'}
      />
      <TypesCaption/>
    </div>}
  >
    <Space size={16}>
      <FMappingRuleAdd/>
      <FEdit/>
      <FMappingRuleAttr/>
      <FMappingRuleCover/>
      <FMappingRuleLabel/>
      <FMappingRuleOffline/>
      <FMappingRuleOnline/>
      <FMappingRuleReplace/>
      <FMappingRuleTitle/>
      <FMappingRuleVersion/>
    </Space>
  </FPopover>);
}

export default MappingRule;


