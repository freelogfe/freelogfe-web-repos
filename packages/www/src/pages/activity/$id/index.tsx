import * as React from 'react';
import styles from './index.less';
import FLoadingTip from '@/components/FLoadingTip';

import Banner1 from './Banner1';
import Participations from './Participations';
import Reward from './Reward';
import Strategy from './Strategy';
import Banner2 from './Banner2';

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
    <div style={{ height: 100 }} />
    <Strategy />
    <div style={{ height: 100 }} />
    <Banner2 />
    <div style={{ height: 100 }} />

  </div>);
}

export default Activity;
