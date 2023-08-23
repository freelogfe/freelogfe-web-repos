import * as React from 'react';
import styles from './index.less';
import FPolicies from '../../containers/FPolicies';
import FAuthPanel from './FAuthPanel';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import {
  ConnectState,
  ResourceAuthPageModelState,
  // ResourceInfoModelState,
} from '@/models/connect';
import {
  ChangeAction,
  FetchAuthorizeAction,
  FetchAuthorizedAction,
  FetchResourceInfoAction,
  OnAdd_Policy_Action,
} from '@/models/resourceAuthPage';
import { withRouter } from 'umi';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/resource/containers/Sider';
import FFormLayout from '@/components/FFormLayout';
import { FUtil, FI18n } from '@freelog/tools-lib';
import FContractDetailsDrawer from '@/components/FContractDetailsDrawer';
import FTable from '@/components/FTable';
import { ColumnsType } from 'antd/lib/table/interface';
import { RouteComponentProps } from 'react-router';
import FBasicUpcastCard from '@/components/FBasicUpcastCard';
import { Helmet } from 'react-helmet';
import FComponentsLib from '@freelog/components-lib';
import * as AHooks from 'ahooks';
import FSkeletonNode from '@/components/FSkeletonNode';

interface AuthProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
  // resourceInfo: ResourceInfoModelState,
}

function Auth({ dispatch, resourceAuthPage, match }: AuthProps) {

  AHooks.useMount(async () => {
    await dispatch<ChangeAction>({
      type: 'resourceAuthPage/change',
      payload: {
        resourceID: match.params.id,
        pageState: 'loading',
      },
    });

    await dispatch<FetchResourceInfoAction>({
      type: 'resourceAuthPage/fetchResourceInfo',
      // payload: data.resourceId,
    });

    await dispatch<FetchAuthorizeAction>({
      type: 'resourceAuthPage/fetchAuthorize',
      // payload: data.resourceId,
    });

    await dispatch<FetchAuthorizedAction>({
      type: 'resourceAuthPage/fetchAuthorized',
      payload: {},
    });

    await FUtil.Tool.promiseSleep(1000);
    await dispatch<ChangeAction>({
      type: 'resourceAuthPage/change',
      payload: {
        pageState: 'loaded',
      },
    });
  });

  AHooks.useUnmount(() => {

  });

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
            record.licenseeIdentityType === 'resource' && (<FComponentsLib.FIcons.FResource />)
          }
          {
            record.licenseeIdentityType === 'node' && (<FComponentsLib.FIcons.FNodes />)
          }
          {
            record.licenseeIdentityType === 'user' && (<FComponentsLib.FIcons.FUser />)
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
      <title>{`授权信息 · ${resourceAuthPage.resourceName || ''}  - Freelog`}</title>
    </Helmet>
    <FLeftSiderLayout
      sider={<Sider />}
      header={(<FComponentsLib.FTitleText
        text={FI18n.i18nNext.t('authorization_infomation')}
        type='h1'
      />)}
    >
      {
        resourceAuthPage.pageState === 'loading' && (<div>
          <FSkeletonNode width={120} height={22} />
          <div style={{ height: 20 }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
            <FSkeletonNode width={420} height={240} />
            <FSkeletonNode width={420} height={240} />
          </div>
          <div style={{ height: 50 }} />
          <FSkeletonNode width={120} height={22} />
          <div style={{ height: 20 }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
            <FSkeletonNode width={340} height={38} />
            <FSkeletonNode width={500} height={38} />
          </div>
          <div style={{ height: 20 }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 180 }}>
            <FSkeletonNode width={180} height={38} />
            <FSkeletonNode width={220} height={38} />
          </div>
          <div style={{ height: 50 }} />
          <FSkeletonNode width={120} height={22} />
          <div style={{ height: 20 }} />
          <FSkeletonNode width={860} height={38} />
          <div style={{ height: 20 }} />
          <FSkeletonNode width={340} height={38} />
        </div>)
      }

      {
        resourceAuthPage.pageState === 'loaded' && (<FFormLayout>
          <FFormLayout.FBlock
            dot={resourceAuthPage.policies.length === 0}
            title={FI18n.i18nNext.t('authorization_plan')}
            extra={resourceAuthPage.policies?.length !== 0 && (<Space size={5}>
              <FComponentsLib.FCircleBtn
                size='small'
                onClick={() => {
                  dispatch<OnAdd_Policy_Action>({
                    type: 'resourceAuthPage/onAdd_Policy',
                  });
                }}
              />
              <FComponentsLib.FTextBtn
                type='primary'
                onClick={() => {
                  dispatch<OnAdd_Policy_Action>({
                    type: 'resourceAuthPage/onAdd_Policy',
                  });
                }}
              >添加策略</FComponentsLib.FTextBtn>
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
        </FFormLayout>)
      }

    </FLeftSiderLayout>
    {/*<Middleware/>*/}
  </>);
}

export default withRouter(connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage: resourceAuthPage,
  // resourceInfo: resourceInfo,
}))(Auth));
