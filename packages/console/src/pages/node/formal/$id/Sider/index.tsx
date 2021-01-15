import * as React from 'react';
import styles from './index.less';
import {FTitleText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';
import {Button} from 'antd';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {connect, Dispatch} from 'dva';
import {ConnectState, NodeManagerModelState} from "@/models/connect";
import {ChangeAction} from "@/models/nodeManagerPage";
import {router, withRouter} from "umi";

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
    <div>
      <FTitleText type="h3" text={nodeManagerPage.nodeName}/>
      <div style={{height: 15}}/>
      <span className={styles.url}>{nodeManagerPage.nodeUrl}</span>
      <FCopyToClipboard text={nodeManagerPage.nodeUrl} title={'复制节点地址'}/>
      <div style={{height: 25}}/>

      <div className={styles.selector}>
        <div style={{height: 30}}/>
        <a
          className={!nodeManagerPage.showTheme ? styles.active : ''}
          onClick={() => dispatch<ChangeAction>({
            type: 'nodeManagerPage/change',
            payload: {
              showTheme: false,
            }
          })}
        >展品管理</a>
        <div style={{height: 16}}/>
        <a
          className={nodeManagerPage.showTheme ? styles.active : ''}
          onClick={() => dispatch<ChangeAction>({
            type: 'nodeManagerPage/change',
            payload: {
              showTheme: true,
            }
          })}
        >主题管理</a>
      </div>
    </div>

    <Button onClick={() => {
      router.push(`/node/${match.params.id}/informal`);
    }}>进入测试节点</Button>
  </div>);
}

export default withRouter(connect(({nodeManagerPage}: ConnectState) => ({
  nodeManagerPage
}))(Sider));
