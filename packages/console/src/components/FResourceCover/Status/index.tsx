import * as React from 'react';
import styles from './index.less';
// import {FWarning} from '../../FIcons';
import FComponentsLib from '@freelog/components-lib';

interface SiderProps {
  // normal: 'online' | 'stopped';
  normal: boolean;
  className?: string;
}

export default function ({className = '', normal}: SiderProps) {
  return (
    <div className={[styles.div, className].join(' ')}>
      <label className={normal ? styles.normal : styles.warning}>{normal ? '已上线' : '未上线'}</label>
      {/*{normal || <img src={warning} alt=""/>}*/}
      <div style={{width: 10}}/>
      {normal || <FComponentsLib.FIcons.FWarning/>}
    </div>
  );
}
