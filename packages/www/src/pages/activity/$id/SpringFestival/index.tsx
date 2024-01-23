import * as React from 'react';
import styles from './index.less';
import img_banner from '@/assets/activity/SpringFestival/banner@2x.png';
import img_activityTimeCard from '@/assets/activity/SpringFestival/activityTimeCard@2x.png';
import img_reward from '@/assets/activity/SpringFestival/reward@2x.png';
import img_taskTitle from '@/assets/activity/SpringFestival/taskTitle@2x.png';
import img_goldCoin from '@/assets/activity/SpringFestival/goldCoin@2x.png';
import FComponentsLib from '@freelog/components-lib';
import { Space, Steps } from 'antd';
import { connect } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';
import Steps21 from '@/pages/activity/$id/SpringFestival/Steps21';

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
    </div>
    <div style={{ height: 100 }} />
    <div className={styles.participation}>
      <div className={styles.h1}>参与方式</div>

      <div className={styles.textContent} style={{ top: 108, left: 270 }}>
        前往freelog网页端，发布带有“<strong>新春召集令，freelog创作激励计划启动！</strong>”标签的原创资源并成功签约至展示节点，完成一次节点或展品分享后即视为参与此次活动
      </div>
      <div className={styles.textContent} style={{ top: 290, left: 182 }}>
        不限制内容形式，<strong>原创小说/文章、漫画、图片、音乐、播客、视频、游戏/主题/插件开发资源</strong>等均可发布
      </div>
      <div className={styles.textContent} style={{ top: 464, left: 330 }}>
        由于平台尚在测试阶段，活动功能未全面开放。如您要参与活动，需点击下方报名入口获取内测资格。
      </div>

      <Space size={25}>
        <a className={styles.button}>立即报名</a>
        <a className={styles.button}>查看操作教程</a>
        <a className={styles.button}>活动规则</a>
      </Space>
    </div>

    <div style={{ height: 100 }} />

    <div className={styles.h1}>新春奖励大放送</div>
    <div style={{ height: 40 }} />
    <img src={img_reward} style={{ width: 1060 }} />
    <div style={{ height: 50 }} />
    <a className={styles.button}>查看获奖公示</a>
    <div style={{ height: 100 }} />

    <div className={styles.h1}>完成新春任务，赢取多多奖励</div>

    <div style={{ height: 40 }} />
    <div className={styles.task}>
      {/*<div style={{ height: 45 }} />*/}
      <img src={img_taskTitle} style={{ width: 520, opacity: .95 }} alt={''} />
      <div className={styles.Steps}>
        <div>
          {/*<img src={img_goldCoin} style={{ width: 65 }} />*/}
          <FComponentsLib.FIcons.FCheck style={{ fontSize: 64, opacity: .3 }} />
        </div>
        <div>
          <img src={img_goldCoin} style={{ width: 65 }} alt={''} />
        </div>
        <div>
          <img src={img_goldCoin} style={{ width: 65 }} alt={''} />
        </div>
        <div>
          <img src={img_goldCoin} style={{ width: 65 }} alt={''} />
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
        <a className={[styles.button, styles.small, styles.disabled].join(' ')}>已完成</a>
      </div>
      <div style={{ borderBottom: '1px solid rgba(0,0,0,.1)' }} />
      <div className={styles.taskItem}>
        <FComponentsLib.FTitleText type={'h3'} text={'签约一个资源到节点（0/1）'} />
        <a className={[styles.button, styles.small].join(' ')}>去完成</a>
      </div>
      <div style={{ borderBottom: '1px solid rgba(0,0,0,.1)' }} />
      <div className={styles.taskItem}>
        <FComponentsLib.FTitleText type={'h3'} text={'分享一次节点或展品（0/1）'} />
        <a className={[styles.button, styles.small].join(' ')}>去完成</a>
      </div>
      <div style={{ borderBottom: '1px solid rgba(0,0,0,.1)' }} />
      <div style={{ height: 70 }} />
      <FComponentsLib.FTitleText type={'h1'} text={'重要通知'} />
      <div style={{ height: 20 }} />
      <FComponentsLib.FTitleText
        type={'h3'}
        text={'成功参与此次新春活动的用户，将有机会角逐首期编辑精选活动的大奖，优质资源作者或节点运营商将获得丰厚奖励，期待您的优质内容哦！'}
        style={{ width: 760, textAlign: 'center' }}
      />
      <div style={{ height: 20 }} />
      <FComponentsLib.FTextBtn type={'primary'}>前往查看</FComponentsLib.FTextBtn>
      <div style={{ height: 60 }} />
    </div>
    <div style={{ height: 100 }} />
  </div>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(SpringFestival);
