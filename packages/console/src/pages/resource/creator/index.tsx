import * as React from 'react';
import styles from './index.less';
// import FContentLayout from '@/layouts/FContentLayout';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceCreatorPageModelState } from '@/models/connect';
import FComponentsLib from '@freelog/components-lib';
import FResourceTypeInput from '@/components/FResourceTypeInput';
import { FI18n } from '@freelog/tools-lib';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

interface ResourceCreatorProps {
  dispatch: Dispatch;
  resourceCreatorPage: ResourceCreatorPageModelState;
}

function ResourceCreator({
                           dispatch,
                           resourceCreatorPage,
                         }: ResourceCreatorProps) {

  return (<div className={styles.styles}>
    <div className={styles.left}>
      <div style={{ height: 40 }} />
      <div style={{ paddingLeft: 30 }}>
        <FComponentsLib.FTitleText text={'发行资源'} type={'h1'} />
      </div>
      {/*<FComponentsLib.FTitleText text={'rqr_title'} type={'h1'} />*/}
      <div style={{ height: 40 }} />
      <div className={styles.steps}>
        <div className={[styles.step, styles.stepFinish].join(' ')}>
          <div style={{ width: 30 }}>
            <FComponentsLib.FIcons.FArrowRight className={styles.iconFArrowRight} />
            <FComponentsLib.FIcons.FCheckMark className={styles.iconFCheckMark} />
          </div>
          <span className={styles.title}>创建资源授权条目</span>
          {/*<span className={styles.title}>{FI18n.i18nNext.t('rqr_step1')}</span>*/}
        </div>

        <div className={[styles.step, styles.stepActivated].join(' ')}>
          <div style={{ width: 30 }}>
            <FComponentsLib.FIcons.FArrowRight className={styles.iconFArrowRight} />
            <FComponentsLib.FIcons.FCheckMark className={styles.iconFCheckMark} />
          </div>
          <span className={styles.title}>上传资源文件</span>
          {/*<span className={styles.title}>{FI18n.i18nNext.t('rqr_step2')}</span>*/}
        </div>

        <div className={[styles.step, styles.stepFinish1].join(' ')}>
          <div style={{ width: 30 }}>
            <FComponentsLib.FIcons.FArrowRight className={styles.iconFArrowRight} />
            <FComponentsLib.FIcons.FCheckMark className={styles.iconFCheckMark} />
          </div>
          <span className={styles.title}>添加授权策略</span>
          {/*<span className={styles.title}>{FI18n.i18nNext.t('rqr_step3')}</span>*/}
        </div>

        <div className={[styles.step].join(' ')}>
          <div style={{ width: 30 }}>
            <FComponentsLib.FIcons.FArrowRight className={styles.iconFArrowRight} />
            <FComponentsLib.FIcons.FCheckMark className={styles.iconFCheckMark} />
          </div>
          <span className={styles.title}>完善资源信息</span>
          {/*<span className={styles.title}>{FI18n.i18nNext.t('rqr_step4')}</span>*/}
        </div>
      </div>
    </div>
    <div className={styles.right}>
      {/*<Step1 />*/}
      {/*<Step2 />*/}
      <Step3 />
      {/*<Step4 />*/}
    </div>
  </div>);
}

export default connect(({ resourceCreatorPage }: ConnectState) => ({
  resourceCreatorPage: resourceCreatorPage,
}))(ResourceCreator);
