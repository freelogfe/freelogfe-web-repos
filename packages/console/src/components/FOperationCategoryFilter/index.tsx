import * as React from 'react';
import styles from './index.less';

interface FOperationCategoryFilterProps {

}

function FOperationCategoryFilter({}: FOperationCategoryFilterProps) {
  return (<div className={styles.styles}>
    <div className={styles.level0}>
      <div className={[styles.level0Item].join(' ')}>
        <span>全部</span>
      </div>
      <div className={[styles.level0Item, styles.hasChildren].join(' ')}>
        <span>图片</span>
      </div>
      <div className={[styles.level0Item, styles.hasChildren, styles.active].join(' ')}>
        <span>音频</span>
      </div>
    </div>
    <div className={styles.level1}>
      <div className={[styles.level1Item, styles.active].join(' ')}>摄影</div>
      <div className={[styles.level1Item].join(' ')}>插画</div>
      <div className={[styles.level1Item].join(' ')}>博文</div>
    </div>
    <div className={styles.level2}>
      <div className={[styles.level2Item, styles.active].join(' ')}>筛选条件1</div>
      <div className={[styles.level2Item].join(' ')}>筛选条件2</div>
      <div className={[styles.level2Item].join(' ')}>筛选条件3</div>
    </div>
  </div>);
}

export default FOperationCategoryFilter;
