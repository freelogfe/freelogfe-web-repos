import React from 'react';
import styles from './index.less';
import {Layout, Dropdown, Button} from 'antd';
import FMenu from '@/components/FMenu';
import avatarSrc from '../../assets/avatar.png';
import {PlusOutlined, SearchOutlined} from '@ant-design/icons';
import FButton from '@/components/FButton';
import FInput from '@/components/FInput';

const {Header} = Layout;

export default function (props: any) {
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.headerLeft}>
          <i className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')}/>
          <div className={styles.MenuBar}>
            <a className={styles.Menu}>发现</a>
            <a className={styles.Menu}>存储空间</a>
            <a className={styles.Menu}>资源管理</a>
            <a className={styles.Menu}>节点管理</a>
            <a className={styles.Menu}>合约管理</a>
          </div>
        </div>
        <div className={styles.headerRight}>
          {/*<Button type="primary" >*/}
          {/*  创建资源*/}
          {/*</Button>*/}
          <FInput
            className={styles.FInput}
            placeholder="Search in Freelog"
            prefix={<SearchOutlined/>}
            disabled={true}
          />

          <FButton
            type="primary"
            shape="circle"
            icon={<PlusOutlined/>}
            // disabled={true}
          />

          <a className={styles.avatar}>
            <img src={avatarSrc} alt={'avatar'}/>
          </a>
        </div>
      </Header>
    </Layout>
  );
}
