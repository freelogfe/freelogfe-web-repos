import * as React from 'react';
import styles from './index.less';
import {Layout} from 'antd';
import {connect} from 'dva';
import {ConnectState, GlobalModelState} from '@/models/connect';
import FFooter from '@/layouts/FFooter';

interface FCenterLayoutProps {
  global: GlobalModelState;

  children?: React.ReactNode | React.ReactNodeArray;
}

function FCenterLayout({children, global}: FCenterLayoutProps) {

  return (<>
    <div
      style={{minHeight: 'calc(100vh - 140px)'}}
      className={styles.content}
    >
      <div>{children}</div>
    </div>
  </>);
}

export default connect(({global}: ConnectState) => ({
  global,
}))(FCenterLayout);
