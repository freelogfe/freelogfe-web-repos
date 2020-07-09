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

const columns: any[] = [
  {
    title: '合约名称｜合约ID',
    dataIndex: 'name',
    render: (text: any) => (<>
      <FContentText text={'免费策略1'}/>
      <div style={{height: 2}}/>
      <FContentText type="additional2" text={'asjfgjiergingnsdfshskh'}/>
    </>),
  },
  {
    title: '被授权方',
    // className: 'column-money',
    dataIndex: 'authorizedParties',
    // align: 'right',
    render: () => (<FContentText text={'资源xxx'}/>)
  },
  {
    title: '合约创建时间',
    dataIndex: 'createTime',
    render: () => (<FContentText text={'2020-05-19'}/>)
  },
  {
    title: '合约状态',
    dataIndex: 'contractStatus',
    render: () => (<StatusLabel status="executing"/>)
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    money: '￥300,000.00',
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    money: '￥1,256,000.00',
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    money: '￥120,000.00',
    address: 'Sidney No. 1 Lake Park',
  },
];

export default function () {
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
          dataSource={data}
          bordered
          // title={() => 'Header'}
          // footer={() => 'Footer'}
        />
      </FEditorCard>
    </FContentLayout>
  </FInfoLayout>);
}
