import * as React from 'react';
import styles from './index.less';
import Banner1 from '@/pages/activity/$id/ResourceCompetition/Banner1';
import Participations from '@/pages/activity/$id/ResourceCompetition/Participations';
import Reward from '@/pages/activity/$id/ResourceCompetition/Reward';
import Strategy from '@/pages/activity/$id/ResourceCompetition/Strategy';
import Banner2 from '@/pages/activity/$id/ResourceCompetition/Banner2';
// import FPageFooter from '@/components/FPageFooter';
import FComponentsLib from '@freelog/components-lib';
import { Popover } from 'antd';

interface ResourceCompetitionProps {

}

function ResourceCompetition({}: ResourceCompetitionProps) {
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

    <FComponentsLib.FPageFooter PopoverPatch={Popover} />
  </div>);
}

export default ResourceCompetition;
