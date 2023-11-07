import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FComponentsLib from '../../../../../../@freelog/components-lib';

interface ResourceListProps {

}

function ResourceList({}: ResourceListProps) {
  return (<>
    <div className={styles.container3}>
      <div style={{ width: 920 }}>
        <div style={{ height: 35 }} />
        <div className={styles.nav}>
          <div className={styles.left}>批量发行资源</div>
          <div style={{ width: 10 }} />
          <div className={styles.other}>{'>'}</div>
          <div style={{ width: 7 }} />
          <div className={styles.other}>完善资源信息</div>
        </div>
        <div style={{ height: 35 }} />
        <div className={styles.header}>
          <Space size={10}>
            <FComponentsLib.FContentText text={'资源类型'} type={'additional2'} />
            <FComponentsLib.FContentText text={'图片/照片'} type={'highlight'} style={{ fontSize: 12 }} />
          </Space>

          <FComponentsLib.FContentText text={'共 3 个资源'} type={'additional2'} />

        </div>
        <div style={{ height: 40 }} />

      </div>
    </div>
  </>);
}

export default ResourceList;
