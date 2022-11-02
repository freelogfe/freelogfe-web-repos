import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FServiceAPI, FI18n, FUtil } from '@freelog/tools-lib';

interface QuestionnaireProps {

}

function Questionnaire({}: QuestionnaireProps) {

  AHooks.useMount(async () => {
    self._czc?.push(['_trackPageview', self.location.pathname]);

    if (FUtil.Tool.getUserIDByCookies() === -1) {
      self.location.replace(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.login({
        goTo: self.location.href,
      }));
      return;
    }

    const { data: data_resourceTask }: { data: any[] } = await FServiceAPI.Activity.getResourceTaskInfo();
    self._czc?.push(['_trackEvent', '调研问卷页', '填写问卷', '', 1]);
    // console.log(data_resourceTask, 'data_resourceTask9ojwksdflksdjlkjl');
    if (data_resourceTask.every((rt) => rt.status === 2)) {
      return self.location.replace(FI18n.i18nNext.t('beta_survey_link_a'));
    }
    const { data: data_nodeTask }: { data: any[] } = await FServiceAPI.Activity.getNodeTaskInfo();
    // console.log(data_nodeTask, 'data_nodeTask90iewojufslkdfjsdlkfjsdlkfj');
    if (data_nodeTask.every((rt) => rt.status === 2)) {
      return self.location.replace(FI18n.i18nNext.t('beta_survey_link_a'));
    }
    self.location.replace(FI18n.i18nNext.t('beta_survey_link_b'));
  });

  return (<div />);
}

export default Questionnaire;
