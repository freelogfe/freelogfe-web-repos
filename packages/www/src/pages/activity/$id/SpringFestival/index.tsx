import * as React from 'react';
import styles from './index.less';
import img_banner from '@/assets/activity/SpringFestival/banner@2x.png';
import img_activityTimeCard from '@/assets/activity/SpringFestival/activityTimeCard@2x.png';
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
  </div>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(SpringFestival);
