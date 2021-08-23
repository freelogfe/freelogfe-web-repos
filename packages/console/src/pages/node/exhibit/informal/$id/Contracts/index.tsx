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
import FSwitch from '@/components/FSwitch';

interface ContractsProps {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Contracts({ dispatch, informExhibitInfoPage }: ContractsProps) {

  if (informExhibitInfoPage.associated.length === 0) {
    return null;
  }

  const otherResource = informExhibitInfoPage.associated;

  const selectedResource = informExhibitInfoPage.associated.find((a) => a.selected);

  // console.log(selectedResource, 'selectedResource@#RFasdj90ujlkjlkp0[');

  function onChangeSelect(id: string) {
    dispatch<ChangeAction>({
      type: 'informExhibitInfoPage/change',
      payload: {
        associated: informExhibitInfoPage.associated.map((a) => ({
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
                r.contracts.map((c) => (<label key={c.id}>{c.name}</label>))
              }
            </div>
          </a>))
        }

      </div>

      <div className={styles.signRight}>
        <div>
          {
            selectedResource?.contracts && selectedResource?.contracts.length > 0 && (<>
              <div className={styles.smallTitle}>当前合约</div>
              <div style={{ height: 5 }} />
              {
                selectedResource?.contracts.map((c) => (<div
                  key={c.id}
                  className={styles.Contracts}
                >
                  <div className={styles.content}>
                    <Space size={5}>
                      <span>{c.name}</span>
                      <label className={styles.executing}>执行中</label>
                    </Space>
                    <div style={{ height: 10 }} />
                    <pre>{c.text}</pre>
                    <div style={{ height: 10 }} />
                  </div>
                  <div className={styles.footer}>
                    <div>
                      合约ID {c.id}
                    </div>
                    <div>
                      签约时间 {c.createTime}
                    </div>
                  </div>
                </div>))
              }
            </>)
          }

          {
            selectedResource?.policies && selectedResource?.policies.length > 0 &&
            (<>
              <div className={styles.smallTitle}>未签约策略</div>
              <div style={{ height: 5 }} />
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
            </>)
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

  return (<div
    className={styles.singPolicy}
  >
    <div className={styles.singPolicyHeader}>
      <span>{name}</span>
      <a
        className={styles.singPolicyHeaderBtn}
        onClick={() => {
          onClickSign && onClickSign();
        }}
      >签约</a>
    </div>
    {/*<div style={{ height: 15 }} />*/}
    {/*<pre>{text}</pre>*/}
    <FPolicyDisplay code={text} containerHeight={170} />

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

      <FPolicyDisplay
        containerHeight={770}
        code={text}
      />
    </FModal>

  </div>);
}
