import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FServiceAPI, FI18n } from '@freelog/tools-lib';

interface QuestionnaireProps {

}

function Questionnaire({}: QuestionnaireProps) {

  AHooks.useMount(async () => {
    const { data: data_resourceTask }: { data: any[] } = await FServiceAPI.Activity.getResourceTaskInfo();
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
