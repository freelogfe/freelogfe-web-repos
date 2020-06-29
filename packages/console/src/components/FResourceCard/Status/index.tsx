import * as React from 'react';
import styles from './index.less';
import warning from './warning.svg';

export default function ({className, normal}: any) {
  return (
    <div className={[styles.div, className].join(' ')}>
      <label className={normal ? styles.normal : styles.warning}>已上线</label>
      {normal || <img src={warning}/>}
    </div>
  );
}
