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
  VersionRule,
} from '../../components/MappingRules';
import FMappingRuleActive from '@/components/FIcons/FMappingRuleActive';
import { TooltipPlacement } from 'antd/lib/tooltip';

interface ICandidate {
  name: string;
  versionRange?: string;
  type: 'resource' | 'object';
}

interface MappingRuleProps {
  add?: {
    exhibit: string;
    source: {
      type: 'resource' | 'object';
      name: string;
      versionRange?: string;
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
    replaced: ICandidate;
    replacer: ICandidate;
    scopes?: ICandidate[][];
  }[];
  attrs?: {
    type: 'add' | 'delete',
    theKey: string;
    value?: string;
    description?: string;
  }[];

  placement?: TooltipPlacement;
}

function MappingRule({
                       add, alter, active,
                       version, cover, title, offline, online, labels, replaces, attrs,
                       placement = 'right',
                     }: MappingRuleProps) {

  if (!(add || alter || active)) {
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
      {add && <AddRule {...add} />}
      {alter && <AlterRule alter={alter} />}
      {active && <ActiveRule active={active} />}
      {version && <VersionRule version={version} />}
      {cover && <CoverRule cover={cover} />}
      {title && <TitleRule title={title} />}
      {labels && <LabelRule labels={labels} />}
      {online && <OnlineRule online={online} />}
      {offline && <OfflineRule offline={offline} />}
      {replaces && replaces.map((replace, replaceIndex) => {
        return (<ReplaceRule
          key={replaceIndex}
          {...replace}
        />);
      })}
      {attrs && attrs.map((attr, attrIndex) => {
        return (<AttrRule key={attrIndex} {...attr} />);
      })}
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
      {add && <FMappingRuleAdd />}
      {alter && <FEdit />}
      {active && <FMappingRuleActive />}
      {attrs && <FMappingRuleAttr />}
      {cover && <FMappingRuleCover />}
      {labels && <FMappingRuleLabel />}
      {offline && <FMappingRuleOffline />}
      {online && <FMappingRuleOnline />}
      {replaces && <FMappingRuleReplace />}
      {title && <FMappingRuleTitle />}
      {version && <FMappingRuleVersion />}
    </Space>
  </FPopover>);
}

export default MappingRule;


