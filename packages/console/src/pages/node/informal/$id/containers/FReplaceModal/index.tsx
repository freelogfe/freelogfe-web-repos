import * as React from 'react';
import styles from './index.less';
import Replacer from './Replacer';
import Replaced from './Replaced';
import FModal from '@/components/FModal';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import {
  OnClose_ReplaceModal_Action,
  OnReplaceModalCancelAction,
  OnReplaceModalConfirmAction,
} from '@/models/informalNodeManagerPage';
import { ConnectState, InformalNodeManagerPageModelState } from '@/models/connect';
// import FThickArrowRight from '@/components/FIcons/FThickArrowRight';
import FComponentsLib from '@freelog/components-lib';

interface FReplaceModalProps {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function FReplaceModal({ dispatch, informalNodeManagerPage }: FReplaceModalProps) {

  return (<FModal
    title={null}
    width={947}
    open={informalNodeManagerPage.replaceModal_Visible}
    closable={false}
    destroyOnClose
    onCancel={() => {
      dispatch<OnReplaceModalCancelAction>({
        type: 'informalNodeManagerPage/onReplaceModalCancel',
      });
    }}
    okButtonProps={{
      disabled: !informalNodeManagerPage.replaceModal_Replacer_ResourceList.some((rr) => rr.checked) || informalNodeManagerPage.replaceModal_Replaced_CheckedKeys.length === 0,
    }}
    onOk={async () => {
      dispatch<OnReplaceModalConfirmAction>({
        type: 'informalNodeManagerPage/onReplaceModalConfirm',
      });
    }}
    afterClose={() => {
      // console.log('#######33afterClose');
      dispatch<OnClose_ReplaceModal_Action>({
        type: 'informalNodeManagerPage/onClose_ReplaceModal',
      });
    }}
  >
    <div style={{ height: 30 }} />
    <div className={styles.replaceHandler}>
      <div className={styles.replacer}>
        <FComponentsLib.FTitleText type='h3' text={'选择替换资源'} />
        <div style={{ height: 5 }} />
        <div className={styles.content}>
          <Replacer />
        </div>
      </div>
      <div className={styles.arrow}>
        <FComponentsLib.FIcons.FThickArrowRight
          style={{ fontSize: 36, fontWeight: 600, color: '#D8D8D8' }}
        />
      </div>
      <div className={styles.replaced}>
        <FComponentsLib.FTitleText
          type='h3'
          text={'选择被替换资源'}
        />
        <div style={{ height: 5 }} />
        <div className={styles.content}>
          <Replaced />
        </div>
      </div>
    </div>
    {
      informalNodeManagerPage.replaceModal_Errors.length > 0 && (<>
        <div style={{ height: 10 }} />
        <div className={styles.errors}>
          {
            informalNodeManagerPage.replaceModal_Errors.map((rme) => {
              return (<div className={styles.error}>{rme}</div>);
            })
          }
        </div>
      </>)
    }

    <div style={{ height: 30 }} />

  </FModal>);
}

export default connect(({ informalNodeManagerPage }: ConnectState) => ({
  informalNodeManagerPage,
}))(FReplaceModal);
