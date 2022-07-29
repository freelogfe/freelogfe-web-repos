import * as React from 'react';
import styles from './index.less';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceVersionCreatorPageModelState } from '@/models/connect';
import {
  ChangeAction,
  DeleteDependencyByIDAction,
  DepResources,
} from '@/models/resourceVersionCreatorPage';
import FVersionHandlerPopover from '@/components/FVersionHandlerPopover';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import FResourceStatusBadge from '@/components/FResourceStatusBadge';
import { FFileSearch, FWarning } from '@/components/FIcons';
import FForbid from '@/components/FIcons/FForbid';
import FUpcast from '@/components/FIcons/FUpcast';
import FTooltip from '@/components/FTooltip';
import FComponentsLib from '@freelog/components-lib';

export interface ResourcesProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function Resources({ dispatch, resourceVersionCreatorPage }: ResourcesProps) {

  function onChangeVersion(version: DepResources[number]['versionRange'], id: DepResources[number]['id']) {
    const dependencies: ResourceVersionCreatorPageModelState['dependencies'] = resourceVersionCreatorPage.dependencies.map((dd) => {
      if (dd.id !== id) {
        return dd;
      }
      return {
        ...dd,
        versionRange: version,
      };
    });
    dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      id,
      payload: {
        dependencies,
      },
      caller: '23453243434523432459028084002384)))34%#$%#$%#$%#$#$',
    });
  }

  function onDeleteResource(id: DepResources[number]['id']) {

    dispatch<DeleteDependencyByIDAction>({
      type: 'resourceVersionCreatorPage/deleteDependencyByID',
      payload: id,
    });
  }

  function onChangeActiveID(id: string) {
    if (id === resourceVersionCreatorPage.depActivatedID) {
      return;
    }
    dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload: {
        depActivatedID: id,
      },
      caller: '~!@#!@#!!!@##33234532434345234324534%#$%#$%#$%#$#$',
    });
  }

  return <div className={styles.styles}>
    {
      [...resourceVersionCreatorPage.depRelationship]
        .reverse()
        .map((i) => {
            const rrr: ResourceVersionCreatorPageModelState['dependencies'][number] = resourceVersionCreatorPage.dependencies
              .find((dds) => dds.id === i.id) as ResourceVersionCreatorPageModelState['dependencies'][number];
            // console.log(rrr.status, '######');
            return (<div key={rrr.id}>
              <div
                onClick={() => {
                  onChangeActiveID(rrr.id);
                }}
                className={styles.DepPanelNav + ' ' + (rrr.id === resourceVersionCreatorPage.depActivatedID ? styles.DepPanelNavActive : '')}
              >
                <div>
                  <div className={styles.title}>
                    <FTooltip title={rrr.title}><span>
                      <FComponentsLib.FContentText
                        className={styles.titleText}
                        text={rrr.title}
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
                          if (rrr.error === 'storageObject') {
                            return goToObject(rrr.id);
                          }
                          return window.open(FUtil.LinkTo.resourceDetails({
                            resourceID: rrr.id,
                          }));
                        }}
                      >
                        <FFileSearch />
                      </FComponentsLib.FTextBtn>
                    </span></FTooltip>
                    {/*<FComponentsLib.FTextBtn*/}
                    {/*  onClick={(e) => {*/}
                    {/*    e.stopPropagation();*/}
                    {/*    // if (rrr.status === 3) {*/}
                    {/*    if (rrr.error === 'storageObject') {*/}
                    {/*      return goToObject(rrr.id);*/}
                    {/*    }*/}
                    {/*    return window.open(FUtil.LinkTo.resourceDetails({*/}
                    {/*      resourceID: rrr.id,*/}
                    {/*    }));*/}
                    {/*  }}*/}
                    {/*  type='default'*/}
                    {/*>*/}
                    {/*</FComponentsLib.FTextBtn>*/}
                    <div style={{ width: 5 }} />
                    {/*{rrr.status === 0 && (<FResourceStatusBadge status={'offline'} />)}*/}
                    {rrr.error === 'offline' && (<FResourceStatusBadge status={'offline'} />)}
                    {/*{rrr.status === 2 && (<FForbid className={styles.titleErrorIcon} />)}*/}
                    {rrr.error === 'cyclicDependency' && (<FForbid className={styles.titleErrorIcon} />)}
                    {/*{rrr.status === 3 && (<FForbid className={styles.titleErrorIcon} />)}*/}
                    {rrr.error === 'storageObject' && (<FForbid className={styles.titleErrorIcon} />)}
                    {/*{rrr.status === 4 && (<FUpcast className={styles.titleErrorIcon} />)}*/}
                    {rrr.error === 'upThrow' && (<FUpcast className={styles.titleErrorIcon} />)}
                    {rrr.error === 'freeze' && (<FForbid className={styles.titleErrorIcon} />)}
                    {rrr.error === '' && rrr.warning === 'authException' && (
                      <FTooltip title={'存在授权问题'}><FWarning style={{ fontSize: 14 }} /></FTooltip>)}
                    {rrr.error === '' && rrr.warning === 'ownerFreeze' && (
                      <FTooltip title={'该资源发行方账号因违规已被冻结'}><FWarning style={{ fontSize: 14 }} /></FTooltip>)}
                  </div>
                  <div style={{ height: 9 }} />
                  <FComponentsLib.FContentText type='additional2'>
                    <div>
                      {/*{rrr.resourceType || '暂无类型'}*/}
                      {FUtil.Format.resourceTypeKeyArrToResourceType(rrr.resourceType)}
                      {rrr.resourceType.length > 0 ? ' | ' : ''}
                      {
                        rrr.versions?.length === 0
                          ? <span style={{ paddingRight: 5 }}>暂无版本</span>
                          : <>
                    <span
                      style={{ paddingRight: 5 }}>{FI18n.i18nNext.t('version_range')}：{rrr.versionRange}</span>
                            <FVersionHandlerPopover
                              value={rrr.versionRange}
                              versionOptions={rrr.versions}
                              onChange={(version) => onChangeVersion(version, i.id)}
                            ><FComponentsLib.FIcons.FEdit style={{ fontSize: 14 }} /></FVersionHandlerPopover>
                          </>
                      }
                    </div>
                  </FComponentsLib.FContentText>
                  <>
                    <div style={{ height: 5 }} />
                    <div className={styles.DepPanelLabels}>
                      {
                        !rrr.upthrow && (<>

                          {
                            [...rrr.enableReuseContracts, ...rrr.enabledPolicies]
                              .filter((k) => k.checked)
                              .length === 0
                              ? (<div style={{
                                color: '#E9A923',
                                fontSize: 12,
                                lineHeight: '18px',
                                fontWeight: 400,
                              }}>未处理授权</div>)
                              : (<FComponentsLib.F_Contract_And_Policy_Labels
                                data={[...rrr.enableReuseContracts, ...rrr.enabledPolicies]
                                  .filter((k) => k.checked)
                                  .map((j) => {
                                    return {
                                      text: j.title,
                                      dot: '',
                                    };
                                  })}
                              />)
                          }

                        </>)

                      }
                      {
                        rrr.upthrow && (<label
                          className={styles.labelError}
                        >上抛</label>)
                      }
                    </div>
                  </>
                </div>
                <FComponentsLib.FCircleBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    return onDeleteResource(i.id);
                  }}
                  type='danger'
                />
              </div>

              <SmallNav
                // dataSource={i.unresolved || []}
                dataSource={i.children.map((k) => {
                  return resourceVersionCreatorPage.dependencies.find((l) => k.id === l.id) as DepResources[number];
                })}
                activatedID={resourceVersionCreatorPage.depActivatedID}
                onClick={(resourceID) => {
                  onChangeActiveID(resourceID);
                }}
              />

            </div>);
          },
        )}
  </div>;
}

interface SmallNavProps {
  dataSource: DepResources;
  activatedID: string | number;
  readonly onClick?: (resourceID: DepResources[number]['id']) => void;
}

function SmallNav({ dataSource, activatedID, onClick }: SmallNavProps) {
  if (dataSource.length === 0) {
    return null;
  }

  return (<div className={styles.children}>
    <div style={{ padding: '5px 0 5px 15px' }}>
      <FComponentsLib.FContentText
        type='additional2'
        // text={'此资源存在以下基础上抛'}
        text={FI18n.i18nNext.t('upcast')}
      />
    </div>
    {
      dataSource.map((i) => {
        return (
          <div
            key={i.id}
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(i.id);
            }}
            className={styles.childrenDepPanelNav + ' ' + (activatedID === i.id ? styles.DepPanelNavActive : '')}
          >
            <div className={styles.title}>
              <FTooltip title={i.title}><span>
                <FComponentsLib.FContentText
                  className={styles.titleText}
                  text={i.title}
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
                    if (i.error === 'storageObject') {
                      return goToObject(i.id);
                    }
                    return window.open(FUtil.LinkTo.resourceDetails({
                      resourceID: i.id,
                    }));
                  }}
                ><FFileSearch /></FComponentsLib.FTextBtn></span>
              </FTooltip>
              {/*<FComponentsLib.FTextBtn*/}
              {/*  onClick={(e) => {*/}
              {/*    e.stopPropagation();*/}
              {/*    // if (i.status === 3) {*/}
              {/*    if (i.error === 'storageObject') {*/}
              {/*      return goToObject(i.id);*/}
              {/*    }*/}
              {/*    return window.open(FUtil.LinkTo.resourceDetails({*/}
              {/*      resourceID: i.id,*/}
              {/*    }));*/}
              {/*  }}*/}
              {/*  type='default'*/}
              {/*></FComponentsLib.FTextBtn>*/}
              <div style={{ width: 5 }} />
              {/*{i.status === 0 && (<FResourceStatusBadge status={'offline'} />)}*/}
              {i.error === 'offline' && (<FResourceStatusBadge status={'offline'} />)}
              {/*{i.status === 2 && (<FForbid className={styles.titleErrorIcon} />)}*/}
              {i.error === 'cyclicDependency' && (<FForbid className={styles.titleErrorIcon} />)}
              {/*{i.status === 3 && (<FForbid className={styles.titleErrorIcon} />)}*/}
              {i.error === 'storageObject' && (<FForbid className={styles.titleErrorIcon} />)}
              {/*{i.status === 4 && (<FUpcast className={styles.titleErrorIcon} />)}*/}
              {i.error === 'upThrow' && (<FUpcast className={styles.titleErrorIcon} />)}
              {i.error === 'freeze' && (<FForbid className={styles.titleErrorIcon} />)}
              {i.error === '' && i.warning === 'authException' && (
                <FTooltip title={'存在授权问题'}><FWarning style={{ fontSize: 14 }} /></FTooltip>)}
              {i.error === '' && i.warning === 'ownerFreeze' && (
                <FTooltip title={'该资源发行方账号因违规已被冻结'}><FWarning style={{ fontSize: 14 }} /></FTooltip>)}
            </div>
            <div style={{ height: 5 }} />
            <FComponentsLib.FContentText type='additional2'>
              <div>{i.resourceType || '暂无类型'}</div>
            </FComponentsLib.FContentText>
            <>
              <div style={{ height: 5 }} />
              <div className={styles.DepPanelLabels}>
                {/*{*/}
                {/*  !i.upthrow && [...i.enableReuseContracts, ...i.enabledPolicies]*/}
                {/*    .filter((k) => k.checked)*/}
                {/*    .map((j) => (<label*/}
                {/*      key={j.id}*/}
                {/*      className={styles.labelInfo}*/}
                {/*    >{j.title}</label>))*/}
                {/*}*/}
                {
                  !i.upthrow && [...i.enableReuseContracts, ...i.enabledPolicies]
                    .filter((k) => k.checked).length === 0
                    ? (<div style={{
                      color: '#E9A923',
                      fontSize: 12,
                      lineHeight: '18px',
                      fontWeight: 400,
                    }}>未处理授权</div>)
                    : (<FComponentsLib.F_Contract_And_Policy_Labels
                      data={[...i.enableReuseContracts, ...i.enabledPolicies]
                        .filter((k) => k.checked)
                        .map((j) => {
                          return {
                            text: j.title,
                            dot: '',
                          };
                        })}
                    />)
                }
                {
                  i.upthrow && (<label
                    className={styles.labelError}
                  >上抛</label>)
                }
              </div>
            </>
          </div>);
      })
    }

  </div>);
}

export default connect(({ resourceVersionCreatorPage }: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(Resources);

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
