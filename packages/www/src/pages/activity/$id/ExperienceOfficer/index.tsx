import * as React from 'react';
import styles from './index.less';
import { ActivityDetailsPageModelState } from '@/models/activityDetailsPage';
import * as AHooks from 'ahooks';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import img_banner from '@/assets/activity/ExperienceOfficer/banner@2x.png';
import img_award1 from '@/assets/activity/ExperienceOfficer/award1@2x.png';
import img_award2 from '@/assets/activity/ExperienceOfficer/award2@2x.png';
import { Affix, Popover, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FPropaganda from '@/components/FPropaganda';

interface ExperienceOfficerProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function ExperienceOfficer({}: ExperienceOfficerProps) {

  const ref = React.useRef(null);

  AHooks.useMount(() => {
    self._czc?.push(['_trackPageview', self.location.pathname]);
  });

  return (<div className={styles.styles} ref={ref}>
    <img className={styles.banner} src={img_banner} alt={''} />
    <Affix
      offsetTop={0}
      target={() => {
        return self.document.getElementById('layout-content');
      }}
    >
      <div className={styles.AffixContent}>
        <div className={styles.links}>
          <a className={[styles.link, styles.activated].join(' ')}>
            活动日程
          </a>
          <a className={styles.link}>活动奖励</a>
          <a className={styles.link}>活动玩法</a>
          <a className={styles.link}>如何参与</a>
          <a className={styles.link}>活动规则</a>
        </div>
      </div>
    </Affix>
    <div className={styles.content}>
      <div style={{ height: 40 }} />
      <div className={styles.activityTime}>
        <div className={styles.activityTimeCard}>
          <Space size={10}>
            <div className={styles.dot} style={{ backgroundColor: '#42C28C' }} />
            <div className={styles.text}>活动开启</div>
          </Space>
          <div style={{ height: 20 }} />
          <div className={styles.text}>2023/mm/dd</div>
        </div>
        <div className={styles.activityTimeCard}>
          <Space size={10}>
            <div className={styles.dot} style={{ backgroundColor: '#EE4040' }} />
            <div className={styles.text}>活动结束</div>
          </Space>
          <div style={{ height: 20 }} />
          <div className={styles.text}>2023/mm/dd</div>
        </div>
        <div className={styles.activityTimeCard}>
          <Space size={10}>
            <div className={styles.dot} style={{ backgroundColor: '#2784FF' }} />
            <div className={styles.text}>结果公示</div>
          </Space>
          <div style={{ height: 20 }} />
          <div className={styles.text}>2023/mm/dd</div>
        </div>
      </div>
      <div style={{ height: 50 }} />
      <div className={styles.award}>
        <div style={{ height: 60 }} />
        <div className={styles.h1}>体验官优秀奖</div>
        <div style={{ height: 10 }} />
        <div className={styles.h2}>体验官积分排名前八者可依次获得现金奖励</div>
        <div style={{ height: 40 }} />
        <img style={{ width: 820 }} src={img_award1} alt={''} />
        <div style={{ height: 50 }} />
        <Space size={20}>
          <div className={styles.horizontalLine} />
          <div className={styles.h3}>排名将会在活动结束后一周时公示，敬请期待</div>
          <div className={styles.horizontalLine} />
        </Space>
        <div style={{ height: 60 }} />
        <div className={styles.longDashed} />
        <div style={{ height: 60 }} />
        <div className={styles.h1}>体验官优秀奖</div>
        <div style={{ height: 10 }} />
        <div className={styles.h2}>体验官积分排名前八者可依次获得现金奖励</div>
        <div style={{ height: 40 }} />
        <img style={{ width: 560 }} src={img_award2} alt={''} />
        <div style={{ height: 50 }} />
        <Space size={20}>
          <div className={styles.horizontalLine} />
          <div className={styles.h3}>排名将会在活动结束后一周时公示，敬请期待</div>
          <div className={styles.horizontalLine} />
        </Space>
        <div style={{ height: 60 }} />
      </div>
      <div style={{ height: 50 }} />
      <div className={styles.questionnaire}>


      </div>

      <div style={{ height: 50 }} />
      <div className={styles.point}>

      </div>

      <div style={{ height: 50 }} />
      <div className={styles.regulation}>

      </div>
      <div style={{ height: 100 }} />

    </div>
    <FPropaganda style={{ backgroundColor: '#fff' }} />
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div style={{ border: '1px solid #979797', width: 680, opacity: .15 }} />
    </div>
    <FComponentsLib.FPageFooter
      PopoverPatch={Popover}
      style={{}}
    />
  </div>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(ExperienceOfficer);
