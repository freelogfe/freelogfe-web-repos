import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorPageModelState } from '@/models/connect';
import { Dispatch } from 'redux';
import { history } from '@@/core/history';
import { FI18n, FUtil } from '@freelog/tools-lib';
import FPolicyList from '@/components/FPolicyList';
import {
  OnClick_step3_addPolicyBtn_Action,
  OnClick_step3_submitBtn_Action,
} from '@/models/resourceCreatorPage';
import PolicyTemplates from './PolicyTemplates';

interface Step3Props {
  dispatch: Dispatch;
  resourceCreatorPage: ResourceCreatorPageModelState;
}

function Step3({ dispatch, resourceCreatorPage }: Step3Props) {
  return (<>
    <div style={{ height: 40 }} />
    <div className={styles.block}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/*<FComponentsLib.FContentText text={'授权策略'} type={'highlight'} />*/}
        <FComponentsLib.FContentText text={FI18n.i18nNext.t('authplanmgnt_title')} type={'highlight'} />
        {
          resourceCreatorPage.step3_policies.length > 0 && (<FComponentsLib.FTextBtn
            style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
            type='primary'
            onClick={async () => {
              dispatch<OnClick_step3_addPolicyBtn_Action>({
                type: 'resourceCreatorPage/onClick_step3_addPolicyBtn',
                payload: {},
              });
            }}>
            {/*@ts-ignore*/}
            <FComponentsLib.FIcons.FPolicy style={{ fontSize: 14 }} />
            <span>添加策略</span>
          </FComponentsLib.FTextBtn>)
        }

      </div>
      {
        resourceCreatorPage.step3_policies.length === 0 && (<>
          <div style={{ height: 10 }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FComponentsLib.FContentText text={'资源需添加授权策略才能上架到资源市场，开放签约。'} type={'additional2'} />
            <FComponentsLib.FContentText text={'授权策略，即资源对外授权范围和条件的申明，如支付10元获得一个月使用授权。'} type={'additional2'} />
            <div style={{ height: 20 }} />

            {/*{FI18n.i18nNext.t('authplanmgnt_list_empty_btn')}*/}
            <FComponentsLib.FRectBtn
              type={'primary'}
              onClick={() => {
                dispatch<OnClick_step3_addPolicyBtn_Action>({
                  type: 'resourceCreatorPage/onClick_step3_addPolicyBtn',
                  payload: {},
                });
              }}
            >{FI18n.i18nNext.t('authplanmgnt_list_empty_btn')}</FComponentsLib.FRectBtn>
          </div>
        </>)
      }

      {
        resourceCreatorPage.step3_policies.length > 0 && (<>
          <div style={{ height: 20 }} />
          <FPolicyList
            activeBtnShow={false}
            // allDisabledSwitch={true}
            dataSource={resourceCreatorPage.step3_policies}
            // onCheckChange={(data) => {
            //   if (data.using) {
            //     self._czc?.push(['_trackEvent', '授权信息页', '上线', '', 1]);
            //   }
            //   onPolicyStatusChange(data.id, data.using);
            // }}
          />
        </>)
      }

    </div>

    <div style={{ height: 5 }} />

    <div className={styles.block}>
      <FComponentsLib.FContentText
        text={'策略模板'}
        type={'highlight'}
      />
      {/*<FComponentsLib.FContentText text={FI18n.i18nNext.t('authplanmgnt_title_templates')} type={'highlight'}/>*/}
      <div style={{ height: 5 }} />
      {/*<FComponentsLib.FContentText*/}
      {/*  text={'点击下方推荐的策略模板，可以快速添加策略'}*/}
      {/*  type={'additional2'} />*/}
      <FComponentsLib.FContentText text={FI18n.i18nNext.t('authplanmgnt_title_templates_help')} type={'additional2'} />
      <div style={{ height: 20 }} />
      <PolicyTemplates
        onSelect={(value) => {
          // fPolicyBuilder({ targetType: 'resource', defaultValue: value });
          dispatch<OnClick_step3_addPolicyBtn_Action>({
            type: 'resourceCreatorPage/onClick_step3_addPolicyBtn',
            payload: {
              defaultValue: value,
            },
          });
        }}
      />
    </div>

    <div style={{ height: 30 }} />

    <div className={styles.btn}>

      {/*{FI18n.i18nNext.t('rqr_step3_btn_later')}*/}
      <FComponentsLib.FTextBtn
        type={'default'}
        onClick={() => {
          history.push(FUtil.LinkTo.resourceVersionInfo({
            resourceID: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
            version: '1.0.0',
          }));
        }}
      >{FI18n.i18nNext.t('rqr_step3_btn_later')}</FComponentsLib.FTextBtn>

      {/*{FI18n.i18nNext.t('rqr_step3_btn_next')}*/}
      <FComponentsLib.FRectBtn
        disabled={false}
        type={'primary'}
        onClick={() => {
          dispatch<OnClick_step3_submitBtn_Action>({
            type: 'resourceCreatorPage/onClick_step3_submitBtn',
          });
        }}
      >{FI18n.i18nNext.t('rqr_step3_btn_next')}</FComponentsLib.FRectBtn>
    </div>
    <div style={{ height: 100 }} />
  </>);
}

export default connect(({ resourceCreatorPage }: ConnectState) => ({
  resourceCreatorPage: resourceCreatorPage,
}))(Step3);


