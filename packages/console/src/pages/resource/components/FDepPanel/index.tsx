import * as React from 'react';

import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {EditOutlined, InfoCircleFilled} from '@ant-design/icons';
import {Radio, Checkbox, Space} from 'antd';

const code = 'initial:\n' +
  '    active\n' +
  '    recontractable\n' +
  '    presentable\n' +
  '    terminate';

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
          <Radio style={{lineHeight: '16px'}} checked={true}/>
          <span style={{color: '#666'}}>上抛</span>
          <InfoCircleFilled style={{color: '#C7C7C7', fontSize: 16, marginLeft: 20}}/>
        </div>
        <div style={{height: 18}}/>
        <div>
          <Radio style={{lineHeight: '16px'}} checked={false}/>
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
              <div className={styles.PolicyGrammarName}>
                <Checkbox/><span>策略1</span>
                <div>
                  <label className={styles.executing}>执行中</label>
                </div>
              </div>
              <div style={{height: 15}}/>
              <pre className={styles.highlight}>{code}</pre>
            </div>
            <div className={styles.PolicyInfo}>
              <Space size={40}>
                <FContentText type="additional2" text={'合约ID：adhjtyrghgjhxdfthgasdhdflgkftr'}/>
                <FContentText type="additional2" text={'签约时间：2019-10-10'}/>
              </Space>
              <div style={{height: 9}}/>
              <div>
                <FContentText type="additional2">
                  应用版本：
                  <Space size={15}>
                    <span>10.5.2</span><span>10.5.3</span>
                  </Space>
                </FContentText>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  </div>);
}
