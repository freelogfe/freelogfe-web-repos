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

  React.useEffect(() => () => {
    window.addEventListener('resize', () => {
      // console.log('0293josdf');
    });
  }, []);

  return (<div className={styles.content}>
    {/*<div className={}>*/}
    <div>{children}</div>
    {/*</div>*/}
    <div style={{height: 100}}/>
  </div>)
}

export default connect(({global}: ConnectState) => ({
  global,
}))(FCenterLayout);
