import * as React from 'react';
import styles from './index.less';
import { ActivityDetailsPageModelState } from '@/models/activityDetailsPage';
import * as AHooks from 'ahooks';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

interface ExperienceOfficerProps {
  activityDetailsPage: ActivityDetailsPageModelState;
}

function ExperienceOfficer({}: ExperienceOfficerProps) {
  AHooks.useMount(() => {
    self._czc?.push(['_trackPageview', self.location.pathname]);
  });

  return (<div>ExperienceOfficer</div>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(ExperienceOfficer);
