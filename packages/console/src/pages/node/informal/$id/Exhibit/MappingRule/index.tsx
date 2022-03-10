import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { FContentText } from '@/components/FText';
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
  FMappingRuleVersion,
} from '@/components/FIcons';
import FPopover from '@/components/FPopover';
import TypesCaption from '../../components/TypesCaption';
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
  // VersionRule,
} from '../../components/MappingRules';
import FMappingRuleActive from '@/components/FIcons/FMappingRuleActive';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { OperationAndActionRecords } from '@/type/InformalNodeTypes';

interface ICandidate {
  name: string;
  versionRange?: string;
  type: 'resource' | 'object';
}

interface MappingRuleProps {
  operationAndActionRecords: OperationAndActionRecords;

  placement?: TooltipPlacement;
}

function MappingRule({
                       operationAndActionRecords = [],
                       placement = 'right',
                     }: MappingRuleProps) {

  if (operationAndActionRecords.length === 0) {
    return (<FLine />);
  }

  // console.log(attrs, 'attrs@#RFSADj89HJUIO:');

  return (<FPopover
    // visible={true}
    placement={placement}
    content={<Space
      className={styles.rules}
      direction='vertical'
      size={15}
    >
      {
        operationAndActionRecords.map((oaar, oaarIndex) => {

          if (oaar.type === 'add' && oaar.data.candidate) {
            return (<AddRule
              key={oaarIndex}
              exhibit={oaar.data.exhibitName}
              source={oaar.data.candidate}
            />);
          }

          if (oaar.type === 'alter') {
            return (<AlterRule key={oaarIndex} alter={oaar.data.exhibitName} />);
          }

          if (oaar.type === 'activate_theme') {
            return (<ActiveRule key={oaarIndex} active={oaar.data.exhibitName} />);
          }

          if (oaar.type === 'set_cover' && oaar.data.coverImage) {
            return (<CoverRule key={oaarIndex} cover={oaar.data.coverImage} />);
          }

          if (oaar.type === 'set_title' && oaar.data.title) {
            return (<TitleRule key={oaarIndex} title={oaar.data.title} />);
          }

          if (oaar.type === 'set_labels' && oaar.data.tags) {
            return (<LabelRule key={oaarIndex} labels={oaar.data.tags} />);
          }

          if (oaar.type === 'online') {
            return oaar.data.onlineStatus
              ? (<OnlineRule key={oaarIndex} online={true} />)
              : (<OfflineRule key={oaarIndex} offline={true} />);
          }

          if (oaar.type === 'replace' && oaar.data.replacer && oaar.data.replaced) {
            return (<ReplaceRule
              key={oaarIndex}
              replacer={oaar.data.replacer}
              replaced={oaar.data.replaced}
              scopes={[]}
            />);
          }

          if (oaar.type === 'add_attr' && oaar.data.attrKey && oaar.data.attrValue) {
            return (<AttrRule
              key={oaarIndex}
              type={'add'}
              theKey={oaar.data.attrKey || ''}
              value={oaar.data.attrValue || ''}
              description={oaar.data.attrDescription || ''}
            />);
          }

          if (oaar.type === 'delete_attr' && oaar.data.attrKey) {
            return (<AttrRule
              key={oaarIndex}
              type={'delete'}
              theKey={oaar.data.attrKey}
            />);
          }

          return null;
        })
      }

    </Space>}
    title={<div className={styles.popoverTitle}>
      <FContentText
        type='highlight'
        text={'映射规则'}
      />
      <TypesCaption />
    </div>}
  >
    <Space size={16}>
      {
        operationAndActionRecords.map((oaar, oaarIndex) => {
          if (oaar.type === 'add') {
            return (<FMappingRuleAdd key={oaarIndex} />);
          }
          if (oaar.type === 'alter') {
            return (<FEdit key={oaarIndex} />);
          }
          if (oaar.type === 'activate_theme') {
            return (<FMappingRuleActive key={oaarIndex} />);
          }
          if (oaar.type === 'set_cover') {
            return (<FMappingRuleCover key={oaarIndex} />);
          }
          if (oaar.type === 'set_title') {
            return (<FMappingRuleTitle key={oaarIndex} />);
          }
          if (oaar.type === 'set_labels') {
            return (<FMappingRuleLabel key={oaarIndex} />);
          }
          if (oaar.type === 'online') {
            return oaar.data.onlineStatus
              ? (<FMappingRuleOnline key={oaarIndex} />)
              : (<FMappingRuleOffline key={oaarIndex} />);
          }

          if (oaar.type === 'add_attr' || oaar.type === 'delete_attr') {
            return (<FMappingRuleAttr key={oaarIndex} />);
          }

          if (oaar.type === 'replace') {
            return (<FMappingRuleReplace key={oaarIndex} />);
          }
          return null;
        })
      }

    </Space>
  </FPopover>);
}

export default MappingRule;


