import * as React from 'react';
import styles from './index.less';
import {FTitleText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';
import {Button} from 'antd';
import FCopyToClipboard from '@/components/FCopyToClipboard';

interface SiderProps {

}

function Sider({}: SiderProps) {
  return (<div className={styles.styles}>
    <div>
      <FTitleText type="h3" text={'这里是节点名称这里是节点名称这里是节点名称'}/>
      <div style={{height: 15}}/>
      <span className={styles.url}>photos.freelog.com</span>
      <FCopyToClipboard text={'photos.freelog.com'} title={'复制节点地址'}/>
      <div style={{height: 25}}/>

      <div className={styles.selector}>
        <div style={{height: 30}}/>
        <a  className={styles.active}>展品管理</a>
        <div style={{height: 16}}/>
        <a>主题管理</a>
      </div>
    </div>

    <Button>进入测试节点</Button>
  </div>);
}

export default Sider;
