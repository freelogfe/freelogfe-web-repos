import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import Info from './Info';
import Relation from './Relation';
import Setting from './Setting';

interface SideProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState,
}

function Side({ dispatch, exhibitInfoPage }: SideProps) {
  return (<div className={styles.side}>
    <div className={styles.base}>
      <Info />
      <Setting />
    </div>
    <div style={{ height: 10 }} />
    <Relation />
  </div>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Side);
