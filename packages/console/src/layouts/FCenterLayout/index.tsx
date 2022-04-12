import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, GlobalModelState } from '@/models/connect';

interface FCenterLayoutProps {
  global: GlobalModelState;
  style?: React.CSSProperties;

  children?: React.ReactNode | React.ReactNodeArray;
}

function FCenterLayout({ children, style = {} }: FCenterLayoutProps) {

  return (<>
    <div
      style={{
        minHeight: 'calc(100vh - 140px)',
        ...style,
      }}
      className={styles.content}
    >
      <div>{children}</div>
    </div>
  </>);
}

export default connect(({ global }: ConnectState) => ({
  global,
}))(FCenterLayout);
