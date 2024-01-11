import * as React from 'react';
import styles from './index.less';
import {
  OnChange_Page_Action,
  OnMount_Page_Action as OnMount_Sidebar_Action,
  OnUpdate_Data_Action,
} from '@/models/resourceSider';
import { RouteComponentProps } from 'react-router/index';
import { Dispatch } from 'redux';
import * as AHooks from 'ahooks';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import FMicroAPP_Authorization from '@/components/FMicroAPP_Authorization';
import {
  OnMount_Page_Action,
  OnUnmount_Page_Action,
  ResourceDependencyPageState,
} from '@/models/resourceDependencyPage';

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

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_Page_Action>({
      type: 'resourceDependencyPage/onUnmount_Page',
    });
  });

  return (<>
    <div>
      <div style={{ height: 40 }} />
      <div className={styles.block}>
        {
          resourceDependencyPage.reload !== 0 && (<FMicroAPP_Authorization
            licenseeId={resourceDependencyPage.resourceID}
            mainAppType={'resourceDepAuth'}
            depList={resourceDependencyPage.directDependencies}
            upcastList={resourceDependencyPage.baseUpcastResources}
            reload={resourceDependencyPage.reload}
            // applyVersions={[]}
            update={(value) => {
              dispatch<OnUpdate_Data_Action>({
                type: 'resourceSider/onUpdate_Data',
                // payload: resourceAuthPage.resourceID,
              });
            }}
          />)
        }

      </div>
      <div style={{ height: 100 }} />
    </div>
  </>);
}

export default withRouter(connect(({ resourceDependencyPage }: ConnectState) => ({
  resourceDependencyPage: resourceDependencyPage,
}))(Dependency));
