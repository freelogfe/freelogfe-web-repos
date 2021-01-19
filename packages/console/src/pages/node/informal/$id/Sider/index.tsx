import * as React from 'react';
import styles from './index.less';
import {Space} from "antd";
import FCopyToClipboard from "@/components/FCopyToClipboard";

interface SiderProps {

}

function Sider({}: SiderProps) {
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
      <div className={styles.activated}>展品管理</div>
      <div>主题管理</div>
      <div>映射规则管理</div>
    </div>
  </>);
}

export default Sider;
