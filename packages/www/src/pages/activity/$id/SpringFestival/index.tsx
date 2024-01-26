import * as React from 'react';
import styles from './index.less';
import sharedStyles from './shared.less';
import img_banner from '@/assets/activity/SpringFestival/banner@2x.png';
import FComponentsLib from '@freelog/components-lib';
import { Popover } from 'antd';
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
import NewcomerRedPacket from './NewcomerRedPacket';
import NewYearKoi from './NewYearKoi';

interface SpringFestivalProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function SpringFestival({ activityDetailsPage }: SpringFestivalProps) {
  // const [$momentTime, set$momentTime, get$momentTime] = FUtil.Hook.useGetState<Moment>(moment());
  const ref_content2 = React.useRef<HTMLDivElement>(null);
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
      <div style={{ height: 40 }} ref={ref_content2} />
      <FighterRegistration />
      <div style={{ height: 50 }} />
      <ChallengeColleague />
      <div style={{ height: 50 }} />
      <NewcomerRedPacket
        onClick={() => {
          const info = ref_content2.current?.getBoundingClientRect();
          self.document.getElementById('layout-content')?.scrollBy({
            top: (info?.top || 0),
            behavior: 'smooth',
          });
        }}
      />
      <div style={{ height: 50 }} />
      <NewYearKoi />
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
