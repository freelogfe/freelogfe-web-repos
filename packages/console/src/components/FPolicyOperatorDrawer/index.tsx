import { Checkbox, Space } from 'antd';
import * as React from 'react';
import styles from './index.less';
import FDrawer from '../FDrawer';
import { PolicyCard } from '../FPolicyList';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FUtil } from '@freelog/tools-lib';
import { PolicyFullInfo_Type } from '@/type/contractTypes';

interface FPolicyOperaterDrawerProps {
  titleText: string;
  confirmText: string;
  tipText: string;
  visible: boolean;
  // type: 'resource' | 'exhibit';
  policiesList: PolicyFullInfo_Type[];

  onCancel(): void;

  onConfirm?(policies: { policyID: string; checked: boolean; }[]): void;

  onNewPolicy?(): void;
}

// const typeMapping = { resource: '资源', exhibit: '展品' };

function FPolicyOperatorDrawer({
                                 titleText,
                                 confirmText,
                                 tipText,
                                 visible = false,
                                 policiesList,
                                 // type,
                                 onCancel,
                                 onConfirm,
                                 onNewPolicy,
                               }: FPolicyOperaterDrawerProps) {

  const [$list, set$list, get$list] = FUtil.Hook.useGetState<PolicyFullInfo_Type[]>([]);
  // const updateActiveList = () => {
  //   const list = policiesList.filter((item) => item.checked).map((item) => item.policyId);
  //   setActiveList(list);
  // };

  // React.useEffect(() => {
  //   if (visible) {
  //     updateActiveList();
  //   }
  // }, [visible]);

  return (
    <>
      <FDrawer
        open={visible}
        title={
          <Space size={10}>
            {/*<FComponentsLib.FTitleText type='h2' text={`启用策略并上架${typeMapping[type]}`} />*/}
            <FComponentsLib.FTitleText type='h2' text={titleText} singleRow style={{ width: 290 }} />
          </Space>
        }
        width={700}
        afterVisibleChange={(visible) => {
          if (visible) {
            set$list(policiesList);
          }
        }}
        onClose={() => {
          onCancel && onCancel();
        }}
        topRight={
          <Space size={30}>
            <FComponentsLib.FTextBtn
              onClick={() => {
                onCancel && onCancel();
              }}>{FI18n.i18nNext.t('btn_cancel')}</FComponentsLib.FTextBtn>
            <FComponentsLib.FRectBtn
              disabled={$list.every((l) => {
                return l.status === 0;
              })}
              onClick={() => {
                // const updatePolicies: { policyID: string; checked: boolean; }[] = policiesList
                //   .map((item) => {
                //     return { policyID: item.policyId, checked: item.checked };
                //   });
                onConfirm && onConfirm(get$list().map((l) => {
                  return {
                    policyID: l.policyId,
                    checked: l.status === 1,
                  };
                }));
              }}
              type='primary'
            >
              {confirmText}
            </FComponentsLib.FRectBtn>
          </Space>
        }
      >
        <div className={styles.tip}>
          <i className={`freelog fl-icon-warningxiaochicun ${styles.icon}`} />
          <div className={styles.text}>
            {/*{typeMapping[type]}上架需要启用至少一个授权策略，请选择你想要启用的授权策略*/}
            {tipText}
          </div>
        </div>
        {
          $list.map((item) => {
            return (
              <div key={item.policyId}>
                <Checkbox
                  style={{ marginBottom: '10px' }}
                  checked={item.status === 1}
                  onChange={(e) => {
                    // console.log('**** iuohwjelkfjlskej *****');
                    // item.checked = e.target.checked;
                    // updateActiveList();
                    set$list(get$list().map((l) => {
                      if (l.policyId === item.policyId) {
                        return {
                          ...l,
                          status: e.target.checked ? 1 : 0,
                        };
                      }
                      return l;
                    }));
                  }}
                />
                <PolicyCard
                  fullInfo={item}
                  activeBtnShow={false}
                  onOnlineChange={(bool) => {
                    // console.log(bool, ';bsd9fojsdlkfjsdlkjfldsjfldsjl');
                    // item.checked = bool;
                    // updateActiveList();
                    set$list(get$list().map((l) => {
                      if (l.policyId === item.policyId) {
                        return {
                          ...l,
                          status: bool ? 1 : 0,
                        };
                      }
                      return l;
                    }));
                  }}
                />
              </div>
            );
          })
        }
        {/*<FComponentsLib.FRectBtn style={{ marginTop: '-10px' }} onClick={onNewPolicy} type='primary'>*/}
        {/*  {FI18n.i18nNext.t('set_resource_available_for_auth_activate_auth_plan_btn_create')}*/}
        {/*</FComponentsLib.FRectBtn>*/}
      </FDrawer>
    </>
  );
}

export default FPolicyOperatorDrawer;
