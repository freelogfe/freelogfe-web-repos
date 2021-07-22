import * as React from 'react';
import styles from './index.less';
import {FTitleText} from '@/components/FText';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {connect, Dispatch} from 'dva';
import {ConnectState, NodeManagerModelState} from "@/models/connect";
import {ChangeAction} from "@/models/nodeManagerPage";
import {withRouter} from "umi";
import FLink from "@/components/FLink";
import FUtil1 from "@/utils";
import {FUtil} from '@freelog/tools-lib';
import {Space} from "antd";

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

  return (<div className={styles.styles}>
      <div className={styles.header}>
        <div style={{height: 30}}/>

        <div className={styles.title}>
          <FTitleText
            type="h2"
            text={nodeManagerPage.nodeName}
          />
          <div style={{height: 15}}/>
          <Space size={5} className={styles.url}>
            <a
              onClick={() => {
                window.open(nodeManagerPage.nodeUrl);
              }}
            >{nodeManagerPage.nodeUrl.replace(/http(s)?:\/\//, '')}</a>
            <FCopyToClipboard
              text={nodeManagerPage.nodeUrl}
              title={'复制节点地址'}
              iconStyle={{fontSize: 14}}
            />
          </Space>
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
          >{FUtil1.I18n.message('tab_manage_nodes')}</a>
          <a
            className={nodeManagerPage.showTheme ? styles.activated : ''}
            onClick={() => dispatch<ChangeAction>({
              type: 'nodeManagerPage/change',
              payload: {
                showTheme: true,
              }
            })}
          >{FUtil1.I18n.message('manage_theme')}</a>
        </div>
      </div>

      <div className={styles.gotoTest}>
        <span>{FUtil1.I18n.message('msg_navigate_to_test_node')}</span>
        <FLink
          to={FUtil.LinkTo.informNodeManagement({nodeID: Number(match.params.id), showPage: 'exhibit'})}
        >{FUtil1.I18n.message('btn_navigate_to_test_node')}</FLink>
        <div style={{height: 40}}/>
      </div>

    </div>
  );
}

export default withRouter(connect(({nodeManagerPage}: ConnectState) => ({
  nodeManagerPage
}))(Sider));
