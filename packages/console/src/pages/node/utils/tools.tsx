import * as React from 'react';
import { FI18n, FServiceAPI } from '@freelog/tools-lib';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import fPolicyBuilder from '@/components/fPolicyBuilder';
import fPolicyOperator from '@/components/fPolicyOperator';
import { message } from 'antd';
import { fOnOffFeedback } from '@/components/FOnOffFeedback';


export async function onlineExhibit(exhibit_ID: string): Promise<boolean> {

  const params: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
    presentableId: exhibit_ID,
    // isLoadCustomPropertyDescriptors: 1,
    isLoadPolicyInfo: 1,
    isTranslate: 1,
  };

  const { ret, errCode, msg, data: data_exhibit } = await FServiceAPI.Exhibit.presentableDetails(params);
  const isTheme: boolean = data_exhibit.resourceInfo.resourceType.includes('主题');
  // console.log(data_exhibit, 'data_exhibit 90ewofujsdlkjflksdjflksdjfkl');

  // console.log(data_exhibit.resourceInfo.resourceType, 'dataiojsdlkfjlsdkjflkj');

  if (data_exhibit.policies.length === 0) {
    const res2: boolean = await fPromiseModalConfirm({
      title: isTheme
        ? '提示'
        : FI18n.i18nNext.t('set_resource_available_for_auth_activate_auth_plan_title'),
      // icon: <div />,
      description: isTheme
        ? FI18n.i18nNext.t('alarm_theme_activate_plan')
        : FI18n.i18nNext.t('msg_set_resource_avaliable_for_auth01'),
      okText: isTheme
        ? FI18n.i18nNext.t('activatetheme_btn_create_auth_plan')
        : FI18n.i18nNext.t('set_resource_available_for_auth_btn_create_auth_plan'),
      cancelText: FI18n.i18nNext.t('btn_cancel'),
    });

    if (!res2) {
      return false;
    }

    const policy = await fPolicyBuilder({
      targetType: 'presentable',
    });

    if (!policy) {
      return false;
    }

    const params1: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
      presentableId: exhibit_ID,
      addPolicies: [{
        policyName: policy.title,
        policyText: policy.text,
        status: 1,
      }],
    };
    await FServiceAPI.Exhibit.updatePresentable(params1);

  } else if (!data_exhibit.policies.some((item: { status: number }) => item.status === 1)) {
    const res3: boolean = await fPromiseModalConfirm({
      title: isTheme
        ? '提示'
        : FI18n.i18nNext.t('set_resource_available_for_auth_activate_auth_plan_title'),
      // icon: <div />,
      description: isTheme
        ? FI18n.i18nNext.t('msg_activate_theme_for_auth')
        : FI18n.i18nNext.t('msg_set_exhibits_avaliable_for_auth'),
      okText: FI18n.i18nNext.t('activatetheme_activate_btn_select_auth_plan'),
      cancelText: FI18n.i18nNext.t('btn_cancel'),
    });
    if (!res3) {
      return false;
    }

    const existingUsedPolicy = await fPolicyOperator({
      titleText: isTheme
        ? FI18n.i18nNext.t('activatetheme_activate_authplan_title')
        : FI18n.i18nNext.t('showexhibit_activate_authplan_title'),
      confirmText: isTheme
        ? FI18n.i18nNext.t('activatetheme_activate_authplan_btn')
        : FI18n.i18nNext.t('showexhibit_activate_authplan_btn'),
      tipText: isTheme
        ? FI18n.i18nNext.t('msg_activate_theme_for_auth')
        : FI18n.i18nNext.t('msg_set_exhibits_avaliable_for_auth'),
      policiesList: data_exhibit.policies,
    });

    if (!existingUsedPolicy) {
      return false;
    }

    const params1: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
      presentableId: exhibit_ID,
      updatePolicies: existingUsedPolicy
        ?.filter((p) => {
          return p.checked;
        })
        .map((p) => {
          return {
            policyId: p.policyID,
            status: 1,
          };
        }),
    };
    await FServiceAPI.Exhibit.updatePresentable(params1);
  }

  const messageKey: number = Math.random();
  // message.loading({
  //   content: isTheme
  //     ? FI18n.i18nNext.t('set_resource_available_for_auth_msg_processing')
  //     : FI18n.i18nNext.t('remove_resource_from_auth_msg_processing'),
  //   key: messageKey,
  // });


  const params2: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {
    presentableId: exhibit_ID,
    onlineStatus: 1,
  };
  await FServiceAPI.Exhibit.presentablesOnlineStatus(params2);

  // message.success({
  content: isTheme
    ? FI18n.i18nNext.t('msg_done')
    : FI18n.i18nNext.t('set_resource_available_for_auth_msg_done'),
    //   key: messageKey,
    //   duration: 2,
    // });
    fOnOffFeedback({
      state: 'on',
      message: isTheme
        ? FI18n.i18nNext.t('msg_done')
        : FI18n.i18nNext.t('set_resource_available_for_auth_msg_done'),
    });
  return true;
}
