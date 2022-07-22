import * as React from 'react';
import styles from './index.less';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceAuthPageModelState } from '@/models/connect';
import { ChangeAction } from '@/models/resourceAuthPage';
import { FUtil } from '@freelog/tools-lib';
import FResourceContractLabels from '@/components/FResourceContractLabels';
import FComponentsLib from '@freelog/components-lib';

interface ResourcesProps {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function Resources({ resourceAuthPage, dispatch }: ResourcesProps) {

  function onChangeActivated(id: number | string) {
    dispatch<ChangeAction>({
      type: 'resourceAuthPage/change',
      payload: {
        contractsAuthorized: resourceAuthPage.contractsAuthorized.map((i) => ({
          ...i,
          activated: i.id === id,
        })),
      },
    });
  }

  const dataSource = resourceAuthPage.contractsAuthorized.map((i) => ({
    id: i.id,
    activated: i.activated,
    title: i.title,
    resourceType: i.resourceType,
    version: i.version,
    contracts: i.contracts,
  }));

  return (<div className={styles.styles}>
    {
      dataSource.map((i) => (
        <div
          key={i.id}
          onClick={() => onChangeActivated(i.id)}
          className={styles.DepPanelNav + ' ' + (i.activated ? styles.DepPanelNavActive : '')}>
          <div>
            <div className={styles.title}>
              <FComponentsLib.FTextBtn
                style={{
                  flexShrink: 1,
                }}
                type='default'
                onClick={(event) => {
                  event.stopPropagation();
                  window.open(FUtil.LinkTo.resourceDetails({
                    resourceID: i.id,
                  }));
                }}
              >
                <FComponentsLib.FContentText
                  text={i.title}
                  singleRow
                  style={{ maxWidth: 280 }}
                  className={styles.FContentText}
                  type='highlight'
                />
              </FComponentsLib.FTextBtn>

              {/*<div style={{flexShrink: 0, paddingLeft: 10}}>*/}
              {/*  <FResourceStatusBadge*/}
              {/*    status="online"*/}
              {/*  />*/}
              {/*</div>*/}
            </div>
            <div style={{ height: 9 }} />
            <FComponentsLib.FContentText type='additional2'>
              <span>{i.resourceType}</span>
            </FComponentsLib.FContentText>
            <div style={{ height: 9 }} />
            <FResourceContractLabels contracts={i.contracts.map((j) => {
              return {
                name: j.title,
                auth: j.status === 'active' || j.status === 'testActive',
              };
            })} />
            {/*<div className={styles.DepPanelLabels}>*/}
            {/*  {*/}
            {/*    i.contracts.map((j) => (<div*/}
            {/*      key={j.id}*/}
            {/*      className={styles.labelInfo}*/}
            {/*    >*/}
            {/*      <span>{j.title}</span>*/}
            {/*      <div style={{ width: 5 }} />*/}
            {/*      <label style={{*/}
            {/*        backgroundColor: j.status === 'terminal'*/}
            {/*          ? '#999' :*/}
            {/*          j.status === 'inactive'*/}
            {/*            ? '#E9A923' : '#42C28C',*/}
            {/*      }} /></div>))*/}
            {/*  }*/}
            {/*</div>*/}
          </div>
        </div>))
    }
  </div>);
}


export default connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage: resourceAuthPage,
}))(Resources);
