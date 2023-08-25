import * as React from 'react';
import styles from './index.less';
import { OnChange_Page_Action, OnMount_Page_Action as OnMount_Sidebar_Action } from '@/models/resourceSider';
import { RouteComponentProps } from 'react-router/index';
import { Dispatch } from 'redux';
import { OnMount_DependencyPage_Action, ResourceAuthPageModelState } from '@/models/resourceAuthPage';
import * as AHooks from 'ahooks';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FUtil } from '@freelog/tools-lib';
import FAuthPanel from '@/pages/resource/auth/$id/FAuthPanel';
import FBasicUpcastCard from '@/components/FBasicUpcastCard';

interface DependencyProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function Dependency({ dispatch, resourceAuthPage, match }: DependencyProps) {

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
    dispatch<OnMount_DependencyPage_Action>({
      type: 'resourceAuthPage/onMount_DependencyPage',
      payload: {
        resourceID: match.params.id,
      },
    });
  });

  return (<>
    <div>
      <div style={{ height: 40 }} />
      <div className={styles.block}>
        <FComponentsLib.FContentText text={FI18n.i18nNext.t('licencee_contract')} type={'highlight'} />

        {
          resourceAuthPage.contractsAuthorized.length === 0 && resourceAuthPage.baseUastResources.length === 0 && (<>
            <div style={{ height: 10 }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FComponentsLib.FContentText text={'暂无合约'} type={'additional2'} />
            </div>
          </>)
        }

        {
          resourceAuthPage.baseUastResources.length > 0 && (<>
            <div style={{ height: 20 }} />
            <FBasicUpcastCard
              dataSource={resourceAuthPage.baseUastResources.map((bur) => {
                return {
                  resourceID: bur.resourceId,
                  resourceName: bur.resourceName,
                };
              })}
              onClick={(resourceID) => {
                window.open(FUtil.LinkTo.resourceDetails({
                  resourceID: resourceID,
                }));
              }}
            />
          </>)
        }

        {
          resourceAuthPage.contractsAuthorized.length > 0 && (<>
            <div style={{ height: 20 }} />
            <FAuthPanel />
          </>)
        }
      </div>
      <div style={{ height: 100 }} />
    </div>
  </>);
}

export default withRouter(connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage: resourceAuthPage,
}))(Dependency));
