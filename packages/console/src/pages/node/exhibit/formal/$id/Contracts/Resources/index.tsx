import * as React from 'react';
import styles from './index.less';
import { connect, Dispatch } from 'dva';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import { FUtil } from '@freelog/tools-lib';
import { ChangeAction } from '@/models/exhibitInfoPage';
import FResourceContractLabels from '@/components/FResourceContractLabels';
import FComponentsLib from '@freelog/components-lib';

interface ResourcesProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Resources({ dispatch, exhibitInfoPage }: ResourcesProps) {

  const [mainResource, ...otherResource] = exhibitInfoPage.contract_Associated;

  async function onChange(payload: Partial<ExhibitInfoPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: payload,
    });
  }

  return (<>
    <FComponentsLib.FTitleText type='h4'>主资源</FComponentsLib.FTitleText>

    <a
      className={styles.signResource + ' ' + (mainResource.id === exhibitInfoPage.contract_SelectedAssociatedID ? styles.activatedSignResource : '')}
      onClick={() => {
        onChange({ contract_SelectedAssociatedID: mainResource.id });
      }}
    >
      <FComponentsLib.FTextBtn
        onClick={(e) => {
          e.stopPropagation();
          window.open(FUtil.LinkTo.resourceDetails({
            resourceID: mainResource.id,
          }));
        }}
      >
        <FComponentsLib.FContentText
          type='highlight'
          text={mainResource.name}
          singleRow
          className={styles.FContentText}
        />
      </FComponentsLib.FTextBtn>
      <div style={{ height: 5 }} />
      <FComponentsLib.FContentText
        type='additional2'
        text={FUtil.Format.resourceTypeKeyArrToResourceType(mainResource.type)}
      />
      <div style={{ height: 5 }} />
      <FResourceContractLabels
        contracts={mainResource.contracts.map((c) => {
          return {
            name: c.name,
            auth: c.status === 'active' || c.status === 'testActive',
          };
        })}
      />
    </a>

    {
      otherResource.length > 0 && (<FComponentsLib.FTitleText type='h4'>基础上抛</FComponentsLib.FTitleText>)
    }

    {
      otherResource.map((r) => (<a
        className={styles.signResource + ' ' + (exhibitInfoPage.contract_SelectedAssociatedID === r.id ? styles.activatedSignResource : '')}
        onClick={() => {
          onChange({ contract_SelectedAssociatedID: r.id });
        }}
        key={r.id}
      >
        <FComponentsLib.FTextBtn
          onClick={(e) => {
            e.stopPropagation();
            window.open(FUtil.LinkTo.resourceDetails({
              resourceID: r.id,
            }));
          }}
        >
          <FComponentsLib.FContentText
            type='highlight'
            text={r.name}
            singleRow
            className={styles.FContentText}
          />
        </FComponentsLib.FTextBtn>
        <div style={{ height: 5 }} />
        <FComponentsLib.FContentText
          type='additional2'
          text={FUtil.Format.resourceTypeKeyArrToResourceType(r.type)}
        />
        <div style={{ height: 5 }} />
        <FResourceContractLabels
          contracts={r.contracts.map((c) => {
            return {
              name: c.name,
              auth: c.status === 'active' || c.status === 'testActive',
            };
          })}
        />
      </a>))
    }
  </>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Resources);
