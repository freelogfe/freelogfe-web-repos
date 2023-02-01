import * as React from 'react';
import styles from './index.less';
import {
  InformExhibitInfoPageModelState,
} from '@/models/informExhibitInfoPage';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import FResultTip from '@/components/FResultTip';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface ViewportsProps {
  dispatch: Dispatch;

  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Viewports({}: ViewportsProps) {

  return (<div>
    <div className={styles.title}>
      <FComponentsLib.FTitleText text={FI18n.i18nNext.t('title_exhibit_maps')} type='h3' />
    </div>
    <div style={{ height: 20 }} />

    <div style={{
      height: 220,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <FResultTip h1={'即将推出，敬请期待...'} />
    </div>

  </div>);
}

export default connect(({ informExhibitInfoPage }: ConnectState) => ({
  informExhibitInfoPage,
}))(Viewports);
