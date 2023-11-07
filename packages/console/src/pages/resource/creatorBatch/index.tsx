import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FResourceTypeInput from '@/components/FResourceTypeInput';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState } from '@/models/connect';
import fObjectSelectorDrawer from '@/components/fObjectSelectorDrawer';
import fMessage from '@/components/fMessage';

interface CreatorBatchProps {
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

function CreatorBatch({ resourceCreatorBatchPage }: CreatorBatchProps) {

  if (resourceCreatorBatchPage.showPage === 'resourceType') {
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
        <FResourceTypeInput
          // value={resourceCreatorPage.step1_resourceType}
          value={null}
          onChange={(value) => {
            // dispatch<OnChange_step1_resourceType_Action>({
            //   type: 'resourceCreatorPage/onChange_step1_resourceType',
            //   payload: {
            //     value: value,
            //   },
            // });
          }}
        />
      </div>
      <div style={{ height: 30 }} />
      <div className={styles.footer}>
        <div><FComponentsLib.FIcons.FInfo style={{ fontSize: 14 }} />&nbsp;批量发行适用于一次性发行多个同类型资源，目前仅针对部分资源类型开放。</div>
        <FComponentsLib.FRectBtn>确定</FComponentsLib.FRectBtn>
      </div>
    </div>);
  }


  if (resourceCreatorBatchPage.showPage === 'uploadFile') {
    return (<div className={styles.container2}>
      <div style={{ height: 35 }} />
      <div className={styles.nav}>
        <div className={styles.left}>批量发行资源</div>
        <div style={{ width: 10 }} />
        <div className={styles.other}>{'>'}</div>
        <div style={{ width: 7 }} />
        <div className={styles.other}>上传资源文件</div>
      </div>
      <div style={{ height: 35 }} />
      <div className={styles.cards}>
        <div className={styles.localUpload}>
          <FComponentsLib.FIcons.FLocalUpload style={{ fontSize: 60 }} />
          <div style={{ height: 40 }} />
          <FComponentsLib.FContentText text={'选择本地文件作为发行对象'} type={'additional2'} />
          <div style={{ height: 40 }} />
          <FComponentsLib.FRectBtn
            type={'primary'}
          >本地上传</FComponentsLib.FRectBtn>
        </div>

        <div className={styles.storageSpace}>
          <FComponentsLib.FIcons.FStorageSpace style={{ fontSize: 60 }} />
          <div style={{ height: 40 }} />
          <FComponentsLib.FContentText
            text={'选择存储空间对象作为发行对象'}
            type={'additional2'}
          />
          <div style={{ height: 40 }} />
          <FComponentsLib.FRectBtn
            type={'primary'}
          >存储空间导入</FComponentsLib.FRectBtn>
        </div>
      </div>
    </div>);
  }

  return (<div className={styles.container3}>

  </div>);

}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(CreatorBatch);
