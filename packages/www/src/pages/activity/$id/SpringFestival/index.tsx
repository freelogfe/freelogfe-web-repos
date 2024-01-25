import * as React from 'react';
import styles from './index.less';
import sharedStyles from './shared.less';
import img_banner from '@/assets/activity/SpringFestival/banner@2x.png';
import img_newcomerTitle from '@/assets/activity/SpringFestival/newcomerTitle@2x.png';
import img_koiTitle from '@/assets/activity/SpringFestival/koiTitle@2x.png';
import img_goldCoin from '@/assets/activity/SpringFestival/goldCoin@2x.png';
import img_newcomerProcess from '@/assets/activity/SpringFestival/newcomerProcess@2x.png';
import FComponentsLib from '@freelog/components-lib';
import { Popover, Space, Steps } from 'antd';
import { connect } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';
import FPropaganda from '@/components/FPropaganda';
import BonusPool from './BonusPool';
import AboutUsMore from './AboutUsMore';
import ActivitySchedule from './ActivitySchedule';
import Participation from './Participation';
import Reward from './Reward';
import ChallengeColleague from './ChallengeColleague';
import FighterRegistration from './FighterRegistration';

interface SpringFestivalProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function SpringFestival({ activityDetailsPage }: SpringFestivalProps) {
  // const [$momentTime, set$momentTime, get$momentTime] = FUtil.Hook.useGetState<Moment>(moment());

  return (<>
    <div className={styles.body}>
      <img src={img_banner} width={'100%'} style={{ display: 'block' }} alt={''} />
      <div style={{ height: 100 }} />
      <div className={sharedStyles.h1}>活动日程</div>
      <div style={{ height: 40 }} />
      <ActivitySchedule />
      <div style={{ height: 100 }} />
      <Participation />

      <div style={{ height: 100 }} />

      <div className={sharedStyles.h1}>新春奖励大放送</div>
      <div style={{ height: 40 }} />
      <Reward />
      <div style={{ height: 100 }} />

      <div className={sharedStyles.h1}>完成新春任务，赢取多多奖励</div>
      <div style={{ height: 40 }} />
      <FighterRegistration />
      <div style={{ height: 50 }} />
      <ChallengeColleague />
      <div style={{ height: 50 }} />
      <div className={styles.newcomer}>
        <img src={img_newcomerTitle} style={{ width: 432, opacity: .95 }} alt={''} />
        <div className={styles.Steps}>
          <div>
            <img src={img_goldCoin} style={{ width: 65, opacity: 1 }} alt={''} />
          </div>
          <div>
            <img src={img_goldCoin} style={{ width: 65, opacity: 1 }} alt={''} />
          </div>
        </div>
        <div style={{ height: 30 }} />
        <img src={img_newcomerProcess} style={{ width: 688, opacity: .95 }} alt={''} />
        <div style={{ height: 50 }} />
        <Space size={30}>
          <FComponentsLib.FTitleText type={'h3'} text={'首次参与freelog活动，并完成1次“新春卷王打卡挑战”任务（0/1）'} />
          <a className={[sharedStyles.button, sharedStyles.small].join(' ')}>去完成</a>
        </Space>
        <div style={{ height: 60 }} />
      </div>
      <div style={{ height: 50 }} />
      <div className={styles.koi}>
        <img src={img_koiTitle} style={{ width: 432, opacity: .95 }} alt={''} />
        <div className={styles.textContent}>
          活动期间内，在微博或小红书参与 <strong>#freelog创作激励计划#</strong> 话题打卡，发布freelog相关笔记，内容不限于分享活动安利、创作资源推荐或节点推荐等，并提交打卡相关证明，即视为成功参与。
        </div>
        <div style={{ height: 45 }} />
        <Space size={30}>
          <FComponentsLib.FTitleText type={'h3'} text={'提交微博或小红书话题打卡记录（0/1）'} />
          <a className={[sharedStyles.button, sharedStyles.small].join(' ')}>去完成</a>
        </Space>
        <div style={{ height: 60 }} />
      </div>
      <div style={{ height: 50 }} />
      <BonusPool />
      <div style={{ height: 100 }} />
      <div className={sharedStyles.h1}>更多的了解我们</div>
      <div style={{ height: 40 }} />
      <AboutUsMore />
      <div style={{ height: 100 }} />
    </div>
    <FPropaganda />
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div style={{ border: '1px solid #979797', width: 680, opacity: .15 }} />
    </div>
    <FComponentsLib.FPageFooter PopoverPatch={Popover} />
  </>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(SpringFestival);
