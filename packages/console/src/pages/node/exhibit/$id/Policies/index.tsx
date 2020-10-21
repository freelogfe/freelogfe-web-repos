import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {Space} from 'antd';
import FSwitch from '@/components/FSwitch';

interface PoliciesProps {

}

const text = 'for public:\n' +
  '  initial:\n' +
  '    active\n' +
  '    recontractable\n' +
  '    presentable\n' +
  '    terminate';

function Policies({}: PoliciesProps) {
  return (<div>
    <Space size={15}>
      <FTitleText text={'授权策略'} type="h3"/>
      <FCircleButton/>
    </Space>
    <div style={{height: 20}}/>
    <div className={styles.policies}>
      <div className={styles.policy}>
        <div className={styles.title}>
          <FContentText text={'策略1'}/>
          <Space size={8}>
            <label style={{color: '#42C28C'}}>已启用</label>
            <FSwitch/>
          </Space>
        </div>
        <div style={{height: 15}}/>
        <pre>{text}</pre>
      </div>

      <div className={styles.policy}>
        <div className={styles.title}>
          <FContentText text={'策略2'}/>
          <Space size={8}>
            <label>已启用</label>
            <FSwitch/>
          </Space>
        </div>
        <div style={{height: 15}}/>
        <pre>{text}</pre>
      </div>

      <div className={styles.policy}>
        <div className={styles.title}>
          <FContentText text={'策略2'}/>
          <Space size={8}>
            <label>已启用</label>
            <FSwitch/>
          </Space>
        </div>
        <div style={{height: 15}}/>
        <pre>{text}</pre>
      </div>

      <div className={styles.policy}>
        <div className={styles.title}>
          <FContentText text={'策略2'}/>
          <Space size={8}>
            <label>已启用</label>
            <FSwitch/>
          </Space>
        </div>
        <div style={{height: 15}}/>
        <pre>{text}</pre>
      </div>

      <div className={styles.policy}>
        <div className={styles.title}>
          <FContentText text={'策略2'}/>
          <Space size={8}>
            <label>已启用</label>
            <FSwitch/>
          </Space>
        </div>
        <div style={{height: 15}}/>
        <pre>{text}</pre>
      </div>

    </div>
  </div>);
}

export default Policies;
