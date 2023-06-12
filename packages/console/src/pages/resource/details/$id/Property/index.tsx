import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
import FComponentsLib from '@freelog/components-lib';
import FResourceProperties from '@/components/FResourceProperties';

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
          onlyEditValueData={[]}
          alterableData={resourceDetailPage.resourceVersion_Info.baseProperties}
        />
      {/*</div>*/}
    </div>
    <div style={{ height: 20 }} />
  </>);
}

export default connect(({ resourceDetailPage }: ConnectState) => ({ resourceDetailPage }))(Property);
