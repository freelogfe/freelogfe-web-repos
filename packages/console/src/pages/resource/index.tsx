import * as React from 'react';
import FLayout from '@/layouts/FLayout';
import {Tabs, Affix, Dropdown} from 'antd';
import styles from './index.less';
import FInput from '@/components/FInput';
import FButton from '@/components/FButton';
import {DownOutlined} from '@ant-design/icons';
import FMenu from '@/components/FMenu';
import FResourceCard from '@/components/FResourceCard';

const {TabPane} = Tabs;

const types = [{
  children: '全部',
  id: 1,
}, {
  children: '部分',
  id: 2,
}];

export default function () {
  return (
    <FLayout>
      <Affix offsetTop={0}>
        <Tabs
          defaultActiveKey="1"
          size="large"
          className={styles.Tabs}
          // onChange={callback}
        >
          <TabPane tab="我的资源" key="1"/>
          <TabPane tab="我的收藏" key="2"/>
        </Tabs>
      </Affix>

      <div className={styles.filter}>
        <div className={styles.filterLeft}>
          <div>
            <span>类型：</span>
            <Dropdown overlay={<FMenu dataSource={types}/>}>
              <span style={{cursor: 'pointer'}}>全部<DownOutlined style={{marginLeft: 8}}/></span>
            </Dropdown>
          </div>
          <div style={{marginLeft: 60}}>
            <span>类型：</span>
            <Dropdown overlay={<FMenu dataSource={types}/>}>
              <span style={{cursor: 'pointer'}}>全部<DownOutlined style={{marginLeft: 8}}/></span>
            </Dropdown>
          </div>

        </div>
        <div className={styles.filterRight}>
          <FInput theme="dark" className={styles.FInput}/>
          <FButton type="primary">创建资源</FButton>
        </div>
      </div>

      <div className={styles.Content}>
        <FResourceCard className={styles.FResourceCard}/>
        <FResourceCard className={styles.FResourceCard}/>
        <FResourceCard className={styles.FResourceCard}/>
        <FResourceCard className={styles.FResourceCard}/>
        <FResourceCard className={styles.FResourceCard}/>
        <FResourceCard className={styles.FResourceCard}/>
        <FResourceCard className={styles.FResourceCard}/>
        <FResourceCard className={styles.FResourceCard}/>
        <FResourceCard className={styles.FResourceCard}/>
        <FResourceCard className={styles.FResourceCard}/>
        <FResourceCard className={styles.FResourceCard}/>
        <FResourceCard className={styles.FResourceCard}/>
        <FResourceCard className={styles.FResourceCard}/>
        <div style={{width: 280}}/>
        <div style={{width: 280}}/>
        <div style={{width: 280}}/>
        <div style={{width: 280}}/>
        <div style={{width: 280}}/>
        <div style={{width: 280}}/>
      </div>
    </FLayout>
  );
}
