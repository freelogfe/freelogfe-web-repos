import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import FSwitch from "@/components/FSwitch";
import {Space} from "antd";
import Policies from './Policies';
import Contracts from './Contracts';
import Viewports from './Viewports';
import Side from './Side';

interface PresentableProps {

}

function Presentable({}: PresentableProps) {
  return (<div className={styles.styles}>
    <div>
      <div className={styles.header}>
        <div className={styles.nav}>
          <FContentText type="negative" text={'我的音乐节点'}/>
          <div style={{width: 2}}/>
          <FContentText type="negative" text={'>'}/>
          <div style={{width: 2}}/>
          <FTitleText text={'Smells like teen spirit'}/>
        </div>
        <Space size={20}>
          <span style={{color: '#666'}}>上线</span>
          <FSwitch/>
        </Space>
      </div>
      <div className={styles.body}>
        <div className={styles.content}>
          <div>
            <Policies/>
            <div style={{height: 50}}/>
            <Contracts/>
            <div style={{height: 50}}/>
            <Viewports/>
          </div>
        </div>
        <div style={{width: 10}}/>
        <Side/>
      </div>
    </div>
    <div style={{height: 100}}/>
  </div>);
}

export default Presentable;
