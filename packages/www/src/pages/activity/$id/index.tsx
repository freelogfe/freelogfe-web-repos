import * as React from 'react';
import styles from './index.less';
import FLoadingTip from '@/components/FLoadingTip';

import Banner1 from '@/pages/activity/$id/Banner1';
import Participations from '@/pages/activity/$id/Participations';

interface ActivityProps {

}


function Activity({}: ActivityProps) {


  return (<div className={styles.style}>
    {/*<FLoadingTip height={window.innerHeight - 170} />*/}
    <Banner1 />
    <div style={{ height: 266 }} />
    <Participations />
    <div style={{ height: 100 }} />
    <div className={styles.reward}>
      <div className={styles.rewardTitle}>活动奖励</div>
      <div style={{ height: 40 }} />
    </div>
  </div>);
}

export default Activity;
