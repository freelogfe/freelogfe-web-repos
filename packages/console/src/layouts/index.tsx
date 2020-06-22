import React from 'react';
import styles from './index.less';
import {Layout} from 'antd';

const {Header} = Layout;

const BasicLayout: React.FC = props => {
  return (
    <Layout>
      <Header className={styles.header}>
        <div>
          <i className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')}/>
          <div></div>
        </div>
        <div>
          5678
        </div>
      </Header>
    </Layout>
  );
};

export default BasicLayout;
