import React from 'react';
import styles from './index.less';
import {Layout, Dropdown} from 'antd';
import {DownOutlined} from '@ant-design/icons';
import FMenu from '@/components/FMenu';
import avatarSrc from '../../assets/avatar.png';
import {PlusOutlined} from '@ant-design/icons';
import FButton from '@/components/FButton';
import FInput from '@/components/FInput';

const {Header, Content, Footer} = Layout;

const discover = [
  {
    children: '发现市场',
    id: 1
  },
  {
    children: '发现节点',
    id: 2
  },
];

const create = [
  {
    children: '创建资源',
    id: 1
  },
  {
    children: '创建节点',
    id: 2
  },
];

const types = [{
  id: 1,
  children: '中文'
}, {
  id: 2,
  children: 'English'
}];

interface FLayoutProps {
  children: React.ReactNode | React.ReactNodeArray;
}

export default function ({children}: FLayoutProps) {
  return (
    <Layout className={styles.Layout}>
      <Header className={styles.header}>
        <div className={styles.headerLeft}>
          <a className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')}/>
          <div className={styles.MenuBar}>
            <Dropdown overlay={<FMenu dataSource={discover}/>}>
              <a className={styles.Menu}>发现</a>
            </Dropdown>
            <a className={styles.Menu}>存储空间</a>
            <a className={styles.Menu}>资源管理</a>
            <a className={styles.Menu}>节点管理</a>
            <a className={styles.Menu}>合约管理</a>
          </div>
        </div>
        <div className={styles.headerRight}>
          <FInput
            className={styles.FInput}
            // placeholder="Search in Freelog"
            size="small"
            theme="dark"
            // disabled={true}
          />

          <Dropdown overlay={<FMenu dataSource={create}/>}>
            <a className={styles.create}>
              <FButton
                type="primary"
                shape="circle"
                icon={<PlusOutlined/>}
                // disabled={true}
              />
            </a>
          </Dropdown>

          <a className={styles.avatar}>
            <img src={avatarSrc} alt={'avatar'}/>
          </a>
        </div>
      </Header>
      <Content className={styles.Content}>
        <div>{children}</div>
      </Content>
      <Footer className={styles.Footer}>
        <div>
          <div>关于freelog</div>
          <div style={{width: 30}}/>
          <Dropdown overlay={<FMenu dataSource={types}/>}>
            <div style={{cursor: 'pointer'}}>中文<DownOutlined style={{marginLeft: 8}}/></div>
          </Dropdown>
          <div style={{width: 120}}/>
          <span>粤ICP备17085716号-1</span>
          <div style={{width: 30}}/>
          <span>Copyright© 2020 freelog freelog.com版权所有</span>
        </div>
      </Footer>
    </Layout>
  );
}
