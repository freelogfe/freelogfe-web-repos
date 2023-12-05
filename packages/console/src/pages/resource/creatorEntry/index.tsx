import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { Space } from 'antd';
import { history } from 'umi';
import { FI18n, FUtil } from '@freelog/tools-lib';

interface CreatorEntryProps {

}

function creatorEntry({}: CreatorEntryProps) {
  return (<div className={styles.creatorEntry}>
    <div className={styles.card}>
      <FComponentsLib.FIcons.FResourceFile className={styles.icon} />
      <FComponentsLib.FContentText
        type={'additional2'}
        text={FI18n.i18nNext.t('addnewresource_option_single_msg')}
      />
      <FComponentsLib.FRectBtn
        onClick={() => {
          history.push(FUtil.LinkTo.resourceCreator());
        }}
      >{FI18n.i18nNext.t('addnewresource_option_single_btn')}</FComponentsLib.FRectBtn>
    </div>
    <div className={styles.card}>
      <Space size={15}>
        <FComponentsLib.FIcons.FResourceFile className={styles.icon} />
        <FComponentsLib.FIcons.FResourceFile className={styles.icon} />
        <FComponentsLib.FIcons.FResourceFile className={styles.icon} />
      </Space>
      <FComponentsLib.FContentText
        type={'additional2'}
        text={FI18n.i18nNext.t('addnewresource_option_bulk_msg')}
      />
      <FComponentsLib.FRectBtn
        onClick={() => {
          history.push(FUtil.LinkTo.resourceCreatorBatch());
        }}
      >{FI18n.i18nNext.t('addnewresource_option_bulk_one')}</FComponentsLib.FRectBtn>

    </div>
  </div>);
}

export default creatorEntry;
