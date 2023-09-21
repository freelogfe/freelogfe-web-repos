import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceCreatorPageModelState } from '@/models/connect';
import FComponentsLib from '@freelog/components-lib';
import { FI18n } from '@freelog/tools-lib';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import * as AHooks from 'ahooks';
import { OnMount_Page_Action, OnUnmount_Page_Action } from '@/models/resourceCreatorPage';
import { history } from '@@/core/history';
import { OnChange_IsOpenCartoon_Action } from '@/models/resourceVersionCreatorPage';
import FPrompt from '@/components/FPrompt';

interface ResourceCreatorProps {
  dispatch: Dispatch;
  resourceCreatorPage: ResourceCreatorPageModelState;
}

function ResourceCreator({
                           dispatch,
                           resourceCreatorPage,
                         }: ResourceCreatorProps) {


  AHooks.useMount(() => {
    dispatch<OnMount_Page_Action>({
      type: 'resourceCreatorPage/onMount_Page',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_Page_Action>({
      type: 'resourceCreatorPage/onUnmount_Page',
    });
  });


  return (<div className={styles.styles}>

    <FPrompt
      watch={resourceCreatorPage.step1_dataIsDirty_count !== 0 || resourceCreatorPage.step2_dataIsDirty_count !== 0 || resourceCreatorPage.step4_dataIsDirty_count !== 0}
      messageText={'还没有保存，现在离开会导致信息丢失'}
      onOk={(locationHref) => {
        // console.log('还没有保存草稿或发行 Ok');
        history.push(locationHref);
        // set_isOpenCartoon(false);
        // console.log('+++++++++++++++++++++++++还没有保存草稿或发行 w9e0opfjsdlk;fjlk');
        dispatch<OnChange_IsOpenCartoon_Action>({
          type: 'resourceVersionCreatorPage/onChange_IsOpenCartoon',
          payload: {
            value: false,
          },
        });
      }}
    />

    <div className={styles.left}>
      <div style={{ height: 40 }} />
      <div style={{ paddingLeft: 30 }}>
        {/*<FComponentsLib.FTitleText text={'发行资源'} type={'h1'} />*/}
        <FComponentsLib.FTitleText text={FI18n.i18nNext.t('rqr_title')} type={'h1'} />
      </div>

      <div style={{ height: 40 }} />
      <div className={styles.steps}>
        <div
          className={[styles.step, resourceCreatorPage.step === 1 ? styles.stepActivated : '', resourceCreatorPage.step > 1 ? styles.stepFinished : ''].join(' ')}>
          <div style={{ width: 30 }}>
            <FComponentsLib.FIcons.FArrowRight className={styles.iconFArrowRight} />
            <FComponentsLib.FIcons.FCheckMark className={styles.iconFCheckMark} />
          </div>
          {/*<span className={styles.title}>创建资源授权条目</span>*/}
          <span className={styles.title}>{FI18n.i18nNext.t('rqr_step1')}</span>
        </div>

        <div
          className={[styles.step, resourceCreatorPage.step === 2 ? styles.stepActivated : '', resourceCreatorPage.step > 2 ? styles.stepFinished : ''].join(' ')}>
          <div style={{ width: 30 }}>
            <FComponentsLib.FIcons.FArrowRight className={styles.iconFArrowRight} />
            <FComponentsLib.FIcons.FCheckMark className={styles.iconFCheckMark} />
          </div>
          {/*<span className={styles.title}>上传资源文件</span>*/}
          <span className={styles.title}>{FI18n.i18nNext.t('rqr_step2')}</span>
        </div>

        <div
          className={[styles.step,
            resourceCreatorPage.step === 3
              ? styles.stepActivated
              : '',
            resourceCreatorPage.step > 3 && resourceCreatorPage.step3_policies.length > 0
              ? styles.stepFinished
              : ''].join(' ')}>
          <div style={{ width: 30 }}>
            <FComponentsLib.FIcons.FArrowRight className={styles.iconFArrowRight} />
            <FComponentsLib.FIcons.FCheckMark className={styles.iconFCheckMark} />
          </div>
          {/*<span className={styles.title}>添加授权策略</span>*/}
          <span className={styles.title}>{FI18n.i18nNext.t('rqr_step3')}</span>
        </div>

        <div className={[styles.step, resourceCreatorPage.step === 4 ? styles.stepActivated : ''].join(' ')}>
          <div style={{ width: 30 }}>
            <FComponentsLib.FIcons.FArrowRight className={styles.iconFArrowRight} />
            <FComponentsLib.FIcons.FCheckMark className={styles.iconFCheckMark} />
          </div>
          {/*<span className={styles.title}>完善资源信息</span>*/}
          <span className={styles.title}>{FI18n.i18nNext.t('rqr_step4')}</span>
        </div>
      </div>
    </div>
    <div className={styles.right}>
      {resourceCreatorPage.step === 1 && (<Step1 />)}
      {resourceCreatorPage.step === 2 && (<Step2 />)}
      {resourceCreatorPage.step === 3 && (<Step3 />)}
      {resourceCreatorPage.step === 4 && (<Step4 />)}
    </div>
  </div>);
}

export default connect(({ resourceCreatorPage }: ConnectState) => ({
  resourceCreatorPage: resourceCreatorPage,
}))(ResourceCreator);
