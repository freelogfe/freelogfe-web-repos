import * as React from 'react';
import styles from './index.less';

interface FDividerProps {

}

function FDivider({}: FDividerProps) {
  return (<span className={styles.styles}>|</span>);
}

export default FDivider;
