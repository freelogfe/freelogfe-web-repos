import * as React from 'react';
import styles from './index.less';
import {Space} from "antd";
import FCopyToClipboard from "@/components/FCopyToClipboard";
import {connect, Dispatch} from 'dva';
import {ConnectState, InformalNodeManagerPageModelState} from "@/models/connect";
import {router, withRouter} from "umi";
import {ChangeAction, FetchNodeInfoAction, OnMountPageSiderAction} from "@/models/informalNodeManagerPage";
import {RouteComponentProps} from "react-router";
import {FUtil} from "@freelog/tools-lib";
import FUtil1 from "@/utils";
import * as AHooks from "ahooks";

interface SiderProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;

  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function Sider({match, dispatch, informalNodeManagerPage}: SiderProps) {

  AHooks.useMount(() => {
    dispatch<OnMountPageSiderAction>({
      type: 'informalNodeManagerPage/onMountPageSider',
      payload: {
        nodeID: Number(match.params.id),
      },
    });
  });

  AHooks.useUnmount(() => {

  });

  // React.useEffect(() => {
  //   initData();
  // }, []);
  //
  // async function initData() {
  //   await dispatch<ChangeAction>({
  //     type: 'informalNodeManagerPage/change',
  //     payload: {
  //       nodeID: Number(match.params.id),
  //     },
  //   });
  //
  //   await dispatch<FetchNodeInfoAction>({
  //     type: 'informalNodeManagerPage/fetchNodeInfo',
  //   });
  // }

  return (<>
    <div style={{height: 35}}/>
    <div className={styles.title}>
      <label>test</label>
      &nbsp;&nbsp;
      <span>{informalNodeManagerPage.nodeName}</span>
    </div>
    <div style={{height: 15}}/>
    <Space size={5} className={styles.url}>
      <a onClick={() => {
        window.open(informalNodeManagerPage.testNodeUrl);
      }}>{informalNodeManagerPage.testNodeUrl.replace(/http(s)?:\/\//, '')}</a>
      <FCopyToClipboard
        text={informalNodeManagerPage.testNodeUrl}
        // title={'复制测试节点地址'}
        title={FUtil1.I18n.message('tip_copy_node_domain')}
      />
    </Space>
    <div style={{height: 35}}/>
    <div className={styles.navs}>
      <div
        className={informalNodeManagerPage.showPage === 'exhibit' ? styles.activated : ''}
        onClick={() => {
          router.push(FUtil.LinkTo.informNodeManagement({
            nodeID: informalNodeManagerPage.nodeID,
            showPage: 'exhibit',
          }));
        }}
      >展品管理
      </div>
      <div
        className={informalNodeManagerPage.showPage === 'theme' ? styles.activated : ''}
        onClick={() => {
          router.push(FUtil.LinkTo.informNodeManagement({
            nodeID: informalNodeManagerPage.nodeID,
            showPage: 'theme',
          }));
        }}
      >主题管理
      </div>
      <div
        className={informalNodeManagerPage.showPage === 'mappingRule' ? styles.activated : ''}
        onClick={() => {
          // dispatch<ChangeAction>({
          //   type: 'informalNodeManagerPage/change',
          //   payload: {
          //     showPage: 'mappingRule',
          //   },
          // });
          router.push(FUtil.LinkTo.informNodeManagement({
            nodeID: informalNodeManagerPage.nodeID,
            showPage: 'mappingRule',
          }));
        }}
      >映射规则管理
      </div>
    </div>
  </>);
}

export default withRouter(connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(Sider));
