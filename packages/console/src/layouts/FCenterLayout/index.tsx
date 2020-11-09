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

  const [minHeight, setMinHeight] = React.useState<number>(window.innerHeight - 140);

  React.useEffect(() => {
    window.addEventListener('resize', () => {
      setMinHeight(window.innerHeight - 140);
    });
  }, []);

  return (<>
    <div
      style={{minHeight: minHeight}}
      className={styles.content}
    >
      <div>{children}</div>
      {/*<div style={{height: 100}}/>*/}
    </div>
    {/*<FFooter/>*/}
  </>);
}

export default connect(({global}: ConnectState) => ({
  global,
}))(FCenterLayout);
