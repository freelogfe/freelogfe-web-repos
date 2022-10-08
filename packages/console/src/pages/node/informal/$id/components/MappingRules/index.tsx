import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

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
    <div className={styles.ruleIcon}><FComponentsLib.FIcons.FMappingRuleAdd /></div>
    <div className={styles.ruleContent}>
      <div><FComponentsLib.FContentText text={'新增'} /></div>
      <div><label className={styles.exhibitLabel}>{exhibit}</label></div>
      <div><FComponentsLib.FContentText text={'，来源'} /></div>
      <div><label
        className={source.type === 'resource' ? styles.resourceLabel : styles.objectLabel}>{source.name}</label>
      </div>
      {
        !!source.versionRange && source.versionRange !== 'latest' && (<>
          <div><FComponentsLib.FContentText text={'展示版本'} /></div>
          <div><FComponentsLib.FContentText type='highlight' text={source.versionRange} /></div>
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
    <div className={styles.ruleIcon}><FComponentsLib.FIcons.FEdit /></div>
    <div className={styles.ruleContent}>
      <div><FComponentsLib.FContentText text={'修改'} /></div>
      <div><label className={styles.exhibitLabel}>{alter}</label></div>
    </div>
  </div>);
}

interface ActiveRuleProps {
  active: string;
}

export function ActiveRule({ active }: ActiveRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FComponentsLib.FIcons.FMappingRuleActive /></div>
    <div className={styles.ruleContent}>
      <div><FComponentsLib.FContentText text={'激活主题'} /></div>
      <div><label className={styles.exhibitLabel}>{active}</label></div>
    </div>
  </div>);
}

interface VersionRuleProps {
  version: string;
}

export function VersionRule({ version }: VersionRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FComponentsLib.FIcons.FMappingRuleVersion /></div>
    <div className={styles.ruleContent}>
      <div><FComponentsLib.FContentText text={'展示版本'} /></div>
      <div><FComponentsLib.FContentText type='highlight' text={version} /></div>
    </div>
  </div>);
}

interface LabelRuleProps {
  labels: string[];
}

export function LabelRule({ labels }: LabelRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FComponentsLib.FIcons.FMappingRuleLabel /></div>
    <div className={styles.ruleContent}>
      <div><FComponentsLib.FContentText text={'设置标签'} /></div>
      <div><FComponentsLib.FContentText type='highlight' text={labels.join(', ')} /></div>
    </div>
  </div>);
}

interface CoverRuleProps {
  cover: string;
}

export function CoverRule({ cover }: CoverRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FComponentsLib.FIcons.FMappingRuleCover /></div>
    <div className={styles.ruleContent}>
      <div><FComponentsLib.FContentText text={'设置封面'} /></div>
      <div><FComponentsLib.FContentText type='highlight' text={cover} /></div>
    </div>
  </div>);
}

interface TitleRuleProps {
  title: string;
}

export function TitleRule({ title }: TitleRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FComponentsLib.FIcons.FMappingRuleTitle /></div>
    <div className={styles.ruleContent}>
      <div><FComponentsLib.FContentText text={'设置标题'} /></div>
      <div><FComponentsLib.FContentText type='highlight' text={title} /></div>
    </div>
  </div>);
}

interface OnlineRuleProps {
  online: boolean;
}

export function OnlineRule({ online }: OnlineRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FComponentsLib.FIcons.FMappingRuleOnline /></div>
    <div className={styles.ruleContent}>
      <div><FComponentsLib.FContentText text={'展品状态'} /></div>
      <div><FComponentsLib.FContentText type='highlight' text={'上线'} /></div>
    </div>
  </div>);
}

interface OfflineRuleProps {
  offline: boolean;
}

export function OfflineRule({ offline }: OfflineRuleProps) {
  return (<div className={styles.rule}>
    <div className={styles.ruleIcon}><FComponentsLib.FIcons.FMappingRuleOffline /></div>
    <div className={styles.ruleContent}>
      <div><FComponentsLib.FContentText text={'展品状态'} /></div>
      <div><FComponentsLib.FContentText type='highlight' text={'下线'} /></div>
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
    <div className={styles.ruleIcon}><FComponentsLib.FIcons.FMappingRuleAttr /></div>
    {
      type === 'add'
        ? (<div className={styles.ruleContent}>
          <div><FComponentsLib.FContentText text={'添加属性'} /></div>
          <div><FComponentsLib.FContentText text={'键'} /></div>
          <div><FComponentsLib.FContentText type='highlight' text={theKey} /></div>
          <div><FComponentsLib.FContentText text={'值'} /></div>
          <div><FComponentsLib.FContentText type='highlight' text={value || ''} /></div>
          {
            description && (<>
              <div><FComponentsLib.FContentText text={'描述'} /></div>
              {/*<div><FTitleText type="h5" text={'description1'}/></div>*/}
              <div><FComponentsLib.FContentText type='highlight' text={description} /></div>
            </>)
          }
        </div>)
        : (<div className={styles.ruleContent}>
          <div><FComponentsLib.FContentText text={'删除属性'} /></div>
          <div><FComponentsLib.FContentText text={'键'} /></div>
          {/*<div><FTitleText type="h5" text={theKey}/></div>*/}
          <div><FComponentsLib.FContentText type='highlight' text={theKey} /></div>
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
    <div className={styles.ruleIcon}><FComponentsLib.FIcons.FMappingRuleReplace /></div>
    <div className={styles.ruleContent}>
      <div><FComponentsLib.FContentText text={'替换'} /></div>
      {/*<div><label className={styles.resourceLabel}>{replaced}</label></div>*/}
      <div><label
        className={replaced.type === 'resource' ? styles.resourceLabel : styles.objectLabel}>{replaced.name}</label>
      </div>
      {
        replaced.versionRange && replaced.versionRange !== '*' && (<>
          <div><FComponentsLib.FContentText text={'版本'} /></div>
          <div><FComponentsLib.FContentText type='highlight' text={replaced.versionRange} /></div>
        </>)
      }
      <div><FComponentsLib.FContentText text={'为'} /></div>
      <div><label
        className={replacer.type === 'resource' ? styles.resourceLabel : styles.objectLabel}>{replacer.name}</label>
      </div>
      {
        replacer.versionRange && replacer.versionRange !== 'latest' && (<>
          <div><FComponentsLib.FContentText text={'版本'} /></div>
          <div><FComponentsLib.FContentText type='highlight' text={replacer.versionRange} /></div>
        </>)
      }
      {
        scopes && scopes.length > 0 && (<>
          <div><FComponentsLib.FContentText text={'，作用域'} /></div>
          {
            scopes.map((sco, index) => {
              return (<React.Fragment key={index}>
                {index !== 0 && (<div><FComponentsLib.FContentText text={','} /></div>)}
                {
                  sco.map((s, i) => {
                    return (<React.Fragment key={i}>
                      {i !== 0 && (<div><FComponentsLib.FContentText text={'-'} /></div>)}
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
