import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import { ChangeAction } from '@/models/exhibitInfoPage';
import Resources from './Resources';
import Contract from './Contract';
import Policy from './Policy';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface ContractsProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Contracts({ dispatch, exhibitInfoPage }: ContractsProps) {

  if (exhibitInfoPage.contract_Associated.length === 0) {
    return null;
  }

  const selectedResource = exhibitInfoPage.contract_Associated.find((a) => a.id === exhibitInfoPage.contract_SelectedAssociatedID);

  return (<div className={styles.sign}>
    <div className={styles.signLeft}>
      <Resources />
    </div>
    {
      selectedResource && (selectedResource.error === '' || (selectedResource.error === 'offline' && selectedResource.contracts.length > 0) ? (
          <div className={styles.signRight}>
            <Space style={{ width: '100%' }} size={15} direction='vertical'>

              <Contract />

              {
                selectedResource.error === '' && (<Policy />)
              }

            </Space>
          </div>) : (<div className={styles.errorContent}>
          {
            selectedResource.error === 'unreleased' && (<>
              <FComponentsLib.FIcons.FForbid style={{ color: '#EE4040', fontSize: 20 }} />
              <FComponentsLib.FTipText
                text={'该资源未发行，无法授权。'}
                type='second'
              />
            </>)
          }

          {
            selectedResource.error === 'offline' && (<>
              <FComponentsLib.FIcons.FForbid style={{ color: '#EE4040', fontSize: 20 }} />
              <FComponentsLib.FTipText
                // text={'该资源未上线，无法授权。'}
                text={FI18n.i18nNext.t('alarm_resource_not_available')}
                type='second'
              />
            </>)
          }

          {
            selectedResource.error === 'freeze' && (<>
              <FComponentsLib.FIcons.FForbid style={{ color: '#EE4040', fontSize: 20 }} />
              <FComponentsLib.FTipText
                text={'该资源已封禁，无法授权。'}
                type='second'
              />
            </>)
          }

        </div>)
      )
    }

  </div>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Contracts);
