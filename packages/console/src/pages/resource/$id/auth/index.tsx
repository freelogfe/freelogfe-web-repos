import * as React from 'react';

import styles from './index.less';
import FPolicies from '@/pages/resource/containers/FPolicies';
import {FTitleText, FContentText} from '@/components/FText';
import FAuthPanel from '@/pages/resource/containers/FAuthPanel';
import StatusLabel from '@/pages/resource/components/StatusLabel';
import {Table} from 'antd';
import {connect, Dispatch} from 'dva';
import {
  ConnectState,
  ResourceAuthPageModelState,
  ResourceInfoModelState,
} from '@/models/connect';
import {
  ChangeAction,
  FetchAuthorizeAction,
  FetchAuthorizedAction, FetchResourceInfoAction,
} from '@/models/resourceAuthPage';
import {ChangeAction as GlobalChangeAction} from '@/models/global';
import {RouterTypes, withRouter} from 'umi';
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import Sider from "@/pages/resource/layouts/FInfoLayout/Sider";
import FFormLayout from "@/layouts/FFormLayout";
import {FAdd, FInfo} from "@/components/FIcons";
import FUtil from "@/utils";
import {FCircleBtn, FNormalButton, FRectBtn} from "@/components/FButton";

const columns: any[] = [
  {
    title: FUtil.I18n.message('contract_name') + '｜' + FUtil.I18n.message('contract_id'),
    dataIndex: 'name',
    render: (_: any, record: any) => (<>
      <FContentText text={record.contractName}/>
      <div style={{height: 2}}/>
      <FContentText type="additional2" text={record.contractID}/>
    </>),
  },
  {
    title: FUtil.I18n.message('licensee'),
    // className: 'column-money',
    dataIndex: 'authorizedParties',
    // align: 'right',
    render: (_: any, record: any) => (<FContentText text={record.authorizedParty}/>)
  },
  {
    title: FUtil.I18n.message('contract_signed_time'),
    dataIndex: 'createTime',
    render: (_: any, record: any) => (<FContentText text={record.createDate}/>)
  },
  {
    title: FUtil.I18n.message('contract_state'),
    dataIndex: 'contractStatus',
    render: (_: any, record: any) => (<StatusLabel status={record.status}/>)
  },
];

interface AuthProps {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
  resourceInfo: ResourceInfoModelState,
  match: {
    params: {
      id: string,
    }
  }
}

function Auth({dispatch, route, resourceAuthPage, match, resourceInfo}: AuthProps & RouterTypes) {

  React.useEffect(() => {
    // console.log(route, match, 'RM');
    dispatch<GlobalChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'resourceAuthPage/change',
      payload: {
        resourceID: match.params.id,
      }
    });

    dispatch<FetchResourceInfoAction>({
      type: 'resourceAuthPage/fetchResourceInfo',
      // payload: data.resourceId,
    });

    dispatch<FetchAuthorizeAction>({
      type: 'resourceAuthPage/fetchAuthorize',
      // payload: data.resourceId,
    });

    dispatch<FetchAuthorizedAction>({
      type: 'resourceAuthPage/fetchAuthorized',
      payload: {},
    });
  }, []);

  return (<FLeftSiderLayout
    sider={<Sider/>}
    header={<FTitleText
      text={FUtil.I18n.message('authorization_infomation')}
      type="h1"
    />}>
    <FFormLayout>
      <FFormLayout.FBlock
        title={FUtil.I18n.message('authorization_plan')}
        extra={resourceAuthPage.policies?.length !== 0 && (<FCircleBtn
          size="small"
          onClick={() => {
            dispatch<ChangeAction>({
              type: 'resourceAuthPage/change',
              payload: {
                policyEditorVisible: true,
              }
            });
          }}
        />)}
      >
        <FPolicies/>
      </FFormLayout.FBlock>
      {
        (resourceAuthPage.contractsAuthorized.length > 0 || resourceAuthPage.baseUpcastResources.length > 0) && (
          <FFormLayout.FBlock title={FUtil.I18n.message('licencee_contract')}>

            {
              resourceAuthPage.baseUpcastResources.length > 0 && (<div className={styles.depUpthrow}>
                <div className={styles.tip}>
                  <FTitleText
                    text={FUtil.I18n.message('basic_upcast')}
                    type="form"
                  />
                  <div style={{width: 5}}/>
                  <FInfo style={{color: '#C7C7C7'}}/>
                </div>
                <div className={styles.depUpthrowLabel}>
                  {
                    resourceAuthPage.baseUpcastResources.map((j) => <label key={j.resourceId}>{j.resourceName}</label>)
                  }
                </div>
              </div>)
            }

            {
              resourceAuthPage.baseUpcastResources.length > 0 && resourceAuthPage.contractsAuthorized.length > 0 && (
                <div style={{height: 20}}/>)
            }

            {
              resourceAuthPage.contractsAuthorized.length > 0 && (<FAuthPanel
                dataSource={resourceAuthPage.contractsAuthorized}
                onChangeActivatedResource={(value) => dispatch<ChangeAction>({
                  type: 'resourceAuthPage/change',
                  payload: {
                    contractsAuthorized: value,
                  },
                })}
              />)
            }

          </FFormLayout.FBlock>)
      }

      <FFormLayout.FBlock title={FUtil.I18n.message('authorizing_contracts')}>

        {
          resourceAuthPage.contractsAuthorize?.length > 0
            ? (<Table
              columns={columns}
              dataSource={resourceAuthPage.contractsAuthorize}
              bordered
              pagination={false}
              // title={() => 'Header'}
              // footer={() => 'Footer'}
            />)
            : (<FContentText type="additional1" text={'暂无合约'}/>)
        }

      </FFormLayout.FBlock>
    </FFormLayout>
  </FLeftSiderLayout>);
}

export default withRouter(connect(({resourceAuthPage, resourceInfo}: ConnectState) => ({
  resourceAuthPage: resourceAuthPage,
  resourceInfo: resourceInfo,
}))(Auth));
