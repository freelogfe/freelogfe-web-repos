import * as React from 'react';
import styles from './index.less';
import { FTitleText, FContentText } from '@/components/FText';
import { connect, Dispatch } from 'dva';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import { Space } from 'antd';
import { FRectBtn } from '@/components/FButton';
import { UpdateRelationAction } from '@/models/exhibitInfoPage';
import FPolicyDisplay from '@/components/FPolicyDisplay';
import FFullScreen from '@/components/FIcons/FFullScreen';
import FModal from '@/components/FModal';

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
    return pl.id === fullScreenVisibleID;
  });

  return (<div>
    <FTitleText type='h4'>未签约策略</FTitleText>
    <div style={{ height: 5 }} />
    <Space style={{ width: '100%' }} size={15} direction='vertical'>
      {
        selectedResource?.policies.map((p) => (<div
          className={styles.singPolicy}
          key={p.id}
        >
          <div className={styles.singPolicyHeader}>
            <FContentText type='highlight'>{p.name}</FContentText>

            <FRectBtn
              style={{ height: 26, padding: '0 15px' }}
              size='small'
              onClick={() => dispatch<UpdateRelationAction>({
                type: 'exhibitInfoPage/updateRelation',
                payload: {
                  resourceId: selectedResource.id,
                  policyId: p.id,
                },
              })}
            >签约</FRectBtn>
          </div>
          <div style={{ height: 10 }} />
          {/*<div style={{height: 15}}/>*/}
          {/*<pre>{p.text}</pre>*/}
          <FPolicyDisplay containerHeight={170} code={p.text} />

          <a
            className={styles.PolicyFullScreenBtn}
            onClick={() => {
              setFullScreenVisibleID(p.id);
            }}
          ><FFullScreen style={{ fontSize: 12 }} /></a>

        </div>))
      }
    </Space>
    <FModal
      title={null}
      visible={!!fullScreenVisibleID}
      onCancel={() => {
        setFullScreenVisibleID('');
      }}
      width={1240}
      footer={null}
      centered
    >
      <div className={styles.ModalTile}>
        <FTitleText text={fullScreenPolicy?.name || ''} type='h2' />
        <div style={{ width: 20 }} />
        <FRectBtn
          style={{ height: 26, padding: '0 15px' }}
          size='small'
          onClick={() => {
            dispatch<UpdateRelationAction>({
              type: 'exhibitInfoPage/updateRelation',
              payload: {
                resourceId: selectedResource.id,
                policyId: fullScreenPolicy?.id || '',
              },
            });
            setFullScreenVisibleID('');
          }}
        >签约</FRectBtn>
      </div>

      <FPolicyDisplay
        containerHeight={770}
        code={fullScreenPolicy?.text || ''}
      />
    </FModal>
  </div>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Policy);
