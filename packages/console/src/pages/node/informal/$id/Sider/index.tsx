import * as React from 'react';
import styles from './index.less';
import {Space} from "antd";
import FCopyToClipboard from "@/components/FCopyToClipboard";
import {connect, Dispatch} from 'dva';
import {ConnectState, InformalNodeManagerPageModelState} from "@/models/connect";
import {withRouter} from "umi";
import {ChangeAction} from "@/models/informalNodeManagerPage";

interface SiderProps {
  dispatch: Dispatch;

  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function Sider({dispatch, informalNodeManagerPage}: SiderProps) {
  return (<>
    <div style={{height: 35}}/>
    <div className={styles.title}>
      <label>text</label>
      &nbsp;&nbsp;
      <span>The official node of freelog</span>
    </div>
    <div style={{height: 15}}/>
    <Space size={5} className={styles.url}>
      <a>node.testfreelog.com</a>
      <FCopyToClipboard
        text={'复制成功'}
        title={'复制测试节点地址'}
      />
    </Space>
    <div style={{height: 35}}/>
    <div className={styles.navs}>
      <div
        className={informalNodeManagerPage.showPage === 'exhibit' ? styles.activated : ''}
        onClick={() => {
          dispatch<ChangeAction>({
            type: 'informalNodeManagerPage/change',
            payload: {
              showPage: 'exhibit',
            },
          });
        }}
      >展品管理
      </div>
      <div
        className={informalNodeManagerPage.showPage === 'theme' ? styles.activated : ''}
        onClick={() => {
          dispatch<ChangeAction>({
            type: 'informalNodeManagerPage/change',
            payload: {
              showPage: 'theme',
            },
          });
        }}
      >主题管理</div>
      <div
        className={informalNodeManagerPage.showPage === 'mappingRule' ? styles.activated : ''}
        onClick={() => {
          dispatch<ChangeAction>({
            type: 'informalNodeManagerPage/change',
            payload: {
              showPage: 'mappingRule',
            },
          });
        }}
      >映射规则管理</div>
    </div>
  </>);
}


// export default connect(({informalNodeManagerPage}:ConnectState) => ({})(Sider);

export default connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(Sider);
