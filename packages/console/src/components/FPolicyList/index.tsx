import * as React from 'react';
import styles from './index.less';
import FSwitch from '../FSwitch';
import { Space, Spin } from 'antd';
import FModal from '../FModal';
import FPolicyDisplay from '../FPolicyDisplay';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import { FI18n } from '@freelog/tools-lib';
import FTooltip from '../FTooltip';
import FComponentsLib from '@freelog/components-lib';

interface FPolicyListProps {
  dataSource: PolicyFullInfo_Type[];

  atLeastOneUsing?: boolean;
  allDisabledSwitch?: boolean;

  onCheckChange?(data: { id: string; using: boolean }): void;
}

function FPolicyList({
                       dataSource,
                       atLeastOneUsing = false,
                       allDisabledSwitch = false,
                       onCheckChange,
                     }: FPolicyListProps) {
  // console.log(dataSource, 'dataSource#@@@@@#@##########');
  const disabledOnlyUsing: boolean = atLeastOneUsing
    ? dataSource.filter((ds) => {
    return ds.status === 1;
  }).length <= 1
    : false;

  return (
    <div className={styles.styles}>
      {dataSource.map((ds) => {
        // console.log(ds, 'dsfijdflksdjflkjsdlkfjsldkfjsldkjlk');
        return (
          <PolicyCard
            key={ds.policyId}
            fullInfo={ds}
            onlineDisable={allDisabledSwitch || disabledOnlyUsing && ds.status === 1}
            onOnlineChange={(value) => {
              onCheckChange && onCheckChange({ id: ds.policyId, using: value });
            }}
          />
        );
      })}

      <div style={{ width: 420 }} />
      <div style={{ width: 420 }} />
    </div>
  );
}

export default FPolicyList;

interface PolicyCardProps {
  fullInfo: PolicyFullInfo_Type;
  onlineDisable?: boolean;
  activeBtnShow?: boolean;

  onOnlineChange?(bool: boolean): void;
}

export function PolicyCard({
                             fullInfo,
                             onlineDisable = false,
                             activeBtnShow = true,
                             onOnlineChange,
                           }: PolicyCardProps) {
  const [fullScreenVisible, setFullScreenVisible] = React.useState<boolean>(false);
  const [loading, set_loading] = React.useState<boolean>(false);

  React.useEffect(() => {
    // console.log('#####89sdflsdkfjlsdjl****');
    set_loading(false);
  }, [fullInfo]);
  // console.log(fullInfo.policyName, 'fullInfo.policyNameosdjlkfjlksdjlkj');
  return (
    <div className={styles.policy}>
      <div className={styles.header}>
        <FComponentsLib.FContentText
          type='highlight'
          text={fullInfo.policyName}
          style={{ maxWidth: 150 }}
          singleRow
        />

        {activeBtnShow && (
          <Space size={8}>
            <label style={{ color: fullInfo.status === 1 ? '#42C28C' : '#B4B6BA' }}>
              {FI18n.i18nNext.t('btn_activate_auth_plan')}
            </label>

            <FTooltip
              title={FI18n.i18nNext.t('msg_activateauthplan_disable')}
              zIndex={onlineDisable ? 1 : -1}
            >
              <div>
                <Spin spinning={loading}>
                  <FSwitch
                    disabled={onlineDisable}
                    checked={fullInfo.status === 1}
                    onChange={(value) => {
                      onOnlineChange && onOnlineChange(value);
                      set_loading(true);
                    }}
                  />
                </Spin>
              </div>
            </FTooltip>
          </Space>
        )}
      </div>
      <div style={{ height: 10 }} />
      <div style={{ padding: '0 20px' }}>
        <FPolicyDisplay containerHeight={170} fullInfo={fullInfo} />
      </div>

      <a
        className={styles.PolicyFullScreenBtn}
        onClick={() => {
          setFullScreenVisible(true);
        }}
      >
        <FComponentsLib.FIcons.FFullScreen style={{ fontSize: 12 }} />
      </a>
      <FModal
        title={null}
        open={fullScreenVisible}
        onCancel={() => {
          setFullScreenVisible(false);
        }}
        width={1240}
        footer={null}
        centered
      >
        <div className={styles.ModalTile}>
          <FComponentsLib.FTitleText text={fullInfo.policyName} type='h2' />
          <div style={{ width: 20 }} />
          <label style={{ color: fullInfo.status === 1 ? '#42C28C' : '#B4B6BA' }}>
            {FI18n.i18nNext.t('btn_activate_auth_plan')}
          </label>
          <div style={{ width: 10 }} />
          <FSwitch
            disabled={onlineDisable}
            checked={fullInfo.status === 1}
            onChange={(value) => {
              onOnlineChange && onOnlineChange(value);
            }}
          />
        </div>
        <div style={{ padding: '0 20px' }}>
          <FPolicyDisplay containerHeight={770} fullInfo={fullInfo} />
        </div>
      </FModal>
    </div>
  );
}
