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
  ActiveRule,
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
import FMappingRuleActive from "@/components/FIcons/FMappingRuleActive";

interface MappingRuleProps {
  add?: {
    exhibit: string;
    source: {
      type: 'resource' | 'object';
      name: string;
    };
  };
  alter?: string;
  active?: string;
  version?: string;
  cover?: string;
  title?: string;
  online?: boolean;
  offline?: boolean;
  labels?: string[];
  replaces?: {
    replacer: {
      type: 'resource' | 'object';
      name: string;
    };
    replaced: string;
    scope: string[][];
  }[];
  attrs?: {
    type: 'add' | 'delete',
    theKey: string;
    value?: string;
    description?: string;
  }[];
}

function MappingRule({
                       add, alter, active,
                       version, cover, title, offline, online, labels, replaces, attrs
                     }: MappingRuleProps) {

  if (!(add || alter || active)) {
    return (<FLine/>);
  }

  // console.log(attrs, 'attrs@#RFSADj89HJUIO:');

  return (<FPopover
    // visible={true}
    content={<Space
      className={styles.rules}
      direction="vertical"
      size={15}
    >
      {add && <AddRule  {...add}/>}
      {alter && <AlterRule alter={alter}/>}
      {active && <ActiveRule active={active}/>}
      {version && <VersionRule version={version}/>}
      {cover && <CoverRule cover={cover}/>}
      {title && <TitleRule title={title}/>}
      {labels && <LabelRule labels={labels}/>}
      {online && <OnlineRule online={online}/>}
      {offline && <OfflineRule offline={offline}/>}
      {replaces && replaces.map((replace, replaceIndex) => {
        return (<ReplaceRule key={replaceIndex} {...replace}/>);
      })}
      {attrs && attrs.map((attr, attrIndex) => {
        return (<AttrRule key={attrIndex} {...attr}/>);
      })}
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
      {add && <FMappingRuleAdd/>}
      {alter && <FEdit/>}
      {active && <FMappingRuleActive/>}
      {attrs && <FMappingRuleAttr/>}
      {cover && <FMappingRuleCover/>}
      {labels && <FMappingRuleLabel/>}
      {offline && <FMappingRuleOffline/>}
      {online && <FMappingRuleOnline/>}
      {replaces && <FMappingRuleReplace/>}
      {title && <FMappingRuleTitle/>}
      {version && <FMappingRuleVersion/>}
    </Space>
  </FPopover>);
}

export default MappingRule;


