import * as React from 'react';
import styles from './index.less';
import img_poolTitle from '@/assets/activity/SpringFestival/poolTitle@2x.png';
import FEnergyBall from '@/components/FEnergyBall';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { FUtil } from '@freelog/tools-lib';
import moment, { Moment } from 'moment';
import { connect } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';

interface BonusPoolProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function BonusPool({ activityDetailsPage }: BonusPoolProps) {
  const [$momentTime, set$momentTime, get$momentTime] = FUtil.Hook.useGetState<Moment>(moment());

  const [$updateTime, set$updateTime, get$updateTime] = FUtil.Hook.useGetState<string>(activityDetailsPage.endTime
    ? moment().isBefore(activityDetailsPage.endTime)
      ? (get$momentTime().subtract(12, 'hours').format('YYYY-MM-DD') + ' 12:00:00')
      : activityDetailsPage.endTime.format('YYYY-MM-DD HH:mm:ss')
    : 'YYYY-MM-DD HH:mm:ss');

  return (<div className={styles.pool}>
    <img src={img_poolTitle} style={{ width: 636, opacity: .95 }} alt={''} />
    <FEnergyBall percent={50} />
    <div className={styles.poolLabels}>
      <label className={styles.label1} style={{ bottom: 20, left: -210 }}>参与20人</label>
      <label className={styles.label1} style={{ bottom: 50, left: 120 }}>参与50人</label>
      <label className={styles.label1} style={{ bottom: 100, left: -220 }}>参与100人</label>
      <label className={styles.label1} style={{ bottom: 200, left: 120 }}>参与200人</label>

      <label className={styles.label2} style={{ bottom: 20, left: -30 }}>已瓜分¥200</label>
      <label className={styles.label2} style={{ bottom: 50, left: -30 }}>已瓜分¥666</label>
      {/*<label className={styles.label2} style={{ bottom: 100, left: -35 }}>已瓜分¥1666</label>*/}
      {/*<label className={styles.label2} style={{ bottom: 200, left: -35 }}>已瓜分¥2666</label>*/}

      {/*<label className={styles.label3} style={{ bottom: 20, left: -38 }}>¥200等待瓜分</label>*/}
      {/*<label className={styles.label3} style={{ bottom: 50, left: -38 }}>¥666等待瓜分</label>*/}
      <label className={styles.label3} style={{ bottom: 100, left: -40 }}>¥1666等待瓜分</label>
      <label className={styles.label3} style={{ bottom: 200, left: -40 }}>¥2666等待瓜分</label>
    </div>
    <div style={{ height: 60 }} />
    <Space size={20}>
      <FComponentsLib.FContentText type={'negative'} text={'每天12点更新'} />
      <FComponentsLib.FContentText type={'negative'} text={'最近更新时间：' + $updateTime} />
    </Space>
    <div style={{ height: 60 }} />
  </div>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(BonusPool);
