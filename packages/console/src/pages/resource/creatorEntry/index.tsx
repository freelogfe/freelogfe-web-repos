import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { Space } from 'antd';
import { history } from 'umi';
import { FUtil } from '@freelog/tools-lib';

interface CreatorEntryProps {

}

function creatorEntry({}: CreatorEntryProps) {
  return (<div className={styles.creatorEntry}>
    <div className={styles.card}>
      <FComponentsLib.FIcons.FPolicy className={styles.icon} />
      <FComponentsLib.FContentText type={'additional2'} text={'一次发行一个资源，更详细'} />
      <FComponentsLib.FRectBtn
        onClick={() => {
          history.push(FUtil.LinkTo.resourceCreator());
        }}
      >发行一个资源</FComponentsLib.FRectBtn>
    </div>
    <div className={styles.card}>
      <Space size={15}>
        <FComponentsLib.FIcons.FPolicy className={styles.icon} />
        <FComponentsLib.FIcons.FPolicy className={styles.icon} />
        <FComponentsLib.FIcons.FPolicy className={styles.icon} />
      </Space>
      <FComponentsLib.FContentText type={'additional2'} text={'一次发行多个资源，更便捷'} />
      <FComponentsLib.FRectBtn
        onClick={() => {
          history.push(FUtil.LinkTo.resourceCreatorBatch());
        }}
      >批量发行资源</FComponentsLib.FRectBtn>

    </div>
  </div>);
}

export default creatorEntry;
