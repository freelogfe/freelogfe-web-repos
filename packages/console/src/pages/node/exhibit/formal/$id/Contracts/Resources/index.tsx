import * as React from 'react';
import styles from './index.less';
import { connect, Dispatch } from 'dva';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import { FContentText, FTitleText } from '@/components/FText';
import { FTextBtn } from '@/components/FButton';
import { FUtil } from '@freelog/tools-lib';
import { ChangeAction } from '@/models/exhibitInfoPage';
import FResourceContractLabels from '@/components/FResourceContractLabels';

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
    <FTitleText type='h4'>主资源</FTitleText>

    <a
      className={styles.signResource + ' ' + (mainResource.id === exhibitInfoPage.contract_SelectedAssociatedID ? styles.activatedSignResource : '')}
      onClick={() => {
        onChange({ contract_SelectedAssociatedID: mainResource.id });
      }}
    >
      <FTextBtn
        onClick={(e) => {
          e.stopPropagation();
          window.open(FUtil.LinkTo.resourceDetails({
            resourceID: mainResource.id,
          }));
        }}
      >
        <FContentText
          type='highlight'
          text={mainResource.name}
          singleRow
          className={styles.FContentText}
        />
      </FTextBtn>
      <div style={{ height: 5 }} />
      <FContentText
        type='additional2'
        text={mainResource.type}
      />
      <div style={{ height: 5 }} />
      <FResourceContractLabels contracts={mainResource.contracts.map((c) => {
        return {
          name: c.name,
          auth: c.status === 'active' || c.status === 'testActive',
        };
      })} />
      {/*<div className={styles.policeTags}>*/}
      {/*  /!*{*!/*/}
      {/*  /!*  mainResource.contracts.map((c) => (<div key={c.id}>*!/*/}
      {/*  /!*    <span>{c.name}</span>*!/*/}
      {/*  /!*    <div style={{ width: 5 }} />*!/*/}
      {/*  /!*    <label style={{ backgroundColor: c.status !== 'inactive' ? '#42C28C' : '#E9A923' }} />*!/*/}
      {/*  /!*  </div>))*!/*/}
      {/*  /!*}*!/*/}
      {/*  {console.log(mainResource.contracts, 'mainResource.contracts9232342423423')}*/}
      {/*  */}
      {/*</div>*/}
    </a>

    {
      otherResource.length > 0 && (<FTitleText type='h4'>基础上抛</FTitleText>)
    }

    {
      otherResource.map((r) => (<a
        className={styles.signResource + ' ' + (exhibitInfoPage.contract_SelectedAssociatedID === r.id ? styles.activatedSignResource : '')}
        onClick={() => {
          onChange({ contract_SelectedAssociatedID: r.id });
        }}
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
        {/*<div className={styles.policeTags}>*/}
        {/*  {*/}
        {/*    r.contracts.map((c) => (<div key={c.id}>*/}
        {/*      <span>{c.name}</span>*/}
        {/*      <div style={{ width: 5 }} />*/}
        {/*      <label style={{ backgroundColor: c.status !== 'inactive' ? '#42C28C' : '#E9A923' }} />*/}
        {/*    </div>))*/}
        {/*  }*/}
        {/*</div>*/}
        {/*{console.log(r.contracts, 'r.contracts.@#$@#$@#$')}*/}
        <FResourceContractLabels contracts={r.contracts.map((c) => {
          return {
            name: c.name,
            auth: c.status === 'active' || c.status === 'testActive',
          };
        })} />
      </a>))
    }
  </>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Resources);
