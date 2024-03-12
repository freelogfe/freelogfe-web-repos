import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { AddAPolicyAction, ChangeAction, UpdateAPolicyAction } from '@/models/exhibitInfoPage';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import FPolicyList from '@/components/FPolicyList';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import fPolicyBuilder from '@/components/fPolicyBuilder';

interface PoliciesProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Policies({ dispatch, exhibitInfoPage }: PoliciesProps) {

  async function addPolicy() {
    const policy = await fPolicyBuilder({
      alreadyUsedTexts: exhibitInfoPage.policy_List.map((p) => {
        return p.policyText;
      }),
      alreadyUsedTitles: exhibitInfoPage.policy_List.map((p) => {
        return p.policyName;
      }),
      targetType: 'presentable',
    });

    if (!policy) {
      return false;
    }

    await dispatch<AddAPolicyAction>({
      type: 'exhibitInfoPage/addAPolicy',
      payload: {
        text: policy.text,
        title: policy.title,
      },
    });
  }

  // return (<div>
  //   <Space size={15}>
  //     <FComponentsLib.FTitleText
  //       text={FI18n.i18nNext.t('title_auth_plan')}
  //       type='h3'
  //     />
  //     {
  //       exhibitInfoPage.policy_List.length !== 0 && (<FComponentsLib.FCircleBtn
  //         size='small'
  //         onClick={async () => {
  //           self._czc?.push(['_trackEvent', '授权策略页', '创建授权策略', '', 1]);
  //           // dispatch<ChangeAction>({
  //           //   type: 'exhibitInfoPage/change',
  //           //   payload: {
  //           //     policy_BuildDrawer_Visible: true,
  //           //   },
  //           // });
  //           await addPolicy();
  //         }}
  //       />)
  //     }
  //   </Space>
  //   <div style={{ height: 20 }} />
  return (<div className={styles.block}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <FComponentsLib.FContentText
        text={FI18n.i18nNext.t('title_auth_plan')}
        type={'highlight'}
      />

      {
        exhibitInfoPage.policy_List.length !== 0 && (<FComponentsLib.FTextBtn
          style={{ fontSize: 12 }}
          type='primary'
          onClick={async () => {
            // onChangeIsEditing(false);
            // dispatch<OnClick_CancelEditIntroductionBtn_Action>({
            //   type: 'resourceInfoPage/onClick_CancelEditIntroductionBtn',
            // });
            // set$isEdit(false);
            self._czc?.push(['_trackEvent', '授权策略页', '创建授权策略', '', 1]);
            await addPolicy();
          }}
        >添加授权策略</FComponentsLib.FTextBtn>)
      }

      {/*{*/}
      {/*  exhibitInfoPage.policy_List.length !== 0 && (<FComponentsLib.FCircleBtn*/}
      {/*    size='small'*/}
      {/*    onClick={async () => {*/}
      {/*      self._czc?.push(['_trackEvent', '授权策略页', '创建授权策略', '', 1]);*/}
      {/*      // dispatch<ChangeAction>({*/}
      {/*      //   type: 'exhibitInfoPage/change',*/}
      {/*      //   payload: {*/}
      {/*      //     policy_BuildDrawer_Visible: true,*/}
      {/*      //   },*/}
      {/*      // });*/}
      {/*      await addPolicy();*/}
      {/*    }}*/}
      {/*  />)*/}
      {/*}*/}
    </div>
    <div style={{ height: 10 }} />
    {
      exhibitInfoPage.policy_List.length === 0
        ? (<div className={styles.empty}>


          <div style={{ height: 10 }} />
          {/*<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>*/}
            <FComponentsLib.FContentText
              text={FI18n.i18nNext.t('exhibit_auth_plan_empty')}
              type={'additional2'}
            />
            <div style={{ height: 20 }} />
          <FComponentsLib.FHotspotTooltip
            id={'exhibitDetailPage.createFirstPolicy'}
            style={{ left: '50%', marginLeft: -16, bottom: -42 }}
            // style={{ left: '50%', marginLeft: -16, bottom: -42 }}
            text={FI18n.i18nNext.t('hotpots_createauthplan_exhibit_btn_createauthplan')}
            onMount={() => {
              FComponentsLib.fSetHotspotTooltipVisible('exhibitDetailPage.createFirstPolicy', {
                value: false,
                effectiveImmediately: false,
                onlyNullish: true,
              });
            }}
          >
            <FComponentsLib.FRectBtn
              onClick={async () => {
                FComponentsLib.fSetHotspotTooltipVisible('exhibitDetailPage.createFirstPolicy', {
                  value: false,
                  effectiveImmediately: true,
                  onlyNullish: false,
                });
                self._czc?.push(['_trackEvent', '授权策略页', '创建授权策略', '', 1]);
                await addPolicy();
              }}
              type='primary'
            >{FI18n.i18nNext.t('btn_create_auth_plan')}</FComponentsLib.FRectBtn>
          </FComponentsLib.FHotspotTooltip>
          {/*</div>*/}
          <div style={{ height: 20 }} />

          {/*<FComponentsLib.FTipText*/}
          {/*  type='second'*/}
          {/*  // text={FUtil.I18n.message('hint_add_authorization_plan')}*/}
          {/*  text={FI18n.i18nNext.t('exhibit_auth_plan_empty')}*/}
          {/*/>*/}
          {/*<div style={{ height: 20 }} />*/}
          {/*<FComponentsLib.FHotspotTooltip*/}
          {/*  id={'exhibitDetailPage.createFirstPolicy'}*/}
          {/*  style={{ left: '50%', marginLeft: -16, bottom: -42 }}*/}
          {/*  // style={{ left: '50%', marginLeft: -16, bottom: -42 }}*/}
          {/*  text={FI18n.i18nNext.t('hotpots_createauthplan_exhibit_btn_createauthplan')}*/}
          {/*  onMount={() => {*/}
          {/*    FComponentsLib.fSetHotspotTooltipVisible('exhibitDetailPage.createFirstPolicy', {*/}
          {/*      value: false,*/}
          {/*      effectiveImmediately: false,*/}
          {/*      onlyNullish: true,*/}
          {/*    });*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <FComponentsLib.FRectBtn*/}
          {/*    onClick={async () => {*/}
          {/*      FComponentsLib.fSetHotspotTooltipVisible('exhibitDetailPage.createFirstPolicy', {*/}
          {/*        value: false,*/}
          {/*        effectiveImmediately: true,*/}
          {/*        onlyNullish: false,*/}
          {/*      });*/}
          {/*      self._czc?.push(['_trackEvent', '授权策略页', '创建授权策略', '', 1]);*/}
          {/*      await addPolicy();*/}
          {/*    }}*/}
          {/*    type='primary'*/}
          {/*  >{FI18n.i18nNext.t('btn_create_auth_plan')}</FComponentsLib.FRectBtn>*/}
          {/*</FComponentsLib.FHotspotTooltip>*/}
        </div>)
        : (<FPolicyList
          atLeastOneUsing={exhibitInfoPage.exhibit_Online}
          dataSource={exhibitInfoPage.policy_List}
          onCheckChange={(data) => {
            if (data.using) {
              self._czc?.push(['_trackEvent', '授权策略页', '上线', '', 1]);
            }
            dispatch<UpdateAPolicyAction>({
              type: 'exhibitInfoPage/updateAPolicy',
              payload: { id: data.id, status: data.using ? 1 : 0 },
            });
          }}
        />)
    }
  </div>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Policies);
