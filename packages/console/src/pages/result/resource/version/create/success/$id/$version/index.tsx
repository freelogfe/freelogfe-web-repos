import * as React from 'react';
import styles from './index.less';
import { withRouter, history } from 'umi';
import FCenterLayout from '@/layouts/FCenterLayout';
import * as AHooks from 'ahooks';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import { RouteComponentProps } from 'react-router';
import FComponentsLib from '@freelog/components-lib';
import fMessage from '@/components/fMessage';
import fPolicyBuilder from '@/components/fPolicyBuilder';
import fPolicyOperator from '@/components/fPolicyOperator';

interface SuccessProps extends RouteComponentProps<{
  id: string;
  version: string;
}> {
  dispatch: Dispatch;
}

function Success({ match, dispatch }: SuccessProps) {

  const [countdown, set_countdown] = React.useState<number>(3);
  const [nextStep, set_nextStep] = React.useState<'loading' | 'goto' | 'tipOnline'>('loading');

  AHooks.useInterval(() => {
    const c = countdown - 1;
    set_countdown(c);
    if (c === 0) {
      history.replace(FUtil.LinkTo.resourceVersionInfo({
        resourceID: match.params.id,
        version: match.params.version,
      }));
    }
  }, nextStep === 'goto' && countdown > 0 ? 1000 : undefined);

  AHooks.useMount(async () => {
    const params: Parameters<typeof FServiceAPI.Resource.info>[0] = {
      resourceIdOrName: match.params.id,
    };

    const { data } = await FServiceAPI.Resource.info(params);
    // console.log(data, 'DDDDTTTTAAAAA');

    if (data.status === 1) {
      set_nextStep('goto');
    }

    if (data.status === 4) {
      set_nextStep('tipOnline');
    }
  });

  return (<FCenterLayout>
    <div style={{ height: 100 }} />
    <div className={styles.modal}>
      <FComponentsLib.FIcons.FCheck />
      <div style={{ height: 20 }} />
      <FComponentsLib.FTipText
        type='second'
        text={FI18n.i18nNext.t('version_created_successfully', { VersionNumber: match.params.version })}
      />

      <div style={{ height: 40 }} />

      {
        nextStep === 'tipOnline' && (<div className={styles.goto1}>

          <FComponentsLib.FTipText
            type='third'
            text={'将资源上架到资源市场开放授权，为你带来更多收益'}
          />

          <div style={{ height: 30 }} />
          <FComponentsLib.FRectBtn
            onClick={async () => {
              const onlineSuccess = await resourceOnline(match.params.id);

              if (onlineSuccess) {
                fMessage('上线成功', 'success');
                history.replace(FUtil.LinkTo.myResources());
                FComponentsLib.fSetHotspotTooltipVisible('header.discoverNav', {
                  value: true,
                  effectiveImmediately: true,
                  onlyNullish: true,
                });
                setTimeout(() => {
                  FComponentsLib.fSetHotspotTooltipVisible('header.discoverNav', {
                    value: false,
                    effectiveImmediately: false,
                    onlyNullish: false,
                  });
                });
              }
            }}
            style={{ padding: '0 20px' }}
          >{FI18n.i18nNext.t('versionreleased_btn_set_resource_available_for_auth')}</FComponentsLib.FRectBtn>
          {/*FI18n.i18nNext.t('versionreleased_btn_set_resource_available_for_auth')*/}
          <div style={{ height: 15 }} />
          <FComponentsLib.FTextBtn
            onClick={() => {
              // gotoVersionInfo();
              return history.replace(FUtil.LinkTo.resourceVersionInfo({
                resourceID: match.params.id,
                version: match.params.version,
              }));
            }}
          >{FI18n.i18nNext.t('versionreleased_btn_later')}</FComponentsLib.FTextBtn>
        </div>)
      }
      {
        nextStep === 'goto' && (<div className={styles.goto2}>
          <FComponentsLib.FTipText
            type='third'
            text={FI18n.i18nNext.t('jump_to_version_edit', { timer: countdown })}
          />
          <div style={{ width: 10 }} />
          <FComponentsLib.FTextBtn
            // theme={'primary'}
            onClick={async () => {
              // gotoVersionInfo();
              history.replace(FUtil.LinkTo.resourceVersionInfo({
                resourceID: match.params.id,
                version: match.params.version,
              }));
            }}
          >{FI18n.i18nNext.t('jump_now')}</FComponentsLib.FTextBtn>
        </div>)
      }
    </div>
  </FCenterLayout>);
}


export default withRouter(connect()(Success));

async function resourceOnline(resourceID: string): Promise<boolean> {

  const { data: data_resourceInfo } = await FServiceAPI.Resource.info({
    resourceIdOrName: resourceID,
    isLoadPolicyInfo: 1,
    isLoadLatestVersionInfo: 1,
    isTranslate: 1,
  });

  if (data_resourceInfo.status === 1) {
    return true;
  }

  if (data_resourceInfo.policies.length === 0) {

    const policy = await fPolicyBuilder({
      alreadyUsedTexts: data_resourceInfo.policies
        .map<string>((ip: any) => {
          return ip.policyText;
        }),
      alreadyUsedTitles: data_resourceInfo.policies
        .map((ip) => {
          return ip.policyName;
        }),
      targetType: 'resource',
    });

    if (!policy) {
      return false;
    }

    const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
      resourceId: resourceID,
      status: 1,
      addPolicies: [
        {
          policyName: policy.title,
          policyText: window.encodeURIComponent(policy.text),
          status: 1,
        },
      ],
    };
    const { ret, errCode, msg } = await FServiceAPI.Resource.update(params);
    if (ret !== 0 || errCode !== 0) {
      fMessage(msg, 'error');
      return false;
    }
    return true;

  } else if (data_resourceInfo.policies.every((p) => p.status === 0)) {
    const existingUsedPolicy = await fPolicyOperator({
      titleText: FI18n.i18nNext.t('set_resource_available_for_auth_activate_auth_plan_title'),
      confirmText: FI18n.i18nNext.t('set_resource_available_for_auth_activate_auth_plan_btn_done'),
      tipText: FI18n.i18nNext.t('msg_set_resource_avaliable_for_auth02'),
      policiesList: data_resourceInfo.policies,
    });

    if (!existingUsedPolicy) {
      return false;
    }

    const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
      resourceId: resourceID,
      status: 1,
      updatePolicies: existingUsedPolicy.map((p) => {
        return {
          policyId: p.policyID,
          status: p.checked ? 1 : 0, // 0:下线策略 1:上线策略
        };
      }),
    };
    const { ret, errCode, msg } = await FServiceAPI.Resource.update(params);
    if (ret !== 0 || errCode !== 0) {
      fMessage(msg, 'error');
      return false;
    }
    return true;
  }

  const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
    resourceId: resourceID,
    status: 1,
  };
  await FServiceAPI.Resource.update(params);

  return true;
}
