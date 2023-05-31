import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
// import FTooltip from '@/components/FTooltip';
// import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FResourceProperties from '@/components/FResourceProperties';

// import FResourceOptions from '@/components/FResourceOptions';

interface PropertyProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState,
}

function Property({ dispatch, resourceDetailPage }: PropertyProps) {

  return (<>
    <div style={{ height: 30 }} />
    <div>
      <FComponentsLib.FTitleText
        text={'基础属性'}
        type='h3'
      />
      <div style={{ height: 20 }} />
      {/*<div style={{ padding: 15, backgroundColor: '#F7F8F9' }}>*/}
        <FResourceProperties
          immutableData={resourceDetailPage.resourceVersion_Info.rawProperties}
          alterableData={resourceDetailPage.resourceVersion_Info.baseProperties}
        />
      {/*</div>*/}
    </div>
    <div style={{ height: 20 }} />
  </>);
}

export default connect(({ resourceDetailPage }: ConnectState) => ({ resourceDetailPage }))(Property);

// interface ItemProps {
//   tTey: string;
//   value: string;
//   description?: string;
// }
//
// function Item({tTey, value, description}: ItemProps) {
//   return (<tr key={tTey}>
//     <td>
//       <Space size={10}>
//         <FContentText text={tTey} type="negative"/>
//         {description && (
//           <FTooltip title={description}><FInfo style={{cursor: 'pointer'}}/></FTooltip>)}
//       </Space>
//       <div style={{height: 10}}/>
//       <FContentText
//         style={{maxWidth: 215}}
//         text={value}
//         singleRow
//       />
//     </td>
//   </tr>);
// }
