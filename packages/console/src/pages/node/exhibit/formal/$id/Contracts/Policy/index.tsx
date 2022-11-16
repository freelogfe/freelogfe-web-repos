import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import { Space } from 'antd';
import { UpdateRelationAction } from '@/models/exhibitInfoPage';
import FPolicyDisplay from '@/components/FPolicyDisplay';
import FModal from '@/components/FModal';
import FComponentsLib from '@freelog/components-lib';
import { FI18n } from '@freelog/tools-lib';

interface PolicyProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Policy({ dispatch, exhibitInfoPage }: PolicyProps) {

  const [fullScreenVisibleID, setFullScreenVisibleID] = React.useState<string>('');
  const selectedResource = exhibitInfoPage.contract_Associated.find((a) => a.id === exhibitInfoPage.contract_SelectedAssociatedID);

  if (!selectedResource?.policies || selectedResource?.policies.length === 0) {
    return null;
  }

  const fullScreenPolicy = selectedResource.policies.find((pl) => {
    return pl.policyId === fullScreenVisibleID;
  });

  return (<div>
    <div style={{ height: 10 }} />
    {/*<FComponentsLib.FTitleText type='h4'>未签约策略</FComponentsLib.FTitleText>*/}
    <FComponentsLib.FTitleText
      type='h4'>{FI18n.i18nNext.t('getauth_title_authplanavailable')}</FComponentsLib.FTitleText>
    <div style={{ height: 5 }} />
    <Space style={{ width: '100%' }} size={15} direction='vertical'>
      {
        selectedResource?.policies.map((p) => (<div
          className={styles.singPolicy}
          key={p.policyId}
        >
          <div className={styles.singPolicyHeader}>
            <FComponentsLib.FContentText type='highlight'>{p.policyName}</FComponentsLib.FContentText>

            <FComponentsLib.FRectBtn
              style={{ height: 26, padding: '0 15px' }}
              size='small'
              onClick={() => dispatch<UpdateRelationAction>({
                type: 'exhibitInfoPage/updateRelation',
                payload: {
                  resourceId: selectedResource.id,
                  policyId: p.policyId,
                },
              })}
            >签约</FComponentsLib.FRectBtn>
          </div>
          <div style={{ height: 10 }} />
          <div style={{ padding: '0 20px' }}>
            <FPolicyDisplay
              fullInfo={p}
            />
          </div>
          <a
            className={styles.PolicyFullScreenBtn}
            onClick={() => {
              setFullScreenVisibleID(p.policyId);
            }}
          ><FComponentsLib.FIcons.FFullScreen style={{ fontSize: 12 }} /></a>

        </div>))
      }
    </Space>
    <FModal
      title={null}
      open={!!fullScreenVisibleID}
      onCancel={() => {
        setFullScreenVisibleID('');
      }}
      width={1240}
      footer={null}
      centered
    >
      <div className={styles.ModalTile}>
        <FComponentsLib.FTitleText text={fullScreenPolicy?.policyName || ''} type='h2' />
        <div style={{ width: 20 }} />
        <FComponentsLib.FRectBtn
          style={{ height: 26, padding: '0 15px' }}
          size='small'
          onClick={() => {
            dispatch<UpdateRelationAction>({
              type: 'exhibitInfoPage/updateRelation',
              payload: {
                resourceId: selectedResource.id,
                policyId: fullScreenPolicy?.policyId || '',
              },
            });
            setFullScreenVisibleID('');
          }}
        >签约</FComponentsLib.FRectBtn>
      </div>
      <div style={{ padding: '0 20px' }}>
        {
          fullScreenPolicy && (<FPolicyDisplay
            containerHeight={770}
            // code={fullScreenPolicy?.policyText || ''}
            fullInfo={fullScreenPolicy}
          />)
        }
      </div>
    </FModal>
  </div>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Policy);
