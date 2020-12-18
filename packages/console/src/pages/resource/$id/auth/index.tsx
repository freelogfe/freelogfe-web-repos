import * as React from 'react';

import styles from './index.less';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import FPolicies from '@/pages/resource/containers/FPolicies';
import {FTitleText, FContentText} from '@/components/FText';
import FEditorCard from '@/components/FEditorCard';
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
  FetchAuthorizedAction,
  UpdatePoliciesAction
} from '@/models/resourceAuthPage';
import {ChangeAction as GlobalChangeAction} from '@/models/global';
import {router, RouterTypes, withRouter} from 'umi';
import {i18nMessage} from '@/utils/i18n';
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import Sider from "@/pages/resource/layouts/FInfoLayout/Sider";
import FFormLayout from "@/layouts/FFormLayout";
import FNoDataTip from "@/components/FNoDataTip";

const columns: any[] = [
  {
    title: i18nMessage('contract_name') + '｜' + i18nMessage('contract_id'),
    dataIndex: 'name',
    render: (_: any, record: any) => (<>
      <FContentText text={record.contractName}/>
      <div style={{height: 2}}/>
      <FContentText type="additional2" text={record.contractID}/>
    </>),
  },
  {
    title: i18nMessage('licensee'),
    // className: 'column-money',
    dataIndex: 'authorizedParties',
    // align: 'right',
    render: (_: any, record: any) => (<FContentText text={record.authorizedParty}/>)
  },
  {
    title: i18nMessage('contract_signed_time'),
    dataIndex: 'createTime',
    render: (_: any, record: any) => (<FContentText text={record.createDate}/>)
  },
  {
    title: i18nMessage('contract_state'),
    dataIndex: 'contractStatus',
    render: (_: any, record: any) => (<StatusLabel status={record.status}/>)
  },
];

interface AuthProps {
  dispatch: Dispatch;
  auth: ResourceAuthPageModelState;
  resourceInfo: ResourceInfoModelState,
  match: {
    params: {
      id: string,
    }
  }
}

function Auth({dispatch, route, auth, match, resourceInfo}: AuthProps & RouterTypes) {

  const [minHeight, setMinHeight] = React.useState<number>(window.innerHeight - 70);

  React.useEffect(() => {
    window.addEventListener('resize', setHeight);

    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  function setHeight() {
    setMinHeight(window.innerHeight - 70);
  }

  if (!resourceInfo.hasPermission) {
    return (<div>
      <FNoDataTip
        height={minHeight}
        tipText={'403,没权限访问'}
        btnText={'将前往首页'}
        onClick={() => {
          router.replace('/');
        }}
      />
    </div>);
  }

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

    dispatch<FetchAuthorizeAction>({
      type: 'resourceAuthPage/fetchAuthorize',
      // payload: data.resourceId,
    });

    dispatch<FetchAuthorizedAction>({
      type: 'resourceAuthPage/fetchAuthorized',
      payload: {},
    });
  }, []);

  return (<FLeftSiderLayout sider={<Sider/>}
                            header={<FTitleText text={i18nMessage('authorization_infomation')} type={'h2'}/>}>
    <FFormLayout>
      <FFormLayout.FBlock title={i18nMessage('authorization_plan')}>
        <FPolicies/>
      </FFormLayout.FBlock>
      {
        auth.contractsAuthorized?.length > 0 && (<FFormLayout.FBlock title={i18nMessage('licencee_contract')}>
          <FAuthPanel
            dataSource={auth.contractsAuthorized}
            onChangeActivatedResource={(value) => dispatch<ChangeAction>({
              type: 'resourceAuthPage/change',
              payload: {
                contractsAuthorized: value,
              },
            })}
          />
        </FFormLayout.FBlock>)
      }

      {
        auth.contractsAuthorize?.length > 0 && (<FFormLayout.FBlock title={i18nMessage('authorizing_contracts')}>
          <Table
            columns={columns}
            dataSource={auth.contractsAuthorize}
            bordered
            // title={() => 'Header'}
            // footer={() => 'Footer'}
          />
        </FFormLayout.FBlock>)
      }
    </FFormLayout>
  </FLeftSiderLayout>);
}

export default withRouter(connect(({resourceAuthPage, resourceInfo}: ConnectState) => ({
  auth: resourceAuthPage,
  resourceInfo: resourceInfo,
}))(Auth));
