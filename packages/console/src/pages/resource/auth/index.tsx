import * as React from 'react';

import styles from './index.less';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import FPolicies from '@/pages/resource/components/FPolicies';
import {FTitleText, FContentText} from '@/components/FText';
import FEditorCard from '@/components/FEditorCard';
import FDepPanel from '@/pages/resource/components/FDepPanel';
import StatusLabel from '@/pages/resource/components/StatusLabel';
import {Table} from 'antd';
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceAuthPageModelState, ResourcePageModelState} from "@/models/connect";

const columns: any[] = [
  {
    title: '合约名称｜合约ID',
    dataIndex: 'name',
    render: (_: any, record: any) => (<>
      <FContentText text={record.contractName}/>
      <div style={{height: 2}}/>
      <FContentText type="additional2" text={record.contractID}/>
    </>),
  },
  {
    title: '被授权方',
    // className: 'column-money',
    dataIndex: 'authorizedParties',
    // align: 'right',
    render: (_: any, record: any) => (<FContentText text={record.authorizedParty}/>)
  },
  {
    title: '合约创建时间',
    dataIndex: 'createTime',
    render: (_: any, record: any) => (<FContentText text={record.createDate}/>)
  },
  {
    title: '合约状态',
    dataIndex: 'contractStatus',
    render: (_: any, record: any) => (<StatusLabel status={record.status}/>)
  },
];

interface AuthProps {
  dispatch: Dispatch;
  auth: ResourceAuthPageModelState,
}

function Auth({dispatch, auth}: AuthProps) {
  return (<FInfoLayout>
    <FContentLayout header={<FTitleText text={'授权信息'} type={'h2'}/>}>
      <FEditorCard title={'授权策略'}>
        <FPolicies/>
      </FEditorCard>
      <FEditorCard title={'被授权合约'}>
        <FDepPanel/>
      </FEditorCard>
      <FEditorCard title={'授权合约'}>
        <Table
          columns={columns}
          dataSource={auth.contractsAuthorize || []}
          bordered
          // title={() => 'Header'}
          // footer={() => 'Footer'}
        />
      </FEditorCard>
    </FContentLayout>
  </FInfoLayout>);
}

export default connect(({resourceAuthPage}: ConnectState) => ({
  auth: resourceAuthPage,
}))(Auth);
