import React from 'react';
import styles from './index.less';
import {Layout} from 'antd';
import {withRouter} from 'umi';
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalModelState} from '@/models/connect';
import {RouteComponentProps} from "react-router";
import FFooter from "@/layouts/FFooter";
import FHeader from "@/layouts/FLayout/FHeader";

interface FLayoutProps extends RouteComponentProps {
  children: React.ReactNode | React.ReactNodeArray;
  dispatch: Dispatch;
  global: GlobalModelState;
}

function FLayout({children, global}: FLayoutProps) {

  const [minHeight, setMinHeight] = React.useState<number>(window.innerHeight);

  React.useEffect(() => {
    window.addEventListener('resize', setHeight);
    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  function setHeight() {
    setMinHeight(window.innerHeight);
  }

  return (
    <Layout
      className={styles.Layout}
      style={{
        // backgroundColor: global.backgroundColor || 'transparent',
        minHeight: minHeight,
      }}
    >
      <Layout.Header className={styles.header}>
        <FHeader/>
      </Layout.Header>

      <div style={{height: 70}}/>

      <Layout.Content className={styles.Content}>{children}</Layout.Content>

      {/*<Layout.Footer className={styles.Footer}>*/}
      {/*  <FFooter/>*/}
      {/*</Layout.Footer>*/}

    </Layout>
  );
}

export default withRouter(connect(({global,}: ConnectState) => ({
  global: global,
}))(FLayout));
