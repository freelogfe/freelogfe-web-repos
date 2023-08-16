import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorPageModelState } from '@/models/connect';
import { Dispatch } from 'redux';
// import { OnClick_step3_skipBtn_Action } from '@/models/resourceCreatorPage';
import { history } from '@@/core/history';
import { FI18n, FUtil } from '@freelog/tools-lib';
import FPolicyList from '@/components/FPolicyList';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';
import { OnChange_step2_customConfigurations_Action } from '@/models/resourceCreatorPage';

// import { FI18n } from '@freelog/tools-lib';

interface Step3Props {
  dispatch: Dispatch;
  resourceCreatorPage: ResourceCreatorPageModelState;
}

function Step3({ dispatch, resourceCreatorPage }: Step3Props) {
  return (<>
    <div style={{ height: 40 }} />
    <div className={styles.block}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <FComponentsLib.FContentText text={'授权策略'} type={'highlight'} />
        {/*<FComponentsLib.FContentText text={FI18n.i18nNext.t('authplanmgnt_title')} type={'highlight'}/>*/}
        <FComponentsLib.FTextBtn
          style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
          type='primary'
          onClick={async () => {

          }}>
          <FComponentsLib.FIcons.FConfiguration style={{ fontSize: 14 }} />
          <span>添加策略</span>
        </FComponentsLib.FTextBtn>
      </div>
      <>
        <div style={{ height: 10 }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FComponentsLib.FContentText text={'资源需添加授权策略才能上架到资源市场，开放签约。'} type={'additional2'} />
          <FComponentsLib.FContentText text={'授权策略，即资源对外授权范围和条件的申明，如支付10元获得一个月使用授权。'} type={'additional2'} />
          <div style={{ height: 20 }} />

          {/*{FI18n.i18nNext.t('authplanmgnt_list_empty_btn')}*/}
          <FComponentsLib.FRectBtn
            type={'primary'}
            onClick={() => {

            }}
          >添加授权策略</FComponentsLib.FRectBtn>
        </div>
      </>

      {/*<FPolicyList*/}
      {/*  atLeastOneUsing={resourceAuthPage.status === 1}*/}
      {/*  dataSource={resourceAuthPage.policies}*/}
      {/*  onCheckChange={(data) => {*/}
      {/*    if (data.using) {*/}
      {/*      self._czc?.push(['_trackEvent', '授权信息页', '上线', '', 1]);*/}
      {/*    }*/}
      {/*    onPolicyStatusChange(data.id, data.using);*/}
      {/*  }}*/}
      {/*/>*/}
    </div>

    <div style={{ height: 5 }} />

    <div className={styles.block}>
      <FComponentsLib.FContentText
        text={'策略模板'}
        type={'highlight'}
      />
      {/*<FComponentsLib.FContentText text={FI18n.i18nNext.t('authplanmgnt_title_templates')} type={'highlight'}/>*/}
      <div style={{ height: 5 }} />
      <FComponentsLib.FContentText
        text={'点击下方推荐的策略模板，可以快速添加策略'}
        type={'additional2'} />
      {/*<FComponentsLib.FContentText text={FI18n.i18nNext.t('authplanmgnt_title_templates_help')} type={'additional2'} />*/}
      <div style={{ height: 20 }} />
      <div className={styles.policyTemplates}>
        <a className={styles.policyTemplate}>
          <FComponentsLib.FTitleText text={'免费试用后订阅'} type={'h1'} />
          <div style={{ height: 15 }} />
          <FComponentsLib.FContentText text={'公开（所有缔约方可签约）'}/>
          <FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'}/>
          <FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'}/>
        </a>
        <a className={styles.policyTemplate}>
          <FComponentsLib.FTitleText text={'免费试用后订阅'} type={'h1'} />
          <div style={{ height: 15 }} />
          <FComponentsLib.FContentText text={'公开（所有缔约方可签约）'}/>
          <FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'}/>
          {/*<FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'}/>*/}
        </a>
        <a className={styles.policyTemplate}>
          <FComponentsLib.FTitleText text={'免费试用后订阅'} type={'h1'} />
          <div style={{ height: 15 }} />
          <FComponentsLib.FContentText text={'公开（所有缔约方可签约）'}/>
          <FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'}/>
          {/*<FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'}/>*/}
        </a>
        <a className={styles.policyTemplate}>
          <FComponentsLib.FTitleText text={'免费试用后订阅'} type={'h1'} />
          <div style={{ height: 15 }} />
          <FComponentsLib.FContentText text={'公开（所有缔约方可签约）'}/>
          <FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'}/>
          <FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'}/>
        </a>
      </div>
    </div>

    <div style={{ height: 30 }} />

    <div className={styles.btn}>

      {/*{FI18n.i18nNext.t('rqr_step3_btn_later')}*/}
      <FComponentsLib.FTextBtn
        type={'default'}
        onClick={() => {
          // history.push(FUtil.LinkTo.resourceVersion({
          //   resourceID: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
          //   version: '1.0.0',
          // }));
          history.push(FUtil.LinkTo.myResources());
        }}
      >稍后处理</FComponentsLib.FTextBtn>

      {/*{FI18n.i18nNext.t('rqr_step3_btn_next')}*/}
      <FComponentsLib.FRectBtn
        disabled={false}
        type={'primary'}
        onClick={() => {

        }}
      >下一步</FComponentsLib.FRectBtn>
    </div>
    <div style={{ height: 100 }} />
  </>);
}

export default connect(({ resourceCreatorPage }: ConnectState) => ({
  resourceCreatorPage: resourceCreatorPage,
}))(Step3);
