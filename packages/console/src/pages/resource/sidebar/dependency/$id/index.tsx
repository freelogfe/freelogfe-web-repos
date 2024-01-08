import * as React from 'react';
import styles from './index.less';
import { OnChange_Page_Action, OnMount_Page_Action as OnMount_Sidebar_Action } from '@/models/resourceSider';
import { RouteComponentProps } from 'react-router/index';
import { Dispatch } from 'redux';
// import { OnMount_DependencyPage_Action, ResourceAuthPageModelState } from '@/models/resourceAuthPage';
import * as AHooks from 'ahooks';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import FMicroAPP_Authorization from '@/components/FMicroAPP_Authorization';
import { OnMount_Page_Action, ResourceDependencyPageState } from '@/models/resourceDependencyPage';

interface DependencyProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  resourceDependencyPage: ResourceDependencyPageState;
}

function Dependency({ dispatch, resourceDependencyPage, match }: DependencyProps) {

  AHooks.useMount(async () => {
    dispatch<OnMount_Sidebar_Action>({
      type: 'resourceSider/onMount_Page',
      payload: {
        resourceID: match.params.id,
      },
    });
    dispatch<OnChange_Page_Action>({
      type: 'resourceSider/onChange_Page',
      payload: {
        page: 'dependency',
      },
    });
    dispatch<OnMount_Page_Action>({
      type: 'resourceDependencyPage/onMount_Page',
      payload: {
        resourceID: match.params.id,
      },
    });
  });

  return (<>
    <div>
      <div style={{ height: 40 }} />
      {
        resourceDependencyPage.directDependencies.length > 0 && (<div className={styles.block}>
          <FMicroAPP_Authorization
            licenseeId={resourceDependencyPage.resourceID}
            mainAppType={'resourceDepAuth'}
            depList={resourceDependencyPage.directDependencies}
            upcastList={resourceDependencyPage.baseUpcastResources}
            // applyVersions={[]}
            update={(value) => {

            }}
          />
        </div>)
      }

      {/*<div className={styles.block}>*/}
      {/*<FComponentsLib.FContentText text={'依赖授权管理'} type={'highlight'} />*/}

      {/*{*/}
      {/*  resourceAuthPage.contractsAuthorized.length === 0 && resourceAuthPage.baseUastResources.length === 0 && (<>*/}
      {/*    <div style={{ height: 10 }} />*/}
      {/*    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>*/}
      {/*      <FComponentsLib.FContentText text={'暂无合约'} type={'additional2'} />*/}
      {/*    </div>*/}
      {/*  </>)*/}
      {/*}*/}

      {/*{*/}
      {/*  resourceAuthPage.baseUastResources.length > 0 && (<>*/}
      {/*    <div style={{ height: 20 }} />*/}
      {/*    <FBasicUpcastCard*/}
      {/*      dataSource={resourceAuthPage.baseUastResources.map((bur) => {*/}
      {/*        return {*/}
      {/*          resourceID: bur.resourceId,*/}
      {/*          resourceName: bur.resourceName,*/}
      {/*        };*/}
      {/*      })}*/}
      {/*      onClick={(resourceID) => {*/}
      {/*        window.open(FUtil.LinkTo.resourceDetails({*/}
      {/*          resourceID: resourceID,*/}
      {/*        }));*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </>)*/}
      {/*}*/}

      {/*{*/}
      {/*  resourceAuthPage.contractsAuthorized.length > 0 && (<>*/}
      {/*    <div style={{ height: 20 }} />*/}
      {/*    <FAuthPanel />*/}
      {/*  </>)*/}
      {/*}*/}
      {/*</div>*/}
      <div style={{ height: 100 }} />
    </div>
  </>);
}

export default withRouter(connect(({ resourceDependencyPage }: ConnectState) => ({
  resourceDependencyPage: resourceDependencyPage,
}))(Dependency));
