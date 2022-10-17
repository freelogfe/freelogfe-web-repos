import * as React from 'react';
import styles from './index.less';
import FPolicies from '@/pages/resource/containers/FPolicies';
import FAuthPanel from './FAuthPanel';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import {
  ConnectState,
  ResourceAuthPageModelState,
  ResourceInfoModelState,
} from '@/models/connect';
import {
  ChangeAction,
  FetchAuthorizeAction,
  FetchAuthorizedAction,
  FetchResourceInfoAction,
} from '@/models/resourceAuthPage';
import { withRouter } from 'umi';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/resource/containers/Sider';
import FFormLayout from '@/components/FFormLayout';
import { FNodes, FUser } from '@/components/FIcons';
import { FUtil, FI18n } from '@freelog/tools-lib';
import FContractDetailsDrawer from '@/components/FContractDetailsDrawer';
import FTable from '@/components/FTable';
import FResource from '@/components/FIcons/FResource';
import { ColumnsType } from 'antd/lib/table/interface';
import { RouteComponentProps } from 'react-router';
import FBasicUpcastCard from '@/components/FBasicUpcastCard';
import { Helmet } from 'react-helmet';
import FComponentsLib from '@freelog/components-lib';

interface AuthProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
  resourceInfo: ResourceInfoModelState,
}

function Auth({ dispatch, resourceAuthPage, resourceInfo, match }: AuthProps) {

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'resourceAuthPage/change',
      payload: {
        resourceID: match.params.id,
      },
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
  }, [dispatch, match.params.id]);

  const columns: ColumnsType<ResourceAuthPageModelState['contractsAuthorize'][number]> = [
    {
      title: (<FComponentsLib.FTitleText
        // text={FUtil.I18n.message('contract_name') + '｜' + FUtil.I18n.message('contract_id')}
        text={'被授权方'}
        type='table'
      />),
      dataIndex: 'authorized',
      width: 300,
      render: (_: any, record) => {
        return (<Space size={5}>
          {
            record.licenseeIdentityType === 'resource' && (<FResource />)
          }
          {
            record.licenseeIdentityType === 'node' && (<FNodes />)
          }
          {
            record.licenseeIdentityType === 'user' && (<FUser />)
          }
          <FComponentsLib.FContentText
            type='highlight'
            text={record.authorizedParty}
          />
        </Space>);
      },
    },
    {
      title: (<FComponentsLib.FTitleText
        // text={FUtil.I18n.message('contract_name') + '｜' + FUtil.I18n.message('contract_id')}
        text={'所签授权策略｜合约状态'}
        type='table'
      />),
      // className: 'column-money',
      dataIndex: 'contract',
      width: 240,
      // align: 'right',
      render: (_: any, record) => {
        //  (<FContentText text={record.authorizedParty}/>)
        return (<div>
          <Space size={5}>
            <FComponentsLib.FContentText
              type='highlight'
              text={record.contractName}
            />
            <FComponentsLib.FContractStatusBadge
              status={record.status}
            />
          </Space>
          <div style={{ height: 5 }} />
          <FComponentsLib.FContentText type='additional2' text={'创建时间：' + record.createDate} />
          <FComponentsLib.FContentText type='additional2' text={'合约ID：' + record.contractID} />
        </div>);
      },
    },
    {
      // title: FUtil.I18n.message('contract_signed_time'),
      title: (<FComponentsLib.FTitleText
        // text={FUtil.I18n.message('contract_name') + '｜' + FUtil.I18n.message('contract_id')}
        text={'操作'}
        type='table'
      />),
      dataIndex: 'operation',
      width: 80,
      render: (_: any, record) => {
        return (<FComponentsLib.FTextBtn onClick={() => {
          onChange({
            detailContractID: record.contractID,
          });

        }}>查看合约</FComponentsLib.FTextBtn>);
      },
    },
  ];

  function onChange(payload: Partial<ResourceAuthPageModelState>) {
    dispatch<ChangeAction>({
      type: 'resourceAuthPage/change',
      payload: payload,
    });
  }

  return (<>
    <Helmet>
      <title>{`授权信息 · ${resourceInfo.info?.resourceName || ''}  - Freelog`}</title>
    </Helmet>
    <FLeftSiderLayout
      sider={<Sider />}
      header={<FComponentsLib.FTitleText
        text={FI18n.i18nNext.t('authorization_infomation')}
        type='h1'
      />}>
      <FFormLayout>
        <FFormLayout.FBlock
          dot={resourceAuthPage.policies.length === 0}
          title={FI18n.i18nNext.t('authorization_plan')}
          extra={resourceAuthPage.policies?.length !== 0 && (<Space size={5}>
            <FComponentsLib.FCircleBtn
              size='small'
              onClick={() => {
                dispatch<ChangeAction>({
                  type: 'resourceAuthPage/change',
                  payload: {
                    policyEditorVisible: true,
                  },
                });
              }}
            />
            <FComponentsLib.FTextBtn type='primary' onClick={() => {
              dispatch<ChangeAction>({
                type: 'resourceAuthPage/change',
                payload: {
                  policyEditorVisible: true,
                },
              });
            }}>添加策略</FComponentsLib.FTextBtn>
          </Space>)}
        >
          <FPolicies />

        </FFormLayout.FBlock>

        <FFormLayout.FBlock title={FI18n.i18nNext.t('licencee_contract')}>

          <Space style={{ width: '100%' }} direction='vertical' size={20}>
            {
              resourceAuthPage.baseUastResources.length > 0 && (<FBasicUpcastCard
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
              />)
            }

            {
              resourceAuthPage.contractsAuthorized.length > 0
                ? (<FAuthPanel />)
                : ((<FComponentsLib.FContentText type='negative' text={'暂无合约'} />))
            }
          </Space>

        </FFormLayout.FBlock>

        <FFormLayout.FBlock title={FI18n.i18nNext.t('authorizing_contracts')}>

          {
            resourceAuthPage.contractsAuthorize?.length > 0
              ? (<FTable
                columns={columns}
                dataSource={resourceAuthPage.contractsAuthorize}
                pagination={false}
              />)
              : (<FComponentsLib.FContentText type='negative' text={'暂无合约'} />)
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
    </FLeftSiderLayout>
  </>);
}

export default withRouter(connect(({ resourceAuthPage, resourceInfo }: ConnectState) => ({
  resourceAuthPage: resourceAuthPage,
  resourceInfo: resourceInfo,
}))(Auth));
