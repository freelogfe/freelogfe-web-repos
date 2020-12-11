import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {EditOutlined, CloseCircleFilled} from '@ant-design/icons';
// import VersionPopover from './VersionPopover';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {
  ChangeAction,
  DeleteDependencyByIDAction,
  DepResources,
  // OnChangeDepActivatedIDAction,
  // OnChangeDependenciesByIDAction
} from '@/models/resourceVersionCreatorPage';
import {i18nMessage} from '@/utils/i18n';
import FVersionHandlerPopover from '@/components/FVersionHandlerPopover';

export interface ResourcesProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

type T = DepResources[0];

interface DataS extends T {
  unresolved: DepResources;
}

function Resources({dispatch, resourceVersionCreatorPage}: ResourcesProps) {

  // React.useEffect(() => {
  //   if (!dependencies.map((i) => i.id).includes(depActivatedID)) {
  //     if (depRelationship.length > 0) {
  //       onChangeResourcesActivated(depRelationship[0].id);
  //     } else {
  //       onChangeResourcesActivated('');
  //     }
  //   }
  // }, [depActivatedID, depRelationship, onChangeResourcesActivated]);

  // const dataSource: DataS[] = depRelationship.map((i) => {
  //   return {
  //     ...(dependencies.find((j) => j.id === i.id) as DepResources[number]),
  //     unresolved: i.children.map((k) => {
  //       return dependencies.find((l) => k.id === l.id) as DepResources[number];
  //     })
  //   }
  // });

  // console.log(dataSource, 'dataSourcedsssssdataSourcedataSource#@#@#@#@#');

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
      }
    });
  }

  // function onChangeResourcesActivated(id: DepResources[number]['id']) {
  //   dispatch<OnChangeDepActivatedIDAction>({
  //     type: 'resourceVersionCreatorPage/onChangeDepActivatedID',
  //     payload: id,
  //   });
  // }

  function onDeleteResource(id: DepResources[number]['id']) {

    dispatch<DeleteDependencyByIDAction>({
      type: 'resourceVersionCreatorPage/deleteDependencyByID',
      payload: id,
    });
    // return onChange && onChange();
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
    });
  }

  return <div className={styles.styles}>
    {
      resourceVersionCreatorPage.depRelationship.map((i) => {
          const rrr: ResourceVersionCreatorPageModelState['dependencies'][number] = resourceVersionCreatorPage.dependencies
            .find((dds) => dds.id === i.id) as ResourceVersionCreatorPageModelState['dependencies'][number];
          return (<div key={rrr.id}>
            <div
              onClick={() => {
                onChangeActiveID(rrr.id);
              }}
              className={styles.DepPanelNav + ' ' + (rrr.id === resourceVersionCreatorPage.depActivatedID ? styles.DepPanelNavActive : '')}>
              <div>
                <div className={styles.title}>
                  <FContentText text={rrr.title}/>
                  {rrr.status !== 1 && <CloseCircleFilled className={styles.titleErrorIcon}/>}
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
                      style={{paddingRight: 5}}>{i18nMessage('version_range')}：{rrr.versionRange}</span>
                          <FVersionHandlerPopover
                            value={rrr.versionRange}
                            versionOptions={rrr.versions}
                            onChange={(version) => onChangeVersion(version, i.id)}
                          ><EditOutlined/></FVersionHandlerPopover>
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
              <FCircleButton
                onClick={(e) => {
                  e.stopPropagation();
                  return onDeleteResource(i.id)
                }}
                theme='delete'
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
    <div style={{padding: '5px 0 5px 20px'}}>
      <FContentText
        type="additional2"
        // text={'此资源存在以下基础上抛'}
        text={i18nMessage('upcast')}
      />
    </div>
    {
      dataSource.map((i) => (
        <div
          key={i.id}
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(i.id);
          }}
          className={styles.childrenDepPanelNav + ' ' + (activatedID === i.id ? styles.DepPanelNavActive : '')}>
          <FContentText text={i.title}/>
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
              {/*{i18nMessage('info_upcast')}*/}
              {
                i.upthrow && (<label
                  className={styles.labelError}
                >上抛</label>)
              }
            </div>
          </>
        </div>))
    }

  </div>);
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(Resources);
