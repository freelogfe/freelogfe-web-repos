import * as React from 'react';

import styles from './index.less';
import FPolicies from '@/pages/resource/containers/FPolicies';
import {FTitleText, FContentText} from '@/components/FText';
import FAuthPanel from '@/pages/resource/containers/FAuthPanel';
import StatusLabel from '@/pages/resource/components/StatusLabel';
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
import {ChangeAction as GlobalChangeAction} from '@/models/global';
import {RouterTypes, withRouter} from 'umi';
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import Sider from "@/pages/resource/layouts/FInfoLayout/Sider";
import FFormLayout from "@/layouts/FFormLayout";
import {FInfo, FNodes, FUser} from "@/components/FIcons";
import FUtil from "@/utils";
import {FCircleBtn} from "@/components/FButton";
import FDrawer from "@/components/FDrawer";
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import FIdentityTypeBadge from "@/components/FIdentityTypeBadge";
import FDivider from "@/components/FDivider";
// import {FContentText} from '@/components/FText';

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
              resourceAuthPage.contractsAuthorized.length > 0 && (<FAuthPanel/>)
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

        <FDrawer
          visible={true}
          title={'合约详情'}
        >
          <FFormLayout>
            <FFormLayout.FBlock title={'标的物'}>
              <Space size={10}>
                <img className={styles.targetCover} src={imgSrc}/>
                <div>
                  <FContentText type="highlight" text={'喜马拉雅山照片'}/>
                  <div style={{height: 5}}/>
                  <FIdentityTypeBadge status={'exhibit'}/>
                </div>
              </Space>
            </FFormLayout.FBlock>

            <FFormLayout.FBlock title={'缔约方'}>
              <Space size={10}>
                <div style={{width: 80}}>
                  <FContentText type="negative" text={'授权方'}/>
                </div>
                <Space size={10}>
                  <FNodes style={{color: '#E9A923'}}/>
                  <FContentText type="highlight" text={'喜马拉雅山照片'}/>
                </Space>
              </Space>
              <div style={{height: 15}}/>
              <Space size={10}>
                <div style={{width: 80}}>
                  <FContentText type="negative" text={'照片节点'}/>
                </div>
                <Space size={10}>
                  <FUser style={{color: '#BD10E0'}}/>
                  <FContentText type="highlight" text={'James'}/>
                </Space>
              </Space>
            </FFormLayout.FBlock>

            <FFormLayout.FBlock title={'所签授权策略'}>
              <Space size={10}>
                <FContentText text={'免费授权策略'} type="highlight"/>
                <label className={styles.executing}>执行中</label>
              </Space>

              <div style={{height: 10}}/>
              <Space size={2}>
                <FContentText
                  type="additional2"
                  text={'签约时间：2020/09/09 12:00'}
                />
                <FDivider style={{fontSize: 14}}/>
                <FContentText
                  type="additional2"
                  text={'合约ID：asakfhadghsifdhdidhfsfoh'}
                />
              </Space>
            </FFormLayout.FBlock>

            <FFormLayout.FBlock title={'关联合约'}>

            </FFormLayout.FBlock>
          </FFormLayout>
        </FDrawer>

      </FFormLayout.FBlock>
    </FFormLayout>
  </FLeftSiderLayout>);
}

export default withRouter(connect(({resourceAuthPage, resourceInfo}: ConnectState) => ({
  resourceAuthPage: resourceAuthPage,
  resourceInfo: resourceInfo,
}))(Auth));
