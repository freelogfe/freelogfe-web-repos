import * as React from 'react';
import styles from './index.less';
import {FTitleText} from '@/components/FText';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {connect, Dispatch} from 'dva';
import {ConnectState, NodeManagerModelState} from "@/models/connect";
import {ChangeAction} from "@/models/nodeManagerPage";
import {withRouter} from "umi";
import FLinkTo from "@/utils/path-assembler";
import FLink from "@/components/FLink";

interface SiderProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
  match: {
    params: {
      id: string;
    }
  }
}

function Sider({dispatch, nodeManagerPage, match}: SiderProps) {

  // React.useEffect(() => {
  //   console.log('Sider useEffect');
  // }, []);

  return (<div className={styles.styles}>
      <div className={styles.header}>
        <div style={{height: 30}}/>

        <div className={styles.title}>
          <FTitleText type="h3" text={nodeManagerPage.nodeName}/>
          <div style={{height: 15}}/>
          <a
            className={styles.url}
            href={nodeManagerPage.nodeUrl}
          >{nodeManagerPage.nodeUrl}</a>
          <FCopyToClipboard
            text={nodeManagerPage.nodeUrl}
            title={'复制节点地址'}
          />
        </div>

        <div style={{height: 35}}/>

        <div className={styles.navs}>
          <a
            className={!nodeManagerPage.showTheme ? styles.activated : ''}
            onClick={() => dispatch<ChangeAction>({
              type: 'nodeManagerPage/change',
              payload: {
                showTheme: false,
              }
            })}
          >展品管理</a>
          <a
            className={nodeManagerPage.showTheme ? styles.activated : ''}
            onClick={() => dispatch<ChangeAction>({
              type: 'nodeManagerPage/change',
              payload: {
                showTheme: true,
              }
            })}
          >主题管理</a>
        </div>
      </div>

      <div className={styles.gotoTest}>
        <span>这里是正式节点管理页面，如想要对资源进行测试，可以 </span>
        <FLink
          to={FLinkTo.informNodeManagement({nodeID: Number(match.params.id)})}
        > 前往测试节点</FLink>
        <div style={{height: 40}}/>
      </div>

    </div>
  );
}

export default withRouter(connect(({nodeManagerPage}: ConnectState) => ({
  nodeManagerPage
}))(Sider));
