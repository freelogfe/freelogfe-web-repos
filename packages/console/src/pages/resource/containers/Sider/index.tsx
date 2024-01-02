import * as React from 'react';
import styles from './index.less';
import FResourceCover from '@/components/FResourceCover';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceSiderModelState } from '@/models/connect';
import { withRouter, history } from 'umi';
import FLink from '@/components/FLink';
import { FUtil, FI18n, FServiceAPI } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';
import { Checkbox, Popconfirm, Space } from 'antd';
import FTooltip from '@/components/FTooltip';
import FSwitch from '@/components/FSwitch';
import { FDialog } from '@/components/FDialog';
import { FetchResourceInfoAction } from '@/models/resourceAuthPage';
import { LoadingOutlined } from '@ant-design/icons';
import * as AHooks from 'ahooks';
import FComponentsLib from '@freelog/components-lib';
import fPolicyBuilder from '@/components/fPolicyBuilder';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import fPolicyOperator from '@/components/fPolicyOperator';
import {
  OnUnmount_Page_Action,
  OnUpdate_Data_Action,
} from '@/models/resourceSider';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import { fOnOffFeedback } from '@/components/fOnOffFeedback';
import FProcessing from '@/components/FProcessing';

interface SilderProps {
  dispatch: Dispatch;
  resourceSider: ResourceSiderModelState;
}

function Sider({ resourceSider, dispatch }: SilderProps) {
  // console.log(match, 'matchiosdjflkjsdlkfjlkj');
  const [$resourceAuthShownArray, set$resourceAuthShownArray] = AHooks.useLocalStorageState<{ [k: string]: string }>(
    'resourceAuthShownArray',
    {
      defaultValue: {},
    },
  );

  // const [inactiveDialogShow, setInactiveDialogShow] = React.useState(false);
  // const [resultPopupType, setResultPopupType] = React.useState<null | 0 | 1>(null);
  // const [loading, setLoading] = React.useState(false);
  // const [noLonger, setNoLonger] = React.useState(false);
  const [$processing, set$processing, get$processing] = FUtil.Hook.useGetState<string>('');

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_Page_Action>({
      type: 'resourceSider/onUnmount_Page',
    });
  });

  async function changeStatus(value: boolean) {
    if (value) {
      // set$processing(FI18n.i18nNext.t('set_resource_available_for_auth_msg_processing'));
      const onlineSuccess = await resourceOnline(resourceSider.resourceID);
      if (onlineSuccess) {
        setTimeout(() => {
          set$processing('');
          fOnOffFeedback({
            state: 'on',
            message: FI18n.i18nNext.t('set_resource_available_for_auth_msg_done'),
          });
        }, 1000);

        dispatch<OnUpdate_Data_Action>({
          type: 'resourceSider/onUpdate_Data',
        });

        dispatch<FetchResourceInfoAction>({
          type: 'resourceAuthPage/fetchResourceInfo',
        });
      } else {
        set$processing('');
      }
    } else {
      // 下架
      // const resourceNoTip = self.localStorage.getItem('resourceNoTip') || false;
      const bool: boolean = await fPromiseModalConfirm({
        // title: '资源待上架',
        // description: '将资源上架到资源市场开放授权，为你带来更多收益',
        // okText: '立即上架',
        // cancelText: '暂不上架',
        title: FI18n.i18nNext.t('remove_resource_from_auth_confirmation_title'),
        description: FI18n.i18nNext.t('confirm_msg_remove_resource_from_auth'),
        okText: FI18n.i18nNext.t('remove_resource_from_auth_btn_remve'),
        promptKey_localStorage: FI18n.i18nNext.t('remove_resource_from_auth_confirmation_title') || '',
      });

      if (bool) {
        const data = { status: 4 };
        operateResource(data);
      }
    }
  }

  /** 下架 */
  // const inactiveResource = () => {
  // if (inactiveDialogShow && noLonger) {
  //   self.localStorage.setItem('resourceNoTip', 'true');
  // }

  // };

  /** 资源上下架 */
  async function operateResource(data: any) {
    // setInactiveDialogShow(false);
    set$processing(FI18n.i18nNext.t('remove_resource_from_auth_msg_processing'));
    // setResultPopupType(data.status);

    const { ret, errCode, msg } = await FServiceAPI.Resource.update({
      resourceId: resourceSider.resourceID,
      status: data.status,
    });

    if (ret !== 0 && errCode !== 0) {
      fMessage(msg, 'error');
      set$processing('');
      // setResultPopupType(null);
      return;
    }
    setTimeout(() => {
      set$processing('');
      fOnOffFeedback({
        state: 'off',
        message: FI18n.i18nNext.t('remove_resource_from_auth_msg_done'),
      });
    }, 1000);
    dispatch<OnUpdate_Data_Action>({
      type: 'resourceSider/onUpdate_Data',
    });

    dispatch<FetchResourceInfoAction>({
      type: 'resourceAuthPage/fetchResourceInfo',
    });
  }

  if (resourceSider.state === 'loading') {
    return null;
  }

  return (
    <div className={styles.Sider}>
      <div style={{ height: 30 }} />
      <div className={styles.switcher}>
        <div className={styles['switcher-label']}>
          {FI18n.i18nNext.t('switch_set_resource_avaliable')}
        </div>
        <FSwitch
          // onClick={changeStatus}
          onChange={(checked) => {
            changeStatus(checked);
          }}
          checked={resourceSider.resourceState === 'online'}
          // loading={loading}
          loading={$processing !== ''}
        />
      </div>
      <div style={{ height: 30 }} />
      <div className={styles.header}>
        <FResourceCover
          src={resourceSider.resourceCover}
          status={resourceSider.resourceState as 'online'}
        />
        <div style={{ height: 15 }} />
        <FLink
          to={FUtil.LinkTo.resourceDetails({
            resourceID: resourceSider.resourceID,
          })}
          target={'_blank'}
          className={styles.resourceName}
        >
          {resourceSider.resourceTitle || resourceSider.resourceName.split('/')[1]}
        </FLink>
        <div style={{ height: 10 }} />
        <label className={styles.label}>
          {resourceSider.resourceType.join(' / ')}
        </label>
      </div>
      <div style={{ height: 35 }} />
      <div className={styles.radios}>
        <FLink
          className={[
            resourceSider.showPage === 'versionInfo' ? styles.activatedRadio : '',
            styles.radio,
          ].join(' ')}
          to={FUtil.LinkTo.resourceVersionInfo({
            resourceID: resourceSider.resourceID,
            version: resourceSider.resourceVersions[resourceSider.resourceVersions.length - 1] || '',
          })}
        >
          {FI18n.i18nNext.t('edit_resource_tab_versions')}
        </FLink>
        <FLink
          className={[
            resourceSider.showPage === 'info' ? styles.activatedRadio : '',
            styles.radio,
          ].join(' ')}
          to={FUtil.LinkTo.resourceInfo({
            resourceID: resourceSider.resourceID,
          })}
        >
          {FI18n.i18nNext.t('edit_resource_tab_articleinfo')}
        </FLink>
        <FLink
          className={[
            resourceSider.showPage === 'policy' ? styles.activatedRadio : '',
            styles.radio,
          ].join(' ')}
          to={FUtil.LinkTo.resourcePolicy({
            resourceID: resourceSider.resourceID,
          })}
        >
          <span>{FI18n.i18nNext.t('edit_resource_tab_authplans')}</span>
          {resourceSider.policies.length === 0 &&
          !$resourceAuthShownArray[resourceSider.resourceID] && (
            <div className={styles.redDot} />
          )}
        </FLink>
        <FLink
          className={[
            resourceSider.showPage === 'contract' ? styles.activatedRadio : '',
            styles.radio,
          ].join(' ')}
          to={FUtil.LinkTo.resourceContract({
            resourceID: resourceSider.resourceID,
          })}
        >
          {FI18n.i18nNext.t('edit_resource_tab_licenceecontracts')}
        </FLink>
        <FLink
          className={[
            resourceSider.showPage === 'dependency' ? styles.activatedRadio : '',
            styles.radio,
          ].join(' ')}
          to={FUtil.LinkTo.resourceDependency({
            resourceID: resourceSider.resourceID,
          })}
        >
          <Space size={10}>
            <span>{FI18n.i18nNext.t('edit_resource_tab_relynauth')}</span>
            {resourceSider.hasAuthProblem && (
              <FTooltip title={'存在授权问题'}>
                <FComponentsLib.FIcons.FWarning style={{ fontSize: 16 }} />
              </FTooltip>
            )}
          </Space>
        </FLink>
      </div>
      <div style={{ height: 40 }} />

      <FProcessing
        open={$processing !== ''}
        message={$processing}
      />
    </div>
  );
}

export default connect(({ resourceSider }: ConnectState) => ({
  resourceSider: resourceSider,
}))(Sider);

export async function resourceOnline(resourceID: string): Promise<boolean> {
  const { data: data_resourceInfo } = await FServiceAPI.Resource.info({
    resourceIdOrName: resourceID,
    isLoadPolicyInfo: 1,
    isLoadLatestVersionInfo: 1,
    isTranslate: 1,
  });

  // const { policies, info } = resourceInfo;
  if (!data_resourceInfo.latestVersion) {
    fMessage(FI18n.i18nNext.t('msg_release_version_first'), 'error');
    return false;
  } else if (data_resourceInfo.policies.length === 0) {
    const confirm = await fPromiseModalConfirm({
      title: FI18n.i18nNext.t(
        'set_resource_available_for_auth_activate_auth_plan_title',
      ),
      // icon: null,
      description: FI18n.i18nNext.t('msg_set_resource_avaliable_for_auth01'),
      okText: FI18n.i18nNext.t(
        'set_resource_available_for_auth_btn_create_auth_plan',
      ),
      cancelText: FI18n.i18nNext.t('btn_cancel'),
    });
    // console.log(confirm, 'confirmisoedjflskdjflsdjfl9888888');
    if (!confirm) {
      return false;
    }

    const policy = await fPolicyBuilder({
      alreadyUsedTexts: data_resourceInfo.policies.map<string>((ip: any) => {
        return ip.policyText;
      }),
      alreadyUsedTitles: data_resourceInfo.policies.map((ip) => {
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
  } else if (data_resourceInfo.policies.every((p) => {
    return p.status === 0;
  })) {
    const existingUsedPolicy = await fPolicyOperator({
      titleText: FI18n.i18nNext.t(
        'set_resource_available_for_auth_activate_auth_plan_title',
      ),
      confirmText: FI18n.i18nNext.t(
        'set_resource_available_for_auth_activate_auth_plan_btn_done',
      ),
      tipText: FI18n.i18nNext.t('msg_set_resource_avaliable_for_auth02'),
      policiesList: data_resourceInfo.policies as any,
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
