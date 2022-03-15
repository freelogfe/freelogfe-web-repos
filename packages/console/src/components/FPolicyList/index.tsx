import * as React from 'react';
import styles from './index.less';
import FUtil1 from '@/utils';
import FSwitch from '../FSwitch';
import { Space } from 'antd';
import { FContentText, FTitleText } from '../FText';
import FModal from '../FModal';
import FFullScreen from '../FIcons/FFullScreen';
import FPolicyDisplay from '../FPolicyDisplay';
import { PolicyFullInfo } from '@/type/contractTypes';

interface FPolicyListProps {

  dataSource: PolicyFullInfo[];

  atLeastOneUsing?: boolean;

  onCheckChange?(data: { id: string; using: boolean; }): void;
}

function FPolicyList({ dataSource, atLeastOneUsing = false, onCheckChange }: FPolicyListProps) {
  // console.log(dataSource, 'dataSource#@@@@@#@##########');
  const disabledOnlyUsing: boolean = atLeastOneUsing ? dataSource.filter((ds) => {
    return ds.status === 1;
  }).length <= 1 : false;

  return (<div className={styles.styles}>
    {
      dataSource.map((ds) => {
        return (<PolicyCard
          key={ds.policyId}
          fullInfo={ds}
          onlineDisable={disabledOnlyUsing && ds.status === 1}
          onOnlineChange={(value) => {
            onCheckChange && onCheckChange({ id: ds.policyId, using: value });
          }}
        />);
      })
    }

    <div style={{ width: 420 }} />
    <div style={{ width: 420 }} />

  </div>);
}

export default FPolicyList;

interface PolicyCardProps {
  fullInfo: PolicyFullInfo;
  onlineDisable: boolean;

  onOnlineChange?(bool: boolean): void;
}

function PolicyCard({ fullInfo, onlineDisable, onOnlineChange }: PolicyCardProps) {

  const [fullScreenVisible, setFullScreenVisible] = React.useState<boolean>();

  return (<div className={styles.policy}>
    <div className={styles.header}>
      <FContentText
        type='highlight'
        text={fullInfo.policyName}
        style={{ maxWidth: 150 }}
        singleRow
      />
      <Space size={8}>
        <label
          style={{ color: fullInfo.status === 1 ? '#42C28C' : '#B4B6BA' }}>{FUtil1.I18n.message('btn_activate_auth_plan')}</label>
        <FSwitch
          disabled={onlineDisable}
          checked={fullInfo.status === 1}
          onChange={(value) => {
            onOnlineChange && onOnlineChange(value);
          }}
        />
      </Space>
    </div>
    <div style={{ height: 10 }} />
    <div style={{ padding: '0 20px' }}>
      <FPolicyDisplay
        containerHeight={170}
        fullInfo={fullInfo}
      />
    </div>

    <a
      className={styles.PolicyFullScreenBtn}
      onClick={() => {
        setFullScreenVisible(true);
      }}
    ><FFullScreen style={{ fontSize: 12 }} /></a>
    <FModal
      title={null}
      visible={fullScreenVisible}
      onCancel={() => {
        setFullScreenVisible(false);
      }}
      width={1240}
      footer={null}
      centered
    >
      <div className={styles.ModalTile}>
        <FTitleText text={fullInfo.policyName} type='h2' />
        <div style={{ width: 20 }} />
        <label
          style={{ color: fullInfo.status === 1 ? '#42C28C' : '#B4B6BA' }}>{FUtil1.I18n.message('btn_activate_auth_plan')}</label>
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
        <FPolicyDisplay
          containerHeight={770}
          fullInfo={fullInfo}
        />
      </div>
    </FModal>

  </div>);
}
