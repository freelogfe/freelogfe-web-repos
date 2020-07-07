import * as React from 'react';

import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {EditOutlined, InfoCircleFilled} from '@ant-design/icons';
import {Radio} from 'antd';

export default function () {
  return (<div className={styles.DepPanel}>
    <div className={styles.DepPanelNavs}>
      <div>
        <div className={styles.DepPanelNav}>
          <div>
            <FContentText text={'ww-zh/PB-markdown'}/>
            <div style={{height: 9}}/>
            <FContentText type="additional2">
              <span>image | 版本范围：xxx</span> <EditOutlined/>
            </FContentText>
            <>
              <div style={{height: 9}}/>
              <div className={styles.DepPanelLabels}>
                <label className={styles.labelError}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
              </div>
            </>
          </div>
          <FCircleButton theme="delete"/>
        </div>
        <div className={styles.DepPanelNav + ' ' + styles.DepPanelNavActive}>
          <div>
            <FContentText text={'ww-zh/PB-markdown'}/>
            <div style={{height: 9}}/>
            <FContentText type="additional2">
              <span>image | 版本范围：xxx</span> <EditOutlined/>
            </FContentText>
            <>
              <div style={{height: 9}}/>
              <div className={styles.DepPanelLabels}>
                <label className={styles.labelError}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
              </div>
            </>
          </div>
          <FCircleButton theme="delete"/>
        </div>
      </div>
    </div>
    <div className={styles.DepPanelContent}>
      <div className={styles.radios}>
        <div>
          <Radio checked={true}/>
          <span style={{color: '#666'}}>上抛</span>
          <InfoCircleFilled style={{color: '#C7C7C7', fontSize: 16, marginLeft: 20}}/>
        </div>
        <div style={{height: 18}}/>
        <div>
          <Radio checked={false}/>
          <span style={{color: '#666'}}>签约</span>
          <InfoCircleFilled style={{color: '#C7C7C7', fontSize: 16, marginLeft: 20}}/>
        </div>
      </div>

      <div className={styles.block}>
        <>
          <div style={{height: 10}}/>
          <FContentText type="additional2" text={'可复用的合约'}/>
        </>
        <>
          <div style={{height: 10}}/>
          <div className={styles.Policy}>
            <div className={styles.PolicyGrammar}>

            </div>
            <div className={styles.PolicyInfo}>

            </div>
          </div>
        </>
      </div>
    </div>
  </div>);
}
