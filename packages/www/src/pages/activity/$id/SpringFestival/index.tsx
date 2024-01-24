import * as React from 'react';
import styles from './index.less';
import sharedStyles from './shared.less';
import img_banner from '@/assets/activity/SpringFestival/banner@2x.png';
import img_activityTimeCard from '@/assets/activity/SpringFestival/activityTimeCard@2x.png';
import img_reward from '@/assets/activity/SpringFestival/reward@2x.png';
import img_taskTitle from '@/assets/activity/SpringFestival/taskTitle@2x.png';
import img_colleagueTitle from '@/assets/activity/SpringFestival/colleagueTitle@2x.png';
import img_newcomerTitle from '@/assets/activity/SpringFestival/newcomerTitle@2x.png';
import img_koiTitle from '@/assets/activity/SpringFestival/koiTitle@2x.png';
// import img_poolTitle from '@/assets/activity/SpringFestival/poolTitle@2x.png';
import img_goldCoin from '@/assets/activity/SpringFestival/goldCoin@2x.png';
import img_colleagueProcess from '@/assets/activity/SpringFestival/colleagueProcess@2x.png';
import img_newcomerProcess from '@/assets/activity/SpringFestival/newcomerProcess@2x.png';
import img_xiaohongshuAvatar from '@/assets/activity/SpringFestival/xiaohongshuAvatar.png';
import img_weibaoAvatar from '@/assets/activity/SpringFestival/weibaoAvatar.png';
import img_QQChatQR from '@/assets/activity/SpringFestival/QQChatQR.jpg';
import img_weixinQR from '@/assets/activity/SpringFestival/weixinQR.jpg';
import FComponentsLib from '@freelog/components-lib';
import { Popover, Space, Steps } from 'antd';
import { connect } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';
import Steps21 from './Steps21';
import Steps5 from './Steps5';
import FEnergyBall from '@/components/FEnergyBall';
import FPropaganda from '@/components/FPropaganda';
import { FUtil } from '@freelog/tools-lib';
import moment, { Moment } from 'moment';
import fCenterMessage from '@/components/fCenterMessage';
import BonusPool from './BonusPool';
import AboutUsMore from './AboutUsMore';
import ActivitySchedule from './ActivitySchedule';
import Participation from './Participation';

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
      <img src={img_reward} style={{ width: 1060 }} alt={''} />
      <div style={{ height: 50 }} />
      <a
        className={sharedStyles.button}
        onClick={() => {
          if (!activityDetailsPage.announceTime) {
            fCenterMessage({ message: '公示时间无效' });
            return;
          }
          if (moment().isBefore(activityDetailsPage.announceTime)) {
            fCenterMessage({ message: '未到公示时间' });
            return;
          }
        }}
      >查看获奖公示</a>
      <div style={{ height: 100 }} />

      <div className={sharedStyles.h1}>完成新春任务，赢取多多奖励</div>

      <div style={{ height: 40 }} />
      <div className={styles.registration}>
        {/*<div style={{ height: 45 }} />*/}
        <img src={img_taskTitle} style={{ width: 520, opacity: .95 }} alt={''} />
        <div className={styles.Steps}>
          <div>
            {/*<img src={img_goldCoin} style={{ width: 65 }} />*/}
            <FComponentsLib.FIcons.FCheck style={{ fontSize: 64, opacity: 1 }} />
          </div>
          <div>
            <img src={img_goldCoin} style={{ width: 65, opacity: 1 }} alt={''} />
          </div>
          <div>
            <img src={img_goldCoin} style={{ width: 65, opacity: .3 }} alt={''} />
          </div>
          <div>
            <img src={img_goldCoin} style={{ width: 65, opacity: .3 }} alt={''} />
          </div>
        </div>
        <div style={{ height: 15 }} />
        <div className={styles.Steps}>
          <div>
            <FComponentsLib.FContentText type={'normal'} text={'成功参与活动'} />
          </div>
          <div>
            <FComponentsLib.FContentText type={'normal'} text={'瓜分888元'} />
          </div>
          <div>
            <FComponentsLib.FContentText type={'normal'} text={'再瓜分1888元'} />
          </div>
          <div>
            <FComponentsLib.FContentText type={'normal'} text={'再瓜分2888元'} />
          </div>
        </div>
        <div style={{ height: 15 }} />
        <div>
          <Steps21 step={12} />
        </div>
        <div style={{ height: 15 }} />
        <div className={styles.Steps}>
          <div>
            <FComponentsLib.FContentText type={'normal'} text={'打卡天数 1 天'} />
          </div>
          <div>
            <FComponentsLib.FContentText type={'normal'} text={'打卡天数 1/7 天'} />
          </div>
          <div>
            <FComponentsLib.FContentText type={'normal'} text={'打卡天数 1/14 天'} />
          </div>
          <div>
            <FComponentsLib.FContentText type={'normal'} text={'打卡天数 1/21 天'} />
          </div>
        </div>
        <div style={{ height: 70 }} />
        <FComponentsLib.FTitleText type={'h1'} text={'今日打卡任务'} />
        <div style={{ height: 20 }} />
        <div style={{ borderBottom: '1px solid rgba(0,0,0,.1)', width: 760 }} />
        <div className={styles.taskItem}>
          <div>
            <FComponentsLib.FTitleText type={'h3'} text={'发布一个原创资源（1/1）'} />
            <div style={{ height: 10 }} />
            <FComponentsLib.FContentText type={'additional2'} text={'别忘了为资源添加“新春召集令，freelog创作激励计划启动！”活动标签哦！'} />
          </div>
          <a
            className={[sharedStyles.button, sharedStyles.small, sharedStyles.disabled].join(' ')}
            onClick={() => {
              self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.resourceCreatorEntry());
            }}
          >已完成</a>
        </div>
        <div style={{ borderBottom: '1px solid rgba(0,0,0,.1)', width: 760 }} />
        <div className={styles.taskItem}>
          <FComponentsLib.FTitleText type={'h3'} text={'签约一个资源到节点（0/1）'} />
          <a
            className={[sharedStyles.button, sharedStyles.small].join(' ')}
            onClick={() => {

            }}
          >去完成</a>
        </div>
        <div style={{ borderBottom: '1px solid rgba(0,0,0,.1)', width: 760 }} />
        <div className={styles.taskItem}>
          <FComponentsLib.FTitleText type={'h3'} text={'分享一次节点或展品（0/1）'} />
          <a
            className={[styles.button, sharedStyles.small].join(' ')}
            onClick={() => {

            }}
          >去完成</a>
        </div>
        <div style={{ borderBottom: '1px solid rgba(0,0,0,.1)', width: 760 }} />
        <div style={{ height: 70 }} />
        <FComponentsLib.FTitleText type={'h1'} text={'重要通知'} />
        <div style={{ height: 20 }} />
        <FComponentsLib.FTitleText
          type={'h3'}
          text={'成功参与此次新春活动的用户，将有机会角逐首期编辑精选活动的大奖，优质资源作者或节点运营商将获得丰厚奖励，期待您的优质内容哦！'}
          style={{ width: 760, textAlign: 'center' }}
        />
        <div style={{ height: 20 }} />
        <FComponentsLib.FTextBtn
          type={'primary'}
          onClick={() => {

          }}
        >前往查看</FComponentsLib.FTextBtn>
        <div style={{ height: 60 }} />
      </div>
      <div style={{ height: 50 }} />
      <div className={styles.colleague}>
        <img src={img_colleagueTitle} style={{ width: 432, opacity: .95 }} alt={''} />
        <div className={styles.Steps}>
          <div>
            <img src={img_goldCoin} style={{ width: 65, opacity: 1 }} alt={''} />
          </div>
          <div>
            <img src={img_goldCoin} style={{ width: 65, opacity: .3 }} alt={''} />
          </div>
          <div>
            <img src={img_goldCoin} style={{ width: 65, opacity: .3 }} alt={''} />
          </div>
        </div>
        <div style={{ height: 15 }} />
        <div className={styles.Steps}>
          <div>
            <FComponentsLib.FContentText type={'normal'} text={'瓜分800元'} />
          </div>
          <div>
            <FComponentsLib.FContentText type={'normal'} text={'再瓜分600元'} />
          </div>
          <div>
            <FComponentsLib.FContentText type={'normal'} text={'再瓜分600元'} />
          </div>
        </div>
        <div style={{ height: 15 }} />
        <div>
          <Steps5 step={3} />
        </div>
        <div style={{ height: 15 }} />
        <div className={styles.Steps}>
          <div>
            <FComponentsLib.FContentText type={'normal'} text={'邀请 1 位'} />
          </div>
          <div>
            <FComponentsLib.FContentText type={'normal'} text={'邀请 1/3 位'} />
          </div>
          <div>
            <FComponentsLib.FContentText type={'normal'} text={'邀请 1/5 位'} />
          </div>
        </div>
        <div style={{ height: 70 }} />
        <FComponentsLib.FTitleText type={'h1'} text={'召唤好友  共赴全员瓜分盛宴'} />
        <img src={img_colleagueProcess} style={{ width: 967, opacity: .95 }} alt={''} />
        <a
          className={sharedStyles.button}
        >去召唤好友</a>
        <div style={{ height: 60 }} />
      </div>
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
