import * as React from 'react';
import styles from './index.less';

export default function ({className}: any) {
  return (
    <label className={styles.label + ' ' + className}>已上线</label>
  );
}
