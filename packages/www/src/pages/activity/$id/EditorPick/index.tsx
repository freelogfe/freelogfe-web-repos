import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';

interface EditorPickProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function EditorPick({ activityDetailsPage }: EditorPickProps) {
  return (<div/>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(EditorPick);
