import * as React from 'react';
import styles from './index.less';
import {
  FEdit,
  FMappingRuleAdd, FMappingRuleAttr,
  FMappingRuleCover,
  FMappingRuleLabel, FMappingRuleOffline, FMappingRuleOnline, FMappingRuleReplace,
  FMappingRuleTitle,
  FMappingRuleVersion,
} from '@/components/FIcons';
import { FContentText } from '@/components/FText';
import FMappingRuleActive from '@/components/FIcons/FMappingRuleActive';

interface AddRuleProps {
  exhibit: string;
  source: {
    name: string;
    type: 'resource' | 'object';
    versionRange?: string;
  };
}

export function AddRule({ exhibit, source }: AddRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleAdd /></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'新增'} /></div>
      <div><label className={styles.exhibitLabel}>{exhibit}</label></div>
      <div><FContentText text={'，来源'} /></div>
      <div><label
        className={source.type === 'resource' ? styles.resourceLabel : styles.objectLabel}>{source.name}</label>
      </div>
      {
        source.versionRange !== '' && source.versionRange !== 'latest' && (<>
          <div><FContentText text={'展示版本'} /></div>
          <div><FContentText type='highlight' text={source.versionRange} /></div>
        </>)
      }
    </div>
  </div>);
}

interface AlterRuleProps {
  alter: string;
}

export function AlterRule({ alter }: AlterRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FEdit /></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'修改'} /></div>
      <div><label className={styles.exhibitLabel}>{alter}</label></div>
    </div>
  </div>);
}

interface ActiveRuleProps {
  active: string;
}

export function ActiveRule({ active }: ActiveRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleActive /></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'激活主题'} /></div>
      <div><label className={styles.exhibitLabel}>{active}</label></div>
    </div>
  </div>);
}

interface VersionRuleProps {
  version: string;
}

export function VersionRule({ version }: VersionRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleVersion /></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'展示版本'} /></div>
      <div><FContentText type='highlight' text={version} /></div>
    </div>
  </div>);
}

interface LabelRuleProps {
  labels: string[];
}

export function LabelRule({ labels }: LabelRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleLabel /></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'设置标签'} /></div>
      <div><FContentText type='highlight' text={labels.join(', ')} /></div>
    </div>
  </div>);
}

interface CoverRuleProps {
  cover: string;
}

export function CoverRule({ cover }: CoverRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleCover /></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'设置封面'} /></div>
      <div><FContentText type='highlight' text={cover} /></div>
    </div>
  </div>);
}

interface TitleRuleProps {
  title: string;
}

export function TitleRule({ title }: TitleRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleTitle /></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'设置标题'} /></div>
      <div><FContentText type='highlight' text={title} /></div>
    </div>
  </div>);
}

interface OnlineRuleProps {
  online: boolean;
}

export function OnlineRule({ online }: OnlineRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleOnline /></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'展品状态'} /></div>
      <div><FContentText type='highlight' text={'上线'} /></div>
    </div>
  </div>);
}

interface OfflineRuleProps {
  offline: boolean;
}

export function OfflineRule({ offline }: OfflineRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleOffline /></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'展品状态'} /></div>
      <div><FContentText type='highlight' text={'下线'} /></div>
    </div>
  </div>);
}

interface AttrRuleProps {
  type: 'add' | 'delete',
  theKey: string;
  value?: string;
  description?: string;
}

export function AttrRule({ type, theKey, value, description }: AttrRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleAttr /></div>
    {
      type === 'add'
        ? (<div className={styles.ruleContent}>
          <div><FContentText text={'添加属性'} /></div>
          <div><FContentText text={'键'} /></div>
          <div><FContentText type='highlight' text={theKey} /></div>
          <div><FContentText text={'值'} /></div>
          <div><FContentText type='highlight' text={value || ''} /></div>
          {
            description && (<>
              <div><FContentText text={'描述'} /></div>
              {/*<div><FTitleText type="h5" text={'description1'}/></div>*/}
              <div><FContentText type='highlight' text={description} /></div>
            </>)
          }
        </div>)
        : (<div className={styles.ruleContent}>
          <div><FContentText text={'删除属性'} /></div>
          <div><FContentText text={'键'} /></div>
          {/*<div><FTitleText type="h5" text={theKey}/></div>*/}
          <div><FContentText type='highlight' text={theKey} /></div>
        </div>)
    }

  </div>);
}

interface ICandidate {
  name: string;
  versionRange?: string;
  type: 'resource' | 'object';
}

interface ReplaceRuleProps {
  replaced: ICandidate;
  replacer: ICandidate;
  scopes?: ICandidate[][];
}

export function ReplaceRule({ replacer, replaced, scopes }: ReplaceRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FMappingRuleReplace /></div>
    <div className={styles.ruleContent}>
      <div><FContentText text={'替换'} /></div>
      {/*<div><label className={styles.resourceLabel}>{replaced}</label></div>*/}
      <div><label
        className={replaced.type === 'resource' ? styles.resourceLabel : styles.objectLabel}>{replaced.name}</label>
      </div>
      {
        replaced.versionRange !== '' && replaced.versionRange !== '*' && (<>
          <div><FContentText text={'版本'} /></div>
          <div><FContentText type='highlight' text={replaced.versionRange} /></div>
        </>)
      }
      <div><FContentText text={'为'} /></div>
      <div><label
        className={replacer.type === 'resource' ? styles.resourceLabel : styles.objectLabel}>{replacer.name}</label>
      </div>
      {
        replacer.versionRange !== '' && replacer.versionRange !== 'latest' && (<>
          <div><FContentText text={'版本'} /></div>
          <div><FContentText type='highlight' text={replacer.versionRange} /></div>
        </>)
      }
      {
        scopes && scopes.length > 0 && (<>
          <div><FContentText text={'，作用域'} /></div>
          {
            scopes.map((sco, index) => {
              return (<React.Fragment key={index}>
                {index !== 0 && (<div><FContentText text={','} /></div>)}
                {
                  sco.map((s, i) => {
                    return (<React.Fragment key={i}>
                      {i !== 0 && (<div><FContentText text={'-'} /></div>)}
                      {/*<div><label className={styles.resourceLabel}>{s}</label></div>*/}
                      <div><label
                        className={s.type === 'resource' ? styles.resourceLabel : styles.objectLabel}>{s.name}</label>
                      </div>
                    </React.Fragment>);
                  })
                }
              </React.Fragment>);
            })
          }
        </>)
      }
    </div>
  </div>);
}
