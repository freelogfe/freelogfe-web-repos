import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { FI18n } from '@freelog/tools-lib';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState } from '@/models/connect';
import FResourceTypeInput_Batch from '@/components/FResourceTypeInput_Batch';
import { Dispatch } from 'redux';
import { ChangeAction } from '@/models/resourceCreatorBatchPage';

interface ResourceTypeProps {
  dispatch: Dispatch;
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

function ResourceType({ resourceCreatorBatchPage, dispatch }: ResourceTypeProps) {
  return (<div className={styles.container1}>
    <div style={{ height: 35 }} />
    <div className={styles.nav}>
      <div className={styles.left}>{FI18n.i18nNext.t('brr_title_bulkreleaseresource')}</div>
      <div style={{ width: 10 }} />
      <div className={styles.other}>{'>'}</div>
      <div style={{ width: 7 }} />
      <div className={styles.other}>{FI18n.i18nNext.t('brr_selectresourcetype_title')}</div>
    </div>
    <div style={{ height: 35 }} />
    <div className={styles.block}>
      <FComponentsLib.FContentText
        text={FI18n.i18nNext.t('brr_selectresourcetype_input_resourcetype')}
        type={'highlight'}
      />
      <div style={{ height: 5 }} />
      <FComponentsLib.FContentText
        text={FI18n.i18nNext.t('brr_selectresourcetype_input_resourcetype_msg')}
        type={'additional2'}
      />
      <div style={{ height: 20 }} />
      <FResourceTypeInput_Batch
        value={resourceCreatorBatchPage.selectedResourceType}
        onChange={(value) => {
          dispatch<ChangeAction>({
            type: 'resourceCreatorBatchPage/change',
            payload: {
              selectedResourceType: value,
            },
          });
        }}
      />
    </div>
    <div style={{ height: 30 }} />
    <div className={styles.footer}>
      <div>
        <FComponentsLib.FIcons.FInfo
          style={{ fontSize: 14 }}
        />&nbsp;{FI18n.i18nNext.t('brr_selectresourcetype_msg_typelimit')}
      </div>
      <FComponentsLib.FRectBtn
        disabled={!resourceCreatorBatchPage.selectedResourceType}
        onClick={() => {
          dispatch<ChangeAction>({
            type: 'resourceCreatorBatchPage/change',
            payload: {
              showPage: 'uploadFile',
            },
          });
        }}
      >{FI18n.i18nNext.t('brr_selectresourcetype_btn_next')}</FComponentsLib.FRectBtn>
    </div>
  </div>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(ResourceType);
