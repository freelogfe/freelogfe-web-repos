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
// import { resourceOnline } from '@/pages/resource/containers/Sider';
import fMessage from '@/components/fMessage';
// import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import fPolicyBuilder from '@/components/fPolicyBuilder';
import fPolicyOperator from '@/components/fPolicyOperator';

interface SuccessProps extends RouteComponentProps<{
  id: string;
  version: string;
}> {
  dispatch: Dispatch;
}

function Success({ match, dispatch }: SuccessProps) {

  const [count, setCount] = React.useState<number>(3);
  // 0：初始 1：第一个版本且无策略 2：非第一个版本或有策略
  const [gotoState, setGotoState] = React.useState<0 | 1 | 2>(0);

  AHooks.useInterval(() => {
    const c = count - 1;
    setCount(c);
    if (c === 0) {
      gotoVersionInfo();
    }
  }, gotoState === 2 ? 1000 : undefined);

  AHooks.useMount(async () => {
    const params: Parameters<typeof FServiceAPI.Resource.info>[0] = {
      resourceIdOrName: match.params.id,
    };

    const { data } = await FServiceAPI.Resource.info(params);
    // console.log(data, 'DDDDTTTTAAAAA');

    if (data.resourceVersions.length === 1 && data.policies.length === 0) {
      setGotoState(1);
    } else {
      setGotoState(2);
    }
  });

  function gotoVersionInfo() {
    return history.replace(FUtil.LinkTo.resourceVersion({
      resourceID: match.params.id,
      version: match.params.version,
    }));
  }

  // function gotoAuth() {
  //   return history.replace(FUtil.LinkTo.resourceAuth({
  //     resourceID: match.params.id,
  //   }));
  // }

  console.log(FI18n.i18nNext.t('versionreleased_desc'), 'siodjflksdjfl;ksjdflkjoiwsejfo;isjdlfkj');

  return (<FCenterLayout>
    <div style={{ height: 100 }} />
    <div className={styles.modal}>
      {
        gotoState !== 0 && (<>
          {/*<i className={'freelog fl-icon-shenqingchenggong'} />*/}
          <FComponentsLib.FIcons.FCheck />
          <div style={{ height: 20 }} />
          <FComponentsLib.FTipText
            type='second'
            text={FI18n.i18nNext.t('version_created_successfully', { VersionNumber: match.params.version })}
          />
        </>)
      }

      <div style={{ height: 40 }} />

      {
        gotoState === 1 && (<div className={styles.goto1}>
          {
            FI18n.i18nNext.t('versionreleased_desc')
              .split('\n')
              .map((text) => {
                return (<FComponentsLib.FTipText
                  type='third'
                  // text={'添加策略后可将资源上架，上架后才能在资源'}
                  text={text}
                />);
              })
          }

          <div style={{ height: 30 }} />
          <FComponentsLib.FRectBtn
            onClick={async () => {
              const onlineSuccess = await resourceOnline(match.params.id);

              if (onlineSuccess) {
                fMessage('上线成功', 'success');
                history.replace(FUtil.LinkTo.myResources());
              }
            }}
            style={{ padding: '0 20px' }}
          >{FI18n.i18nNext.t('versionreleased_btn_set_resource_available_for_auth')}</FComponentsLib.FRectBtn>
          <div style={{ height: 15 }} />
          <FComponentsLib.FTextBtn
            onClick={() => {
              gotoVersionInfo();
            }}
          >{FI18n.i18nNext.t('versionreleased_btn_later')}</FComponentsLib.FTextBtn>
        </div>)
      }
      {
        gotoState === 2 && (<div className={styles.goto2}>
          <FComponentsLib.FTipText
            type='third'
            text={FI18n.i18nNext.t('jump_to_version_edit', { timer: count })}
          />
          <div style={{ width: 10 }} />
          <FComponentsLib.FTextBtn
            // theme={'primary'}
            onClick={gotoVersionInfo}
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
    await FServiceAPI.Resource.update(params);
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
    await FServiceAPI.Resource.update(params);
    return true;
  }

  const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
    resourceId: resourceID,
    status: 1,
  };
  await FServiceAPI.Resource.update(params);

  return true;
}
