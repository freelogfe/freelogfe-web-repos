import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceAuthPageModelState} from "@/models/connect";
import {ChangeAction} from "@/models/resourceAuthPage";
import {FTextBtn} from "@/components/FButton";
import FUtil from "@/utils";
import FResourceStatusBadge from "@/components/FResourceStatusBadge";

interface ResourcesProps {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function Resources({resourceAuthPage, dispatch}: ResourcesProps) {
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

  console.log(resourceAuthPage.contractsAuthorized, 'resourceAuthPage.contractsAuthorized!@#$!@#$234908uopiasdf');

  const dataSource = resourceAuthPage.contractsAuthorized.map((i) => ({
    id: i.id,
    activated: i.activated,
    title: i.title,
    resourceType: i.resourceType,
    version: i.version,
    labels: i.contracts.map((j) => j.title)
  }));

  return (<div className={styles.styles}>
    {dataSource.map((i) => (
      <div
        key={i.id}
        onClick={() => onChangeActivated(i.id)}
        className={styles.DepPanelNav + ' ' + (i.activated ? styles.DepPanelNavActive : '')}>
        <div>
          <div className={styles.title}>
            <FTextBtn
              style={{
                flexShrink: 1,
              }}
              type="default"
              onClick={(event) => {
                event.stopPropagation();
                window.open(FUtil.LinkTo.resourceDetails({
                  resourceID: i.id,
                }))
              }}
            >
              <FContentText
                text={i.title}
                singleRow
                style={{maxWidth: 280}}
              />
            </FTextBtn>

            {/*<div style={{flexShrink: 0, paddingLeft: 10}}>*/}
            {/*  <FResourceStatusBadge*/}
            {/*    status="online"*/}
            {/*  />*/}
            {/*</div>*/}
          </div>
          <div style={{height: 9}}/>
          <FContentText type="additional2">
            <span>{i.resourceType}</span>
          </FContentText>
          <>
            <div style={{height: 9}}/>
            <div className={styles.DepPanelLabels}>
              {
                i.labels.map((j: string) => (<label
                  key={j}
                  className={styles.labelInfo}
                >{j}</label>))
              }
            </div>
          </>
        </div>
      </div>))}
  </div>);
}


export default connect(({resourceAuthPage}: ConnectState) => ({
  resourceAuthPage: resourceAuthPage
}))(Resources);
