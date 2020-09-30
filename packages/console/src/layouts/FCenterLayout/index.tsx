import * as React from 'react';
import styles from './index.less';
import {Layout} from 'antd';
import {connect} from 'dva';
import {ConnectState, GlobalModelState} from "@/models/connect";

interface FCenterLayoutProps {
  global: GlobalModelState;

  children?: React.ReactNode | React.ReactNodeArray;
}

function FCenterLayout({children, global}: FCenterLayoutProps) {
  // console
  return (<Layout.Content
    className={styles.Content}
    style={{
      // backgroundColor: 'white'
    }}
  >
    {/*<div className={}>*/}
    <div>{children}</div>
    {/*</div>*/}
    <div style={{height: 100}}/>
  </Layout.Content>)
}

export default connect(({global}: ConnectState) => ({
  global,
}))(FCenterLayout);
