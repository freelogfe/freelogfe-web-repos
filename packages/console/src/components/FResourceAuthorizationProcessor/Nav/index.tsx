import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FTooltip from '@/components/FTooltip';
import FResourceStatusBadge from '@/components/FResourceStatusBadge';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import FVersionHandlerPopover from '@/components/FVersionHandlerPopover';
import { DepResources } from '@/models/resourceVersionCreatorPage';

interface TargetInfo {
  targetID: string;
  targetName: string;
  targetType: 'resource' | 'object';
  targetResourceType: string[];
  error: '' | 'offline' | 'cyclicDependency' | 'storageObject' | 'upThrow' | 'freeze';
  warning: '' | 'authException' | 'ownerFreeze';
  versions: string[];
  upThrow: boolean;
  upThrowDisabled: boolean;
  contracts: {
    contractID: string;
    policyID: string;
    title: string;
    code: string;
    date: string;
  }[];
  terminatedContractIDs: string[];
  enabledPolicies: {
    checked: boolean;
    policyFullInfo: PolicyFullInfo_Type;
  }[];
}

interface NavProps {
  relations: {
    id: string;
    name: string;
    type: 'resource' | 'object';
    versionRange: string;
    children: {
      id: string;
      name: string;
      type: 'resource' | 'object';
    }[]
  }[];

  targetInfos: TargetInfo[];

  activatedTarget: {
    id: string;
    name: string;
    type: 'resource' | 'object';
  } | null;
}

function Nav({ relations, targetInfos, activatedTarget }: NavProps) {

  if (!activatedTarget || targetInfos.length === 0 || relations.length === 0) {
    return null;
  }

  return (<div className={styles.styles}>
    {
      relations.map((r) => {
          const info: TargetInfo | undefined = targetInfos
            .find((t) => {
              return t.targetID === r.id && t.targetName === r.name && t.targetType === r.type;
            });

          if (!info) {
            return null;
          }
          // console.log(rrr.status, '######');
          return (<div key={info.targetID + '-' + info.targetName}>
            <div
              onClick={() => {
                // onChangeActiveID(rrr.id);
              }}
              className={[styles.DepPanelNav, info.targetID === activatedTarget.id && info.targetName === activatedTarget.name && info.targetType === activatedTarget.type ? styles.DepPanelNavActive : ''].join(' ')}
            >
              <div>
                <div className={styles.title}>
                  <FTooltip title={info.targetName}><span>
                      <FComponentsLib.FContentText
                        className={styles.titleText}
                        text={info.targetName}
                        singleRow
                        type='highlight'
                      />
                    </span></FTooltip>

                  <FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}><span>

                      <FComponentsLib.FTextBtn
                        type='primary'
                        onClick={(e) => {
                          e.stopPropagation();
                          // if (rrr.status === 3) {
                          if (info.error === 'storageObject') {
                            return goToObject(info.targetID);
                          }
                          return window.open(FUtil.LinkTo.resourceDetails({
                            resourceID: info.targetID,
                          }));
                        }}
                      >
                        <FComponentsLib.FIcons.FFileSearch />
                      </FComponentsLib.FTextBtn>
                    </span></FTooltip>

                  <div style={{ width: 5 }} />
                  {info.error === 'offline' && (<FResourceStatusBadge status={'offline'} />)}
                  {info.error === 'cyclicDependency' && (
                    <FComponentsLib.FIcons.FForbid className={styles.titleErrorIcon} />)}
                  {info.error === 'storageObject' && (
                    <FComponentsLib.FIcons.FForbid className={styles.titleErrorIcon} />)}
                  {info.error === 'upThrow' && (<FComponentsLib.FIcons.FUpcast className={styles.titleErrorIcon} />)}
                  {info.error === 'freeze' && (<FComponentsLib.FIcons.FForbid className={styles.titleErrorIcon} />)}
                  {info.error === '' && info.warning === 'authException' && (
                    <FTooltip title={'存在授权问题'}><FComponentsLib.FIcons.FWarning style={{ fontSize: 14 }} /></FTooltip>)}
                  {info.error === '' && info.warning === 'ownerFreeze' && (
                    <FTooltip title={'该资源发行方账号因违规已被冻结'}><FComponentsLib.FIcons.FWarning
                      style={{ fontSize: 14 }} /></FTooltip>)}
                </div>
                <div style={{ height: 9 }} />
                <FComponentsLib.FContentText type='additional2'>
                  <div>
                    {FUtil.Format.resourceTypeKeyArrToResourceType(info.targetResourceType)}
                    {info.targetResourceType.length > 0 ? ' | ' : ''}
                    {
                      info.versions?.length === 0
                        ? <span style={{ paddingRight: 5 }}>暂无版本</span>
                        : <>
                    <span
                      style={{ paddingRight: 5 }}>{FI18n.i18nNext.t('version_range')}：{r.versionRange}</span>
                          <FVersionHandlerPopover
                            value={r.versionRange}
                            versionOptions={info.versions}
                            onChange={(version) => {
                              // onChangeVersion(version, i.id)
                            }}
                          ><FComponentsLib.FIcons.FEdit style={{ fontSize: 14 }} /></FVersionHandlerPopover>
                        </>
                    }
                  </div>
                </FComponentsLib.FContentText>
                <>
                  <div style={{ height: 5 }} />
                  <div className={styles.DepPanelLabels}>
                    {
                      !info.upThrow && (<>

                        {
                          [...info.contracts, ...info.enabledPolicies.filter((k) => k.checked)]
                            .length === 0
                            ? (<div style={{
                              color: '#E9A923',
                              fontSize: 12,
                              lineHeight: '18px',
                              fontWeight: 400,
                            }}>未处理授权</div>)
                            : (<FComponentsLib.F_Contract_And_Policy_Labels
                              data={[
                                ...info.contracts
                                  .map((c) => {
                                    return {
                                      text: c.title,
                                      dot: '' as '',
                                    };
                                  }),
                                ...info.enabledPolicies
                                  .filter((k) => {
                                    return k.checked;
                                  })
                                  .map((j) => {
                                    return {
                                      text: j.policyFullInfo.policyName,
                                      dot: '' as '',
                                    };
                                  }),
                              ]}
                            />)
                        }
                      </>)
                    }
                    {
                      info.upThrow && (<label
                        className={styles.labelError}
                      >上抛</label>)
                    }
                  </div>
                </>
              </div>
              <FComponentsLib.FCircleBtn
                onClick={(e) => {
                  e.stopPropagation();
                  // return onDeleteResource(i.id);
                }}
                type='danger'
              />
            </div>

            <SmallNav
              // dataSource={i.unresolved || []}
              relations={r.children}
              targetInfos={targetInfos}
              activatedTarget={activatedTarget}
              onClick={(resourceID) => {
                // onChangeActiveID(resourceID);
              }}
            />

          </div>);
        },
      )}
  </div>);
}

export default Nav;

interface SmallNavProps {
  relations: {
    id: string;
    name: string;
    type: 'resource' | 'object';
  }[];

  targetInfos: TargetInfo[];

  activatedTarget: {
    id: string;
    name: string;
    type: 'resource' | 'object';
  } | null;

  onClick?: (resourceID: DepResources[number]['id']) => void;
}

function SmallNav({ relations, targetInfos, activatedTarget }: SmallNavProps) {
  if (relations.length === 0 || targetInfos.length === 0 || !activatedTarget) {
    return null;
  }

  return (<div>
    <div style={{ padding: '5px 0 5px 15px' }}>
      <FComponentsLib.FContentText
        type='additional2'
        // text={'此资源存在以下基础上抛'}
        text={FI18n.i18nNext.t('upcast')}
      />
    </div>
    {
      relations.map((r) => {
        const info: TargetInfo | undefined = targetInfos
          .find((t) => {
            return t.targetID === r.id && t.targetName === r.name && t.targetType === r.type;
          });
        if (!info) {
          return null;
        }
        return (
          <div
            key={info.targetID + '-' + info.targetName}
            onClick={(e) => {
              e.stopPropagation();
              // onClick && onClick(i.id);
            }}
            // className={styles.childrenDepPanelNav + ' ' + (activatedID === i.id ? styles.DepPanelNavActive : '')}
            className={[styles.childrenDepPanelNav, info.targetID === activatedTarget.id && info.targetName === activatedTarget.name && info.targetType === activatedTarget.type ? styles.DepPanelNavActive : ''].join(' ')}

          >
            <div className={styles.title}>
              <FTooltip title={info.targetName}><span>
                <FComponentsLib.FContentText
                  className={styles.titleText}
                  text={info.targetName}
                  singleRow
                  type='highlight'
                />
              </span></FTooltip>
              <FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}>
                <span><FComponentsLib.FTextBtn
                  type='primary'
                  onClick={(e) => {
                    e.stopPropagation();
                    // if (i.status === 3) {
                    if (info.error === 'storageObject') {
                      return goToObject(info.targetID);
                    }
                    return window.open(FUtil.LinkTo.resourceDetails({
                      resourceID: info.targetID,
                    }));
                  }}
                ><FComponentsLib.FIcons.FFileSearch /></FComponentsLib.FTextBtn></span>
              </FTooltip>
              <div style={{ width: 5 }} />
              {info.error === 'offline' && (<FResourceStatusBadge status={'offline'} />)}
              {info.error === 'cyclicDependency' && (
                <FComponentsLib.FIcons.FForbid className={styles.titleErrorIcon} />)}
              {info.error === 'storageObject' && (<FComponentsLib.FIcons.FForbid className={styles.titleErrorIcon} />)}
              {info.error === 'upThrow' && (<FComponentsLib.FIcons.FUpcast className={styles.titleErrorIcon} />)}
              {info.error === 'freeze' && (<FComponentsLib.FIcons.FForbid className={styles.titleErrorIcon} />)}
              {info.error === '' && info.warning === 'authException' && (
                <FTooltip title={'存在授权问题'}><FComponentsLib.FIcons.FWarning style={{ fontSize: 14 }} /></FTooltip>)}
              {info.error === '' && info.warning === 'ownerFreeze' && (
                <FTooltip title={'该资源发行方账号因违规已被冻结'}><FComponentsLib.FIcons.FWarning
                  style={{ fontSize: 14 }} /></FTooltip>)}
            </div>
            <div style={{ height: 5 }} />
            <FComponentsLib.FContentText type='additional2'>
              <div>{info.targetResourceType.length === 0 || '暂无类型'}</div>
            </FComponentsLib.FContentText>
            <div style={{ height: 5 }} />
            <div className={styles.DepPanelLabels}>
              {
                !info.upThrow && [...info.contracts, ...info.enabledPolicies.filter((k) => k.checked)].length === 0
                  ? (<div style={{
                    color: '#E9A923',
                    fontSize: 12,
                    lineHeight: '18px',
                    fontWeight: 400,
                  }}>未处理授权</div>)
                  : (<FComponentsLib.F_Contract_And_Policy_Labels
                    data={[
                      ...info.contracts.map((c) => {
                        return {
                          text: c.title,
                          dot: '' as '',
                        };
                      }),
                      ...info.enabledPolicies
                        .filter((k) => {
                          return k.checked;
                        })
                        .map((j) => {
                          return {
                            text: j.policyFullInfo.policyName,
                            dot: '' as '',
                          };
                        }),
                    ]}
                  />)
              }
              {
                info.upThrow && (<label
                  className={styles.labelError}
                >上抛</label>)
              }
            </div>
          </div>);
      })
    }

  </div>);
}

async function goToObject(id: string) {
  const { data } = await FServiceAPI.Storage.objectDetails({
    objectIdOrName: id,
  });
  // console.log(data, 'data!Q@#$@#$!@#$@#$@!#$!@#$');
  window.open(FUtil.LinkTo.objectDetails({
    objectID: data.objectId,
    bucketName: data.bucketName,
  }));
}
