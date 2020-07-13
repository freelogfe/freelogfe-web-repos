import * as React from 'react';
import styles from './index.less';
import FResourceCover from '@/components/FResourceCover';
import {FContentText} from '@/components/FText';
import {Space} from 'antd';
import {FTextButton} from '@/components/FButton';


export default function Sider() {
  return (<div className={styles.Sider}>
    <FResourceCover status="online"/>
    <div style={{height: 15}}/>
    <FContentText text={'ww-zh/freelog-waterfall-picture'}/>
    <div style={{height: 10}}/>
    <label className={styles.label}>image</label>
    <div style={{height: 15}}/>
    <div className={styles.radios}>
      <div style={{height: 20}}/>
      <Space className={styles.Space} size={16} direction="vertical">
        <div className={styles.radio}>
          <a>资源信息</a>
        </div>
        <div className={styles.radio}>
          <a className={styles.activatedRadio}>授权信息</a>
        </div>

        <div className={styles.radio}>
          <a className={''}>版本列表</a>
          <FTextButton><i className="freelog fl-icon-add"/></FTextButton>
        </div>

        <Space size={16} direction="vertical" className={styles.versions + ' ' + styles.Space}>
          <div className={styles.radio + ' ' + styles.smallVersion}>
            <a className={styles.activatedRadio}>正在创建版本</a>

          </div>
          <div className={styles.radio + ' ' + styles.smallVersion}>
            <a>10.15.4</a>
          </div>
          <div className={styles.radio + ' ' + styles.smallVersion}>
            <a>10.15.3</a>
          </div>
        </Space>
      </Space>
    </div>
  </div>)
}
