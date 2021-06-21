import React from 'react';
import styles from './index.less';
import {Layout} from 'antd';
import {withRouter} from 'umi';
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalModelState} from '@/models/connect';
import {RouteComponentProps} from "react-router";
import FFooter from "@/layouts/FFooter";
import FHeader from "@/layouts/FLayout/FHeader";
import * as AHooks from 'ahooks';
import {ChangeAction} from "@/models/user";

interface FLayoutProps extends RouteComponentProps {
  children: React.ReactNode | React.ReactNodeArray;
  dispatch: Dispatch;
  global: GlobalModelState;
}

function FLayout({dispatch, children, global}: FLayoutProps) {

  // const [cookiesUserID] = AHooks.useCookieState('uid', {
  //   defaultValue: '50028',
  // });
  //
  // React.useEffect(() => {
  //   // console.log(cookiesUserID, '!~!!!!!!!!###3333333');
  //   dispatch<ChangeAction>({
  //     type: 'user/change',
  //     payload: {
  //       cookiesUserID: Number(cookiesUserID),
  //     },
  //   });
  // }, []);

  return (
    <Layout
      className={styles.Layout}
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

export default withRouter(connect(({global}: ConnectState) => ({
  global: global,
}))(FLayout));
