import * as React from 'react';

import styles from './index.less';
import FPolicies from '@/pages/resource/containers/FPolicies';
import {FTitleText, FContentText} from '@/components/FText';
import FAuthPanel from '@/pages/resource/containers/FAuthPanel';
import {Space, Table} from 'antd';
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
import {RouterTypes, withRouter} from 'umi';
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import Sider from "@/pages/resource/layouts/FInfoLayout/Sider";
import FFormLayout from "@/layouts/FFormLayout";
import {FInfo, FNodes, FUser} from "@/components/FIcons";
import FUtil from "@/utils";
import {FCircleBtn, FTextBtn} from "@/components/FButton";
import FContractDetailsDrawer from "@/components/FContractDetailsDrawer";
import FTable from "@/components/FTable";
import FResource from "@/components/FIcons/FResource";
import {ColumnsType} from "antd/lib/table/interface";
import FContractStatusBadge from "@/components/FContractStatusBadge";

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

  // React.useEffect(() => {
  //   // console.log(route, match, 'RM');
  //   dispatch<GlobalChangeAction>({
  //     type: 'global/change',
  //     payload: {
  //       route: route,
  //     },
  //   });
  // }, [route]);

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

  const columns: ColumnsType<{
    key: string,
    contractName: string,
    contractID: string,
    authorizedParty: string,
    licenseeIdentityType: 1 | 2 | 3;
    createDate: string,
    status: 0 | 1 | 2;
  }> = [
    {
      title: (<FTitleText
        // text={FUtil.I18n.message('contract_name') + '｜' + FUtil.I18n.message('contract_id')}
        text={'被授权方'}
        type="h4"
      />),
      dataIndex: 'authorized',
      width: 300,
      render: (_: any, record) => {
        return (<Space size={5}>
          {
            record.licenseeIdentityType === 1 && (<FResource/>)
          }
          {
            record.licenseeIdentityType === 2 && (<FNodes/>)
          }
          {
            record.licenseeIdentityType === 3 && (<FUser/>)
          }
          <FContentText
            type="highlight"
            text={record.authorizedParty}
          />
        </Space>);
      },
    },
    {
      title: (<FTitleText
        // text={FUtil.I18n.message('contract_name') + '｜' + FUtil.I18n.message('contract_id')}
        text={'所签授权策略｜合约状态'}
        type="h4"
      />),
      // className: 'column-money',
      dataIndex: 'contract',
      width: 240,
      // align: 'right',
      render: (_: any, record) => {
        //  (<FContentText text={record.authorizedParty}/>)
        return (<div>
          <Space size={5}>
            <FContentText
              type="highlight"
              text={record.contractName}
            />
            <FContractStatusBadge
              status={FUtil.Predefined.EnumContractStatus[record?.status || 0] as 'authorized'}
            />
          </Space>
          <div style={{height: 5}}/>
          <FContentText type="additional2" text={'创建时间：' + record.createDate}/>
          <FContentText type="additional2" text={'合约ID：' + record.contractID}/>
        </div>);
      }
    },
    {
      // title: FUtil.I18n.message('contract_signed_time'),
      title: (<FTitleText
        // text={FUtil.I18n.message('contract_name') + '｜' + FUtil.I18n.message('contract_id')}
        text={'操作'}
        type="h4"
      />),
      dataIndex: 'operation',
      width: 80,
      render: (_: any, record) => {
        return (<FTextBtn onClick={() => {
          onChange({
            detailContractID: record.contractID,
          });

        }}>查看合约</FTextBtn>);
      },
    },
  ];

  function onChange(payload: Partial<ResourceAuthPageModelState>) {
    dispatch<ChangeAction>({
      type: 'resourceAuthPage/change',
      payload: payload,
    });
  }

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
                    type="h4"
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
              resourceAuthPage.contractsAuthorized.length > 0 && (<FAuthPanel/>)
            }

          </FFormLayout.FBlock>)
      }

      <FFormLayout.FBlock title={FUtil.I18n.message('authorizing_contracts')}>

        {
          resourceAuthPage.contractsAuthorize?.length > 0
            ? (<FTable
              columns={columns}
              dataSource={resourceAuthPage.contractsAuthorize}
              pagination={false}
            />)
            : (<FContentText type="additional1" text={'暂无合约'}/>)
        }

        <FContractDetailsDrawer
          contractID={resourceAuthPage.detailContractID}
          onClose={() => {
            onChange({
              detailContractID: '',
            });
          }}
        />

      </FFormLayout.FBlock>
    </FFormLayout>
  </FLeftSiderLayout>);
}

export default withRouter(connect(({resourceAuthPage, resourceInfo}: ConnectState) => ({
  resourceAuthPage: resourceAuthPage,
  resourceInfo: resourceInfo,
}))(Auth));
