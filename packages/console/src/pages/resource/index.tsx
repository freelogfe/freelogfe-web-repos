import * as React from 'react';
import FLayout from '@/layouts/FLayout';
import {Dropdown} from 'antd';
import styles from './index.less';
import FInput from '@/components/FInput';
import {FNormalButton} from '@/components/FButton';
import {DownOutlined} from '@ant-design/icons';
import FMenu from '@/components/FMenu';
import FResourceCard from '@/components/FResourceCard';
import FPagination from '@/components/FPagination';
import FAffixTabs from '@/components/FAffixTabs';

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

const resource = {
  cover: '',
  title: '这里是发行名称这里是发行名称这这里是发行名称这里是发行名称这',
  version: '1.0.10',
  policy: ['免费1', '免费2', '免费3'],
  type: 'image',
};

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
              <span style={{cursor: 'pointer'}}>全部<DownOutlined style={{marginLeft: 10}}/></span>
            </Dropdown>
          </div>

        </div>
        <div className={styles.filterRight}>
          <FInput theme="dark" className={styles.FInput}/>
          <FNormalButton type="primary">创建资源</FNormalButton>
        </div>
      </div>

      <div className={styles.Content}>
        <FResourceCard resource={resource} type="resource" className={styles.FResourceCard}/>
        <FResourceCard resource={resource} type="resource" className={styles.FResourceCard}/>
        <div className={styles.bottomPadding}/>
        <div className={styles.bottomPadding}/>
        <div className={styles.bottomPadding}/>
        <div className={styles.bottomPadding}/>
      </div>
      <div style={{height: 10}}/>
      <FPagination className={styles.FPagination}/>
    </FLayout>
  );
}
