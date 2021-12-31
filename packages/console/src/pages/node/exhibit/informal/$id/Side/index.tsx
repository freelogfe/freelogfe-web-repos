import * as React from 'react';
import styles from './index.less';
import {connect} from 'dva';
import {ConnectState} from '@/models/connect';
import Info from './Info';
import Relation from './Relation';
import Setting from './Setting';

interface SideProps {

}

function Side({}: SideProps) {


  return (<div className={styles.side}>

    <div className={styles.base}>

      <Info/>

      <Setting/>

    </div>

    <div style={{height: 10}}/>

    <Relation/>

  </div>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Side);
