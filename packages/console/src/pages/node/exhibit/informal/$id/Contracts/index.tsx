import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import { Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ConnectState, InformExhibitInfoPageModelState } from '@/models/connect';
import { ChangeAction, UpdateRelationAction } from '@/models/informExhibitInfoPage';
import { FUtil } from '@freelog/tools-lib';
import { FTextBtn } from '@/components/FButton';
import FPolicyDisplay from '@/components/FPolicyDisplay';
import FFullScreen from '@/components/FIcons/FFullScreen';
import FModal from '@/components/FModal';
import FUtil1 from '@/utils';
// import FSwitch from '@/components/FSwitch';
import FContractDisplay from '@/components/FContractDisplay';
import FDivider from '@/components/FDivider';
import { FRectBtn } from '@/components/FButton';

interface ContractsProps {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Contracts({ dispatch, informExhibitInfoPage }: ContractsProps) {

  if (informExhibitInfoPage.contract_Associated.length === 0) {
    return null;
  }

  const otherResource = informExhibitInfoPage.contract_Associated;

  const selectedResource = informExhibitInfoPage.contract_Associated.find((a) => a.selected);

  function onChangeSelect(id: string) {
    dispatch<ChangeAction>({
      type: 'informExhibitInfoPage/change',
      payload: {
        contract_Associated: informExhibitInfoPage.contract_Associated.map((a) => ({
          ...a,
          selected: a.id === id,
        })),
      },
    });
  }

  return (<div>
    <FTitleText
      text={'关联合约'}
      type='h3'
    />

    <div style={{ height: 20 }} />

    <div className={styles.sign}>
      <div className={styles.signLeft}>

        {
          otherResource.map((r) => (<a
            className={styles.signResource + ' ' + (r.selected ? styles.activatedSignResource : '')}
            onClick={() => onChangeSelect(r.id)}
            key={r.id}
          >
            <FTextBtn
              onClick={(e) => {
                e.stopPropagation();
                window.open(FUtil.LinkTo.resourceDetails({
                  resourceID: r.id,
                }));
              }}
            >
              <FContentText
                type='highlight'
                text={r.name}
                singleRow
                className={styles.FContentText}
              />
            </FTextBtn>
            <div style={{ height: 5 }} />
            <FContentText
              type='additional2'
              text={r.type}
            />
            <div style={{ height: 5 }} />
            <div className={styles.policeTags}>
              {
                r.contracts.map((c) => (<div key={c.id}>
                  <span>{c.name}</span>
                  <div style={{ width: 5 }} />
                  <label style={{ backgroundColor: c.status !== 'inactive' ? '#42C28C' : '#E9A923' }} />
                </div>))
              }
            </div>
          </a>))
        }

      </div>

      <div className={styles.signRight}>
        <div>
          {
            selectedResource?.contracts && selectedResource?.contracts.length > 0 && (<div>
              <FTitleText type='h4'>{FUtil1.I18n.message('valid_contracts_list')}</FTitleText>
              <div style={{ height: 10 }} />
              <Space style={{ width: '100%' }} size={15} direction='vertical'>
                {
                  selectedResource?.contracts.map((c) => (<div
                    key={c.id}
                    className={styles.Contracts}
                  >
                    {/*<div className={styles.content}>*/}
                    <div style={{ height: 10 }} />
                    <Space size={5} style={{ padding: '0 20px' }}>
                      <FContentText type='highlight'>{c.name}</FContentText>
                      {/*<label className={styles.executing}>执行中</label>*/}
                    </Space>
                    <div style={{ height: 10 }} />
                    <div style={{ padding: '0 20px' }}>
                      <FContractDisplay contractID={c.id} />
                    </div>
                    <div style={{ height: 10 }} />

                    <Space style={{ padding: '0 20px' }} size={5}>
                      <FContentText
                        type='additional2'
                        text={FUtil1.I18n.message('contract_id') + '：' + c.id}
                      />
                      <FDivider style={{ fontSize: 14 }} />
                      <FContentText
                        type='additional2'
                        text={FUtil1.I18n.message('contract_signed_time') + '：' + c.createTime}
                      />
                    </Space>

                    <div style={{ height: 10 }} />
                  </div>))
                }

                <div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FContentText text={'查看已终止的合约请移至'} type='negative' />
                    <FTextBtn onClick={() => {
                      window.open(`${FUtil.Format.completeUrlByDomain('user')}${FUtil.LinkTo.contract()}`);
                    }}>合约管理</FTextBtn>
                  </div>
                  <div style={{ height: 5 }} />
                </div>
              </Space>
            </div>)
          }

          <div style={{ height: 15 }} />

          {
            selectedResource?.policies && selectedResource?.policies.length > 0 &&
            (<div>
              <FTitleText type='h4'>未签约策略</FTitleText>
              <div style={{ height: 5 }} />
              <Space style={{ width: '100%' }} size={15} direction='vertical'>
                {
                  selectedResource?.policies.map((p) => (<SinglePolicy
                    key={p.id}
                    name={p.name}
                    text={p.text}
                    onClickSign={() => {
                      dispatch<UpdateRelationAction>({
                        type: 'informExhibitInfoPage/updateRelation',
                        payload: {
                          resourceId: selectedResource.id,
                          policyId: p.id,
                        },
                      });
                    }}
                  />))
                }
              </Space>
            </div>)
          }
        </div>
      </div>
    </div>
  </div>);
}

export default connect(({ informExhibitInfoPage }: ConnectState) => ({
  informExhibitInfoPage,
}))(Contracts);

interface SinglePolicyProps {
  name: string;
  text: string;

  onClickSign?(): void;
}

function SinglePolicy({ name, text, onClickSign }: SinglePolicyProps) {

  const [fullScreenVisible, setFullScreenVisible] = React.useState<boolean>(false);

  return (<div className={styles.singPolicy}>
    <div className={styles.singPolicyHeader}>
      {/*<span>{name}</span>*/}
      <FContentText type='highlight' text={name} />
      <FRectBtn
        style={{ height: 26, padding: '0 15px' }}
        // className={styles.singPolicyHeaderBtn}
        size='small'
        onClick={() => {
          onClickSign && onClickSign();
        }}
      >签约</FRectBtn>
    </div>
    <div style={{ height: 10 }} />
    {/*<div style={{ height: 15 }} />*/}
    {/*<pre>{text}</pre>*/}
    <div style={{ padding: '0 20px' }}>
      <FPolicyDisplay
        code={text}
        // containerHeight={170}
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
        <FTitleText text={name} type='h2' />
        <div style={{ width: 20 }} />
        <a
          className={styles.singPolicyHeaderBtn}
          onClick={() => {
            onClickSign && onClickSign();
          }}
        >签约</a>
      </div>
      <div style={{ padding: '0 20px' }}>
        <FPolicyDisplay
          containerHeight={770}
          code={text}
        />
      </div>
    </FModal>

  </div>);
}
