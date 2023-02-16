import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceAuthPageModelState } from '@/models/connect';
import { ChangeAction } from '@/models/resourceAuthPage';
import { FUtil, FI18n } from '@freelog/tools-lib';
import FResourceContractLabels from '@/components/FResourceContractLabels';
import FComponentsLib from '@freelog/components-lib';
import FTooltip from '@/components/FTooltip';
import FResourceStatusBadge from '@/components/FResourceStatusBadge';
import FAutoOverflowTooltipTitle from '@/components/FAutoOverflowTooltipTitle';

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

  // const dataSource = resourceAuthPage.contractsAuthorized.map((i) => ({
  //   id: i.id,
  //   activated: i.activated,
  //   title: i.title,
  //   resourceType: i.resourceType,
  //   version: i.version,
  //   contracts: i.contracts,
  //   state: i.state,
  // }));

  return (<div className={styles.styles}>
    {
      resourceAuthPage.contractsAuthorized.map((i) => (
        <div
          key={i.id}
          onClick={() => onChangeActivated(i.id)}
          className={[styles.DepPanelNav, (i.activated ? styles.DepPanelNavActive : '')].join(' ')}>
          <div>
            <FAutoOverflowTooltipTitle
              title={i.title}
              right={<>
                {i.error === 'offline' && (<FResourceStatusBadge status={'offline'} />)}
                {i.error === 'unreleased' && (<FResourceStatusBadge status={'unreleased'} />)}
                {i.error === 'freeze' && (<FComponentsLib.FIcons.FForbid style={{ color: '#EE4040', fontSize: 14 }} />)}

                <FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}>
                  <div>
                    <FComponentsLib.FTextBtn
                      style={{
                        flexShrink: 1,
                      }}
                      type='primary'
                      onClick={(event) => {
                        event.stopPropagation();
                        window.open(FUtil.LinkTo.resourceDetails({
                          resourceID: i.id,
                        }));
                      }}
                    >
                      <FComponentsLib.FIcons.FFileSearch className={styles.FFileSearch} />
                    </FComponentsLib.FTextBtn>
                  </div>
                </FTooltip>
              </>}
            />

            <div style={{ height: 9 }} />
            <FComponentsLib.FContentText type='additional2'>
              <span>{i.resourceType}</span>
            </FComponentsLib.FContentText>
            <div style={{ height: 9 }} />
            <FResourceContractLabels
              contracts={i.contracts.map((j) => {
                return {
                  name: j.title,
                  auth: j.status === 'active' || j.status === 'testActive',
                };
              })}
            />
          </div>
        </div>))
    }
  </div>);
}


export default connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage: resourceAuthPage,
}))(Resources);
