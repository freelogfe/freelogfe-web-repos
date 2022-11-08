import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
// import {
//   // FEdit, FLine,
//   FMappingRuleAdd,
//   FMappingRuleAttr,
//   FMappingRuleCover,
//   FMappingRuleLabel,
//   FMappingRuleOffline,
//   FMappingRuleOnline,
//   FMappingRuleReplace,
//   FMappingRuleTitle,
// } from '@/components/FIcons';
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
import { TooltipPlacement } from 'antd/lib/tooltip';
import { OperationAndActionRecords } from '@/type/InformalNodeTypes';
import FTooltip from '@/components/FTooltip';
import FComponentsLib from '@freelog/components-lib';

interface MappingRuleProps {
  operationAndActionRecords: OperationAndActionRecords;

  placement?: TooltipPlacement;
}

function MappingRule({
                       operationAndActionRecords = [],
                       placement = 'right',
                     }: MappingRuleProps) {

  if (operationAndActionRecords.length === 0) {
    return (<FComponentsLib.FIcons.FLine />);
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
          return (<div
            key={oaarIndex}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            {
              oaar.type === 'add' && oaar.data.candidate && (<AddRule
                exhibit={oaar.data.exhibitName}
                source={oaar.data.candidate}
              />)
            }

            {
              oaar.type === 'alter' && (<AlterRule alter={oaar.data.exhibitName} />)
            }

            {
              oaar.type === 'activate_theme' && (<ActiveRule active={oaar.data.exhibitName} />)
            }

            {
              oaar.type === 'set_cover' && oaar.data.coverImage && (
                <CoverRule cover={oaar.data.coverImage} />)
            }

            {
              oaar.type === 'set_title' && oaar.data.title && (<TitleRule title={oaar.data.title} />)
            }

            {
              oaar.type === 'set_labels' && oaar.data.tags && (<LabelRule labels={oaar.data.tags} />)
            }

            {
              oaar.type === 'online' && oaar.data.onlineStatus && (<OnlineRule online={true} />)
            }

            {
              oaar.type === 'online' && !oaar.data.onlineStatus && (<OfflineRule offline={true} />)
            }

            {
              oaar.type === 'replace' && oaar.data.replacer && oaar.data.replaced && (<ReplaceRule
                replacer={oaar.data.replacer}
                replaced={oaar.data.replaced}
                scopes={[]}
              />)
            }

            {
              oaar.type === 'add_attr' && oaar.data.attrKey && oaar.data.attrValue && (<AttrRule
                type={'add'}
                theKey={oaar.data.attrKey || ''}
                value={oaar.data.attrValue || ''}
                description={oaar.data.attrDescription || ''}
              />)
            }

            {
              oaar.type === 'delete_attr' && oaar.data.attrKey && (<AttrRule
                type={'delete'}
                theKey={oaar.data.attrKey}
              />)
            }

            {
              oaar.warningMsg && (<FTooltip
                title={oaar.warningMsg}
                placement="left"
              >
                <FComponentsLib.FIcons.FWarning />
              </FTooltip>)
            }

          </div>);
        })
      }

    </Space>}
    title={<div className={styles.popoverTitle}>
      <FComponentsLib.FContentText
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
            return (<FComponentsLib.FIcons.FMappingRuleAdd key={oaarIndex} />);
          }
          if (oaar.type === 'alter') {
            return (<FComponentsLib.FIcons.FEdit key={oaarIndex} />);
          }
          if (oaar.type === 'activate_theme') {
            return (<FComponentsLib.FIcons.FMappingRuleActive key={oaarIndex} />);
          }
          if (oaar.type === 'set_cover') {
            return (<FComponentsLib.FIcons.FMappingRuleCover key={oaarIndex} />);
          }
          if (oaar.type === 'set_title') {
            return (<FComponentsLib.FIcons.FMappingRuleTitle key={oaarIndex} />);
          }
          if (oaar.type === 'set_labels') {
            return (<FComponentsLib.FIcons.FMappingRuleLabel key={oaarIndex} />);
          }
          if (oaar.type === 'online') {
            return oaar.data.onlineStatus
              ? (<FComponentsLib.FIcons.FMappingRuleOnline key={oaarIndex} />)
              : (<FComponentsLib.FIcons.FMappingRuleOffline key={oaarIndex} />);
          }

          if (oaar.type === 'add_attr' || oaar.type === 'delete_attr') {
            return (<FComponentsLib.FIcons.FMappingRuleAttr key={oaarIndex} />);
          }

          if (oaar.type === 'replace') {
            return (<FComponentsLib.FIcons.FMappingRuleReplace key={oaarIndex} />);
          }
          return null;
        })
      }

    </Space>
  </FPopover>);
}

export default MappingRule;


