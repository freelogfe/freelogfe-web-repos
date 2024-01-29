import * as React from 'react';
import styles from './index.less';
import img_activityTimeCard from '@/assets/activity/SpringFestival/activityTimeCard@2x.png';
import { Space } from 'antd';
import { ActivityDetailsPageModelState } from '@/models/activityDetailsPage';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

interface ActivityScheduleProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function ActivitySchedule({ activityDetailsPage }: ActivityScheduleProps) {
  return (<div className={styles.schedule}>
    <div className={styles.activityTimeCard} style={{ backgroundImage: `url(${img_activityTimeCard})` }}>
      <Space size={10}>
        <div className={styles.dot} style={{ backgroundColor: '#42C28C' }} />
        <div className={styles.text}>活动开启</div>
      </Space>
      <div style={{ height: 20 }} />
      <div className={styles.text}>{activityDetailsPage.startTime?.format('YYYY/MM/DD') || 'YYYY·MM·DD'}</div>
    </div>
    <div className={styles.activityTimeCard}>
      <Space size={10}>
        <div className={styles.dot} style={{ backgroundColor: '#EE4040' }} />
        <div className={styles.text}>活动结束</div>
      </Space>
      <div style={{ height: 20 }} />
      <div className={styles.text}>{activityDetailsPage.endTime?.format('YYYY/MM/DD') || 'YYYY·MM·DD'}</div>
    </div>
    <div className={styles.activityTimeCard}>
      <Space size={10}>
        <div className={styles.dot} style={{ backgroundColor: '#2784FF' }} />
        <div className={styles.text}>结果公示</div>
      </Space>
      <div style={{ height: 20 }} />
      <div className={styles.text}>{activityDetailsPage.announceTime?.format('YYYY/MM/DD') || 'YYYY·MM·DD'}</div>
    </div>
  </div>);
}

export default  connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(ActivitySchedule);
