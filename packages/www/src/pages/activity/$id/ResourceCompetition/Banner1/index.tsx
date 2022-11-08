import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';
import * as img_wired from '@/assets/activity/wired.png';
import moment from 'moment';

interface Banner1Props {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function Banner1({ activityDetailsPage }: Banner1Props) {
  return (<div className={styles.banner1}>
    <div className={styles.banner1Content}>
      <div style={{ height: 45 }} />
      <div className={styles.banner1Content_Title}>
        <span>熬秃头创作却收益甚微的漫画、小说家们，快来Freelog实现资源发行和授权变现自由吧！</span>
        <br />
        <span>每一个笔触都值得被尊重、每一个文字都值得全额的回报~</span>
      </div>
      <div style={{ height: 40 }} />
      <div className={styles.banner1Content_Times}>
        <div className={styles.banner1Content_Time1}>
          <div className={styles.title}>活动开始</div>
          <div style={{ height: 4 }} />
          <div className={styles.time}>{activityDetailsPage.startTime?.format('YYYY·MM·DD') || 'YYYY·MM·DD'}</div>
        </div>
        <img src={img_wired} style={{ width: 38, height: 15 }} alt={''} />
        <div className={styles.banner1Content_Time2}>
          <div className={styles.title}>活动结束</div>
          <div style={{ height: 4 }} />
          {/*<div className={styles.time}>2022·02·10</div>*/}
          <div className={styles.time}>{activityDetailsPage.endTime?.format('YYYY·MM·DD') || 'YYYY·MM·DD'}</div>
        </div>
        <img src={img_wired} style={{ width: 38, height: 15 }} alt={''} />
        <div className={styles.banner1Content_Time3}>
          <div className={styles.title}>获奖公示</div>
          <div style={{ height: 4 }} />
          {
            !!activityDetailsPage.announceTime
              ? (<div className={styles.time}>{activityDetailsPage.announceTime?.format('YYYY·MM·DD')}</div>)
              : (<div className={styles.time}>{'YYYY·MM·DD'}</div>)
          }

        </div>
      </div>
    </div>
  </div>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(Banner1);
