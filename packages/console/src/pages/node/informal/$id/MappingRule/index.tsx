import * as React from 'react';
import styles from './index.less';
import {FTitleText} from "@/components/FText";
import {Space} from "antd";
import {FImport, FExport, FDelete, FCode, FWarning} from "@/components/FIcons";
import TypesCaption from "../components/TypesCaption";
import {
  AttrRule,
  VersionRule,
  TitleRule,
  ReplaceRule,
  OnlineRule,
  OfflineRule,
  LabelRule,
  CoverRule,
  AlterRule,
  AddRule
} from "../components/MappingRules";

interface MappingRuleProps {

}

function MappingRule({}: MappingRuleProps) {
  return (<>
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <FTitleText text={'展品管理'}/>
        <div style={{width: 10}}/>
        <TypesCaption/>
        <div style={{width: 50}}/>
        <Space size={30}>
          <a><FImport/> <span>导入</span></a>
          <a><FExport/> <span>导入</span></a>
          <a style={{}}><FDelete/> <span>删除</span></a>
        </Space>
      </div>

      <a><FCode/> 进入代码模式</a>
    </div>

    <div className={styles.body}>
      <Space className={styles.ruleList} direction="vertical">
        <div className={styles.ruleCard}>
          <div className={styles.ruleCardHeader}>
            <AddRule/>
            <FWarning/>
          </div>
          <div className={styles.ruleCardBody}>
            <Space className={styles.ruleCardBodyList} size={15} direction="vertical">
              <div className={styles.ruleCardBodyListItem}>
                <ReplaceRule/>
                <FWarning/>
              </div>
            </Space>
          </div>
        </div>
      </Space>
    </div>
  </>);
}

export default MappingRule;
