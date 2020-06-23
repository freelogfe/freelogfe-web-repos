import React from 'react';
import styles from './index.less';
import {Layout, Dropdown, Button} from 'antd';
import FMenu from '@/components/FMenu';
import avatarSrc from '../../assets/avatar.png';
import {PlusOutlined, SearchOutlined} from '@ant-design/icons';
import FButton from '@/components/FButton';
import FInput from '@/components/FInput';

const {Header, Content, Footer} = Layout;

export default function (props: any) {
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.headerLeft}>
          <a className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')}/>
          <div className={styles.MenuBar}>
            <a className={styles.Menu}>发现</a>
            <a className={styles.Menu}>存储空间</a>
            <a className={styles.Menu}>资源管理</a>
            <a className={styles.Menu}>节点管理</a>
            <a className={styles.Menu}>合约管理</a>
          </div>
        </div>
        <div className={styles.headerRight}>
          <FInput
            className={styles.FInput}
            placeholder="Search in Freelog"
            prefix={<SearchOutlined/>}
            // disabled={true}
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
      <Content style={{padding: '0 50px'}}>
        <FMenu/>
      </Content>
      <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  );
}
