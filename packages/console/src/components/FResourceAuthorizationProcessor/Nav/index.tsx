import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FTooltip from '@/components/FTooltip';
import FResourceStatusBadge from '@/components/FResourceStatusBadge';
// import { PolicyFullInfo_Type } from '@/type/contractTypes';
import FVersionHandlerPopover from '@/components/FVersionHandlerPopover';
import { IActivatedTarget, IBaseUpcastResource, IRelation, ITargetInfo } from '../types';
import { MutableRefObject } from 'react';
import FAutoOverflowTooltipTitle from '@/components/FAutoOverflowTooltipTitle';

interface NavProps {
  relations: IRelation[];

  targetInfos: ITargetInfo[];

  activatedTarget: IActivatedTarget | null;

  baseUpcastResources: IBaseUpcastResource[];

  onChange_Relations?(value: IRelation[]): void;

  onChange_ActivatedTarget?(value: IActivatedTarget): void;
}

function Nav({
               relations,
               targetInfos,
               activatedTarget,
               baseUpcastResources,
               onChange_Relations,
               onChange_ActivatedTarget,
             }: NavProps) {

  // console.log(targetInfos, 'targetInfos098iowjeaflksdjflksdjflkllllll');
  if (!activatedTarget || targetInfos.length === 0 || relations.length === 0) {
    return null;
  }

  return (<div className={styles.styles}>
    {
      relations.map((r) => {
          const info: ITargetInfo | undefined = targetInfos
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
                onChange_ActivatedTarget && onChange_ActivatedTarget({
                  id: info.targetID,
                  name: info.targetName,
                  type: info.targetType,
                });
              }}
              className={[styles.DepPanelNav, info.targetID === activatedTarget.id && info.targetName === activatedTarget.name && info.targetType === activatedTarget.type ? styles.DepPanelNavActive : ''].join(' ')}
            >
              <div style={{ width: '100%' }}>
                {/*<div className={styles.title}>*/}
                {/*<div className={styles.row}>*/}
                {/*<FTooltip*/}
                {/*  title={info.targetName}*/}
                {/*  placement={'top'}*/}
                {/*><span style={{ flexShrink: 1 }} id={'AAABBBCCC'}>*/}
                {/*    <FComponentsLib.FContentText*/}
                {/*      className={styles.titleText}*/}
                {/*      text={info.targetName}*/}
                {/*      singleRow*/}
                {/*      type='highlight'*/}
                {/*    />*/}
                {/*  </span></FTooltip>*/}

                <FAutoOverflowTooltipTitle
                  title={info.targetName}
                  right={<>
                    {info.error === 'unreleased' && (<FResourceStatusBadge status={'unreleased'} />)}
                    {info.error === 'offline' && (<FResourceStatusBadge status={'offline'} />)}
                    {info.error === 'cyclicDependency' && (
                      <FComponentsLib.FIcons.FForbid className={styles.titleErrorIcon} />)}
                    {info.error === 'storageObject' && (
                      <FComponentsLib.FIcons.FForbid className={styles.titleErrorIcon} />)}
                    {info.error === 'upThrow' && (<FComponentsLib.FIcons.FUpcast className={styles.titleErrorIcon} />)}
                    {info.error === 'freeze' && (<FComponentsLib.FIcons.FForbid className={styles.titleErrorIcon} />)}
                    {info.error === '' && info.warning === 'authException' && (
                      <FTooltip title={'存在授权问题'}><FComponentsLib.FIcons.FWarning
                        style={{ fontSize: 14 }} /></FTooltip>)}
                    {info.error === '' && info.warning === 'ownerFreeze' && (
                      <FTooltip title={'该资源发行方账号因违规已被冻结'}><FComponentsLib.FIcons.FWarning
                        style={{ fontSize: 14 }} /></FTooltip>)}

                    <FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}><span
                      className={styles.FFileSearch}>
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
                        <FComponentsLib.FIcons.FFileSearch style={{ fontSize: 16 }} />
                      </FComponentsLib.FTextBtn>
                    </span></FTooltip>
                  </>}
                />


                {/*</div>*/}
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
                              onChange_Relations && onChange_Relations(relations.map((rl) => {
                                if (r.id === rl.id && r.name === rl.name && r.type === rl.type) {
                                  return {
                                    ...rl,
                                    versionRange: version,
                                  };
                                }
                                return rl;
                              }));
                            }}
                          ><FComponentsLib.FIcons.FEdit style={{ fontSize: 14 }} /></FVersionHandlerPopover>
                        </>
                    }
                  </div>
                </FComponentsLib.FContentText>
                <div style={{ height: 5 }} />
                <div className={styles.DepPanelLabels}>
                  {
                    info.targetType === 'resource' && baseUpcastResources.every((r) => {
                      return r.resourceID !== info?.targetID && r.resourceName !== info?.targetName;
                    }) && (<>

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
                    info.targetType === 'resource' && baseUpcastResources.some((r) => {
                      return r.resourceID === info?.targetID && r.resourceName === info?.targetName;
                    }) && (<label
                      className={styles.labelError}
                    >上抛</label>)
                  }
                </div>
              </div>
              <FComponentsLib.FCircleBtn
                onClick={(e) => {
                  e.stopPropagation();
                  onChange_Relations && onChange_Relations(relations.filter((rl) => {
                    return !(r.id === rl.id && r.name === rl.name && r.type === rl.type);
                  }));
                }}
                type='danger'
              />
            </div>

            <SmallNav
              // dataSource={i.unresolved || []}
              relations={r.children}
              targetInfos={targetInfos}
              activatedTarget={activatedTarget}
              baseUpcastResources={baseUpcastResources}
              onClick={(value) => {
                // onChangeActiveID(resourceID);
                onChange_ActivatedTarget && onChange_ActivatedTarget(value);
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

  targetInfos: ITargetInfo[];

  activatedTarget: IActivatedTarget | null;

  baseUpcastResources: IBaseUpcastResource[];

  onClick?: (resourceID: IActivatedTarget) => void;
}

function SmallNav({ relations, targetInfos, activatedTarget, baseUpcastResources, onClick }: SmallNavProps) {
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
        const info: ITargetInfo | undefined = targetInfos
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
              onClick && onClick({
                id: info.targetID,
                name: info.targetName,
                type: info.targetType,
              });
            }}
            // className={styles.childrenDepPanelNav + ' ' + (activatedID === i.id ? styles.DepPanelNavActive : '')}
            className={[styles.childrenDepPanelNav, info.targetID === activatedTarget.id && info.targetName === activatedTarget.name && info.targetType === activatedTarget.type ? styles.DepPanelNavActive : ''].join(' ')}

          >
            <FAutoOverflowTooltipTitle
              title={info.targetName}
              right={<>
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
                <FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}>
                <span className={styles.FFileSearch}><FComponentsLib.FTextBtn
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
                ><FComponentsLib.FIcons.FFileSearch style={{ fontSize: 16 }} /></FComponentsLib.FTextBtn></span>
                </FTooltip>
              </>}
            />
            {/*<div className={styles.title}>*/}
            {/*  <FTooltip title={info.targetName}><span>*/}
            {/*    <FComponentsLib.FContentText*/}
            {/*      className={styles.titleText}*/}
            {/*      text={info.targetName}*/}
            {/*      singleRow*/}
            {/*      type='highlight'*/}
            {/*    />*/}
            {/*  </span></FTooltip>*/}
            {/*  <div style={{ width: 5 }} />*/}
            {/*  <FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}>*/}
            {/*    <span><FComponentsLib.FTextBtn*/}
            {/*      type='primary'*/}
            {/*      onClick={(e) => {*/}
            {/*        e.stopPropagation();*/}
            {/*        // if (i.status === 3) {*/}
            {/*        if (info.error === 'storageObject') {*/}
            {/*          return goToObject(info.targetID);*/}
            {/*        }*/}
            {/*        return window.open(FUtil.LinkTo.resourceDetails({*/}
            {/*          resourceID: info.targetID,*/}
            {/*        }));*/}
            {/*      }}*/}
            {/*    ><FComponentsLib.FIcons.FFileSearch style={{ fontSize: 16 }} /></FComponentsLib.FTextBtn></span>*/}
            {/*  </FTooltip>*/}
            {/*  <div style={{ width: 5 }} />*/}
            {/*  {info.error === 'offline' && (<FResourceStatusBadge status={'offline'} />)}*/}
            {/*  {info.error === 'cyclicDependency' && (*/}
            {/*    <FComponentsLib.FIcons.FForbid className={styles.titleErrorIcon} />)}*/}
            {/*  {info.error === 'storageObject' && (<FComponentsLib.FIcons.FForbid className={styles.titleErrorIcon} />)}*/}
            {/*  {info.error === 'upThrow' && (<FComponentsLib.FIcons.FUpcast className={styles.titleErrorIcon} />)}*/}
            {/*  {info.error === 'freeze' && (<FComponentsLib.FIcons.FForbid className={styles.titleErrorIcon} />)}*/}
            {/*  {info.error === '' && info.warning === 'authException' && (*/}
            {/*    <FTooltip title={'存在授权问题'}><FComponentsLib.FIcons.FWarning style={{ fontSize: 14 }} /></FTooltip>)}*/}
            {/*  {info.error === '' && info.warning === 'ownerFreeze' && (*/}
            {/*    <FTooltip title={'该资源发行方账号因违规已被冻结'}><FComponentsLib.FIcons.FWarning*/}
            {/*      style={{ fontSize: 14 }} /></FTooltip>)}*/}
            {/*</div>*/}
            <div style={{ height: 5 }} />
            <FComponentsLib.FContentText type='additional2'>
              <div>{info.targetResourceType.length === 0 || '暂无类型'}</div>
            </FComponentsLib.FContentText>
            <div style={{ height: 5 }} />
            <div className={styles.DepPanelLabels}>
              {
                info.targetType === 'resource' && baseUpcastResources.every((r) => {
                  return r.resourceID !== info?.targetID && r.resourceName !== info?.targetName;
                }) && [...info.contracts, ...info.enabledPolicies.filter((k) => k.checked)].length === 0
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
                info.targetType === 'resource' && baseUpcastResources.some((r) => {
                  return r.resourceID === info?.targetID && r.resourceName === info?.targetName;
                }) && (<label
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
//
// interface OverflowTooltipProps {
//   name: string;
//   right: React.ReactNode;
// }
//
// function OverflowTooltip({ name, right }: OverflowTooltipProps) {
//
//   const refContainer: MutableRefObject<any> = React.useRef(null);
//
//   const [tooltipDisable, set_tooltipDisable] = React.useState<boolean>(true);
//
//   // React.useEffect(() => {
//   //   if (refContainer?.current) {
//   //     console.log(refContainer.current.clientWidth, refContainer.current.scrollWidth, 'asdoifjlkwjelkfjolskdjflskdjflkj');
//   //     set_tooltipDisable(refContainer.current.clientWidth < refContainer.current.scrollWidth);
//   //   }
//   //
//   // }, [name]);
//
//   return (<div
//     className={styles.row}
//     onMouseEnter={() => {
//       set_tooltipDisable(refContainer.current.clientWidth < refContainer.current.scrollWidth);
//     }}>
//     <FTooltip
//       title={name}
//       placement={'top'}
//       open={!tooltipDisable ? false : undefined}
//     >
//       <div ref={refContainer} className={styles.title1}>{name}</div>
//     </FTooltip>
//
//     <div className={styles.icon}>
//       {right}
//     </div>
//   </div>);
// }
