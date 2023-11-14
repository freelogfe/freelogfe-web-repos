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
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
  dispatch: Dispatch;
}

function ResourceType({ resourceCreatorBatchPage, dispatch }: ResourceTypeProps) {
  return (<div className={styles.container1}>
    <div style={{ height: 35 }} />
    <div className={styles.nav}>
      <div className={styles.left}>批量发行资源</div>
      <div style={{ width: 10 }} />
      <div className={styles.other}>{'>'}</div>
      <div style={{ width: 7 }} />
      <div className={styles.other}>选择资源类型</div>
    </div>
    <div style={{ height: 35 }} />
    <div className={styles.block}>
      <FComponentsLib.FContentText text={FI18n.i18nNext.t('rqr_input_resourcetype')} type={'highlight'} />
      <div style={{ height: 5 }} />
      <FComponentsLib.FContentText text={FI18n.i18nNext.t('rqr_input_resourcetype_help')} type={'additional2'} />
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
      <div><FComponentsLib.FIcons.FInfo style={{ fontSize: 14 }} />&nbsp;批量发行适用于一次性发行多个同类型资源，目前仅针对部分资源类型开放。</div>
      <FComponentsLib.FRectBtn
        onClick={() => {
          dispatch<ChangeAction>({
            type: 'resourceCreatorBatchPage/change',
            payload: {
              showPage: 'uploadFile',
            },
          });
        }}
      >确定</FComponentsLib.FRectBtn>
    </div>
  </div>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(ResourceType);
