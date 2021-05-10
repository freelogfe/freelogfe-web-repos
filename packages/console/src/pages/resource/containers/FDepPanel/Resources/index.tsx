import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FCircleBtn, FCircleButton, FTextBtn, FTextButton} from '@/components/FButton';
import {EditOutlined, CloseCircleFilled} from '@ant-design/icons';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {
  ChangeAction,
  DeleteDependencyByIDAction,
  DepResources,
} from '@/models/resourceVersionCreatorPage';
// import {i18nMessage} from '@/utils/i18n';
import FVersionHandlerPopover from '@/components/FVersionHandlerPopover';
import FUtil from "@/utils";
import {FApiServer} from "@/services";
import FResourceStatusBadge from "@/components/FResourceStatusBadge";
import {FEdit} from "@/components/FIcons";

export interface ResourcesProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

type T = DepResources[0];

interface DataS extends T {
  unresolved: DepResources;
}

function Resources({dispatch, resourceVersionCreatorPage}: ResourcesProps) {

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
                    <FTextBtn
                      onClick={(e) => {
                        e.stopPropagation();
                        if (rrr.status === 3) {
                          return goToObject(rrr.id);
                        }
                        return window.open(FUtil.LinkTo.resourceDetails({
                          resourceID: rrr.id,
                        }));
                      }}
                      type="default"
                    >
                      <FContentText
                        className={styles.titleText}
                        text={rrr.title}
                        singleRow
                        type="highlight"
                      />
                    </FTextBtn>
                    <div style={{width: 5}}/>
                    {rrr.status === 0 && (<FResourceStatusBadge status={'offline'}/>)}
                    {rrr.status !== 1 && rrr.status !== 0 && (<CloseCircleFilled className={styles.titleErrorIcon}/>)}
                  </div>
                  <div style={{height: 9}}/>
                  <FContentText type="additional2">
                    <div>
                      {/*{rrr.resourceType || '暂无类型'}*/}
                      {rrr.resourceType}
                      {rrr.resourceType ? ' | ' : ''}
                      {
                        rrr.versions?.length === 0
                          ? <span style={{paddingRight: 5}}>暂无版本</span>
                          : <>
                    <span
                      style={{paddingRight: 5}}>{FUtil.I18n.message('version_range')}：{rrr.versionRange}</span>
                            <FVersionHandlerPopover
                              value={rrr.versionRange}
                              versionOptions={rrr.versions}
                              onChange={(version) => onChangeVersion(version, i.id)}
                            ><FEdit style={{fontSize: 14}}/></FVersionHandlerPopover>
                          </>
                      }
                    </div>
                  </FContentText>
                  <>
                    <div style={{height: 5}}/>
                    <div className={styles.DepPanelLabels}>
                      {
                        !rrr.upthrow && [...rrr.enableReuseContracts, ...rrr.enabledPolicies]
                          .filter((k) => k.checked)
                          .map((j) => (<label
                            key={j.id}
                            className={styles.labelInfo}
                          >{j.title}</label>))
                      }
                      {
                        rrr.upthrow && (<label
                          className={styles.labelError}
                        >上抛</label>)
                      }
                    </div>
                  </>
                </div>
                <FCircleBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    return onDeleteResource(i.id)
                  }}
                  type="danger"
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
          }
        )}
  </div>
}

interface SmallNavProps {
  dataSource: DepResources;
  activatedID: string | number;
  readonly onClick?: (resourceID: DepResources[number]['id']) => void;
}

function SmallNav({dataSource, activatedID, onClick}: SmallNavProps) {
  if (dataSource.length === 0) {
    return null;
  }

  return (<div className={styles.children}>
    <div style={{padding: '5px 0 5px 15px'}}>
      <FContentText
        type="additional2"
        // text={'此资源存在以下基础上抛'}
        text={FUtil.I18n.message('upcast')}
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
              <FTextBtn
                onClick={(e) => {
                  e.stopPropagation();
                  if (i.status === 3) {
                    return goToObject(i.id);
                  }
                  return window.open(FUtil.LinkTo.resourceDetails({
                    resourceID: i.id,
                  }));
                }}
                type="default"
              >
                <FContentText
                  className={styles.titleText}
                  text={i.title}
                  singleRow
                  type="highlight"
                />
              </FTextBtn>
              <div style={{width: 5}}/>
              {i.status === 0 && (<FResourceStatusBadge status={'offline'}/>)}
              {i.status !== 1 && i.status !== 0 && (<CloseCircleFilled className={styles.titleErrorIcon}/>)}
            </div>
            <div style={{height: 5}}/>
            <FContentText type="additional2">
              <div>{i.resourceType || '暂无类型'}</div>
            </FContentText>
            <>
              <div style={{height: 5}}/>
              <div className={styles.DepPanelLabels}>
                {
                  !i.upthrow && [...i.enableReuseContracts, ...i.enabledPolicies]
                    .filter((k) => k.checked)
                    .map((j) => (<label
                      key={j.id}
                      className={styles.labelInfo}
                    >{j.title}</label>))
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

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(Resources);

async function goToObject(id: string) {
  const {data} = await FApiServer.Storage.objectDetails({
    objectIdOrName: id,
  });
  // console.log(data, 'data!Q@#$@#$!@#$@#$@!#$!@#$');
  window.open(FUtil.LinkTo.objectDetails({
    objectID: data.objectId,
    bucketName: data.bucketName,
  }));
}
