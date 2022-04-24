import * as React from 'react';
import styles from './index.less';
import { FWarning } from '@/components/FIcons';
import { Space } from 'antd';
import { FTextBtn } from '@/components/FButton';

interface DashboardProps {

}

function Dashboard({}: DashboardProps) {
  return (<div>
    <div className={styles.notice}>
      <div className={styles.noticeContent}>
        <Space size={10}>
          <FWarning />
          <span>系统维护通知：2月1日至3日进行系统维护。</span>
        </Space>
        <Space size={15}>
          <span>2020/12/23</span>
          <FTextBtn type='primary'>查看详情</FTextBtn>
        </Space>
      </div>
    </div>
  </div>);
}

export default Dashboard;
