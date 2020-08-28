import * as React from 'react';
import styles from './index.less';
import {FTitleText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {Progress} from 'antd';

interface SiderProps {

}

function Sider({}: SiderProps) {
  return (<div className={styles.sider}>
    <div className={styles.title}>
      <FTitleText text={'我的存储空间'} type="form"/>
      <FCircleButton theme="text"/>
    </div>
    <div style={{height: 18}}/>
    <div className={styles.buckets}>
      <a className={styles.bucketActive}>bucket-001</a>
      <a>bucket-002</a>
      <a>bucket-003</a>
    </div>
    <div style={{height: 130}}/>
    <Progress
      strokeWidth={6}
      percent={30}
      showInfo={false}
      className={styles.progressBack}
    />
  </div>);
}

export default Sider;
