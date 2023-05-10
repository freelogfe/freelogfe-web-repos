import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
import FTooltip from '@/components/FTooltip';
import FComponentsLib from '@freelog/components-lib';
import FResourceOptions from '@/components/FResourceOptions';

interface OptionProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
}

function Option({ dispatch, resourceDetailPage }: OptionProps) {

  if (resourceDetailPage.resourceVersion_Info.customOptions.length === 0) {
    return null;
  }

  return (<>
    <div style={{ height: 30 }} />
    <div>
      <FComponentsLib.FTitleText
        text={'自定义选项'}
        type='h3'
      />
      <div style={{ height: 20 }} />
      <div style={{ padding: 15, backgroundColor: '#F7F8F9' }}>
        <FResourceOptions dataSource={resourceDetailPage.resourceVersion_Info.customOptions} />
      </div>
    </div>
    <div style={{ height: 20 }} />
  </>);
}

export default connect(({ resourceDetailPage }: ConnectState) => ({ resourceDetailPage }))(Option);
