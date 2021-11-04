import * as React from 'react';
import styles from './index.less';
import { FTitleText } from '@/components/FText';
import { Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import { ChangeAction } from '@/models/exhibitInfoPage';
import Resources from './Resources';
import Contract from './Contract';
import Policy from './Policy';
import FUtil1 from '@/utils';

interface ContractsProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Contracts({ dispatch, exhibitInfoPage }: ContractsProps) {

  if (exhibitInfoPage.contract_Associated.length === 0) {
    return null;
  }

  async function onChange(payload: Partial<ExhibitInfoPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: payload,
    });
  }

  return (<div>
    <FTitleText text={FUtil1.I18n.message('title_relevant_contracts')} type='h3' />

    <div style={{ height: 20 }} />

    <div className={styles.sign}>
      <div className={styles.signLeft}>
        <Resources />
      </div>

      <div className={styles.signRight}>
        <Space style={{ width: '100%' }} size={15} direction='vertical'>

          <Contract />

          <Policy />

        </Space>
      </div>
    </div>
  </div>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Contracts);
