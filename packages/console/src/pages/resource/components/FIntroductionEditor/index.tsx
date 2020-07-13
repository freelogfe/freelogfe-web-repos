import * as React from 'react';
import styles from './index.less';
import {Input} from 'antd';
// import {FTextButton} from '@/components/FButton';

interface FIntroductionEditorProps {
  // status?: '' | 'edit' | 'save';
}

export default function ({}: FIntroductionEditorProps) {
  return (<div className={styles.introduction}>
    <Input.TextArea className={styles.TextArea}/>
    <span className={styles.FInputWordCount}>200</span>
  </div>)
}
