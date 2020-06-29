import * as React from 'react';
import FLayout from '@/layouts/FLayout';
import {Tabs, Affix, Dropdown} from 'antd';
import styles from './index.less';
import FInput from '@/components/FInput';
import FButton from '@/components/FButton';
import {DownOutlined} from '@ant-design/icons';
import FMenu from '@/components/FMenu';
import FResourceCard from '@/components/FResourceCard';
import FPagination from '@/components/FPagination';
import FAffixTabs from '@/components/FAffixTabs';
import stringMatching = jasmine.stringMatching;

const types = [{
  children: '全部',
  id: 1,
}, {
  children: '部分',
  id: 2,
}];

const navs = [
  {
    id: 1,
    text: '我的资源',
  },
  {
    id: 2,
    text: '我的收藏',
  },
];

export default function () {
  return (
    <FLayout>
      <FAffixTabs tabs={navs}/>

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
        <FResourceCard isFavorite={true} className={styles.FResourceCard}/>
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
        <div className={styles.bottomPadding}/>
        <div className={styles.bottomPadding}/>
        <div className={styles.bottomPadding}/>
        <div className={styles.bottomPadding}/>
      </div>
      <div style={{height: 10}}/>
      <FPagination className={styles.FPagination}/>
      <div style={{height: 100}}/>
    </FLayout>
  );
}
