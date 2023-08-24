import * as React from 'react';
import styles from './index.less';
import { OnChange_Page_Action, OnMount_Page_Action as OnMount_Sidebar_Action } from '@/models/resourceSider';
import * as AHooks from 'ahooks';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { ConnectState, ResourceAuthPageModelState } from '@/models/connect';
import { RouteComponentProps } from 'react-router/index';
import { Dispatch } from 'redux';
import FComponentsLib from '@freelog/components-lib';
import FTable from '@/components/FTable';
import FContractDetailsDrawer from '@/components/FContractDetailsDrawer';
import { ColumnsType } from 'antd/lib/table/interface';
import { Space } from 'antd';
import {
  ChangeAction,
  OnMount_ContractPage_Action,
} from '@/models/resourceAuthPage';
import FAuthPanel from '@/pages/resource/auth/$id/FAuthPanel';

interface ContractProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function Contract({ dispatch, resourceAuthPage, match }: ContractProps) {

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
        page: 'contract',
      },
    });
    dispatch<OnMount_ContractPage_Action>({
      type: 'resourceAuthPage/onMount_ContractPage',
      payload: {
        resourceID: match.params.id,
      },
    });

    // dispatch<FetchAuthorizeAction>({
    //   type: 'resourceAuthPage/fetchAuthorize',
    // });

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
    <div>
      <div style={{ height: 40 }} />
      <div className={styles.block}>
        <FComponentsLib.FContentText text={'授权合约'} type={'highlight'} />

        {
          resourceAuthPage.contractsAuthorize.length === 0 && (<>
            <div style={{ height: 10 }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FComponentsLib.FContentText text={'暂无合约'} type={'additional2'} />
            </div>
          </>)
        }

        {
          resourceAuthPage.contractsAuthorize.length > 0 && (<>
            <div style={{ height: 20 }} />
            <FTable
              columns={columns}
              dataSource={resourceAuthPage.contractsAuthorize}
              pagination={false}
            />
          </>)
        }
      </div>
      <div style={{ height: 100 }} />
      <FContractDetailsDrawer
        contractID={resourceAuthPage.detailContractID}
        onClose={() => {
          onChange({
            detailContractID: '',
          });
        }}
      />
    </div>
  </>);
}

// export default Contract;

export default withRouter(connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage: resourceAuthPage,
}))(Contract));
