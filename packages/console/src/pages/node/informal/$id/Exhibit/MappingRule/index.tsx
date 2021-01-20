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

      <div className={styles.popoverTitleTip}>
        <div style={{width: 5}}/>
        <FContentText text={'('} type="additional2"/>
        <div style={{width: 5}}/>
        <i className={styles.exhibitDot}/>
        <div style={{width: 5}}/>
        <FContentText text={'展品'} type="additional2"/>
        <div style={{width: 15}}/>
        <i className={styles.resourceDot}/>
        <div style={{width: 5}}/>
        <FContentText text={'资源'} type="additional2"/>
        <div style={{width: 15}}/>
        <i className={styles.objectDot}/>
        <div style={{width: 5}}/>
        <FContentText text={'对象'} type="additional2"/>
        <div style={{width: 5}}/>
        <FContentText text={')'} type="additional2"/>
      </div>
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

interface AddRuleProps {
  exhibitName: string;
  source: { name: string; type: 'resource' | 'object' };
}

function AddRule({}) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleAdd/></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'新增'}/></div>
      <div><label className={styles.exhibitLabel}>freelog白皮书</label></div>
      <div><FContentText text={'，来源'}/></div>
      <div><label className={styles.resourceLabel}>Stefan/freelog白皮书</label></div>
    </div>
  </div>);
}

function AlterRule({}) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FEdit/></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'修改'}/></div>
      <div><label className={styles.exhibitLabel}>freelog白皮书</label></div>
    </div>
  </div>);
}

function VersionRule({}) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleVersion/></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'展示版本'}/></div>
      <div><FTitleText type="h5" text={'1.0.0'}/></div>
    </div>
  </div>);
}

function LabelRule({}) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleLabel/></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'设置标签'}/></div>
      <div><FTitleText type="h5" text={'tag1，tag2，tag3'}/></div>
    </div>
  </div>);
}

function CoverRule({}) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleCover/></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'设置封面'}/></div>
      <div><FTitleText type="h5" text={'http://www.freelog.com'}/></div>
    </div>
  </div>);
}

function TitleRule({}) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleTitle/></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'设置标题'}/></div>
      <div><FTitleText type="h5" text={'标题1'}/></div>
    </div>
  </div>);
}

function OnlineRule({}) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleOnline/></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'展品状态'}/></div>
      <div><FTitleText type="h5" text={'上线'}/></div>
    </div>
  </div>);
}

function OfflineRule({}) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleOffline/></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'展品状态'}/></div>
      <div><FTitleText type="h5" text={'下线'}/></div>
    </div>
  </div>);
}

function AttrRule({}) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleAttr/></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'设置属性'}/></div>
      <div><FContentText text={'键'}/></div>
      <div><FTitleText type="h5" text={'key1'}/></div>
      <div><FContentText text={'值'}/></div>
      <div><FTitleText type="h5" text={'value1'}/></div>
      <div><FContentText text={'描述'}/></div>
      <div><FTitleText type="h5" text={'description1'}/></div>
    </div>
  </div>);
}

function ReplaceRule({}) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleReplace/></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'替换'}/></div>
      <div><label className={styles.exhibitLabel}>Stefan/freelog平台设计规范目录</label></div>
      <div><FContentText text={'为'}/></div>
      <div><label className={styles.objectLabel}>bucket_2/freelog平台设计规范目录</label></div>
      <div><FContentText text={'，作用域'}/></div>
      <div><label className={styles.resourceLabel}>user_2/release_2</label></div>
      <div><FContentText text={'-'}/></div>
      <div><label className={styles.resourceLabel}>user_3/release_3 (2.0.0)</label></div>
    </div>
  </div>);
}


