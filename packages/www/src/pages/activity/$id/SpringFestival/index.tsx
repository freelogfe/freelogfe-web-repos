import * as React from 'react';
import styles from './index.less';
import img_banner from '@/assets/activity/SpringFestival/banner@2x.png';
import FComponentsLib from '@freelog/components-lib';
import { Space } from 'antd';
import { connect } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';

interface SpringFestivalProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function SpringFestival({ activityDetailsPage }: SpringFestivalProps) {
  return (<div className={styles.body}>
    <img src={img_banner} width={'100%'} style={{ display: 'block' }} />
    <div style={{ height: 100 }} />
    <div className={styles.h1}>活动日程</div>
    <div style={{ height: 40 }} />
    <div className={styles.schedule}>
      <div className={styles.activityTimeCard}>
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
    </div>
    <div style={{ height: 100 }} />
    <div className={styles.h1}>参与方式</div>
    <div style={{ height: 100 }} />
  </div>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(SpringFestival);
