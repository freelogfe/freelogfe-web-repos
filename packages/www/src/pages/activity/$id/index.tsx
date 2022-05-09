import * as React from 'react';
import styles from './index.less';
import FLoadingTip from '@/components/FLoadingTip';

import Banner1 from '@/pages/activity/$id/Banner1';
import Participations from '@/pages/activity/$id/Participations';
import Reward from '@/pages/activity/$id/Reward';

interface ActivityProps {

}


function Activity({}: ActivityProps) {


  return (<div className={styles.style}>
    {/*<FLoadingTip height={window.innerHeight - 170} />*/}
    <Banner1 />
    <div style={{ height: 266 }} />
    <Participations />
    <div style={{ height: 100 }} />
    <Reward />
  </div>);
}

export default Activity;
