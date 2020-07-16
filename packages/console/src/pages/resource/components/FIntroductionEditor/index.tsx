import * as React from 'react';
import styles from './index.less';
import {Input} from 'antd';
import {TextAreaProps} from 'antd/lib/input';

// import {FTextButton} from '@/components/FButton';

interface FIntroductionEditorProps extends TextAreaProps {
  // status?: '' | 'edit' | 'save';
  // value: string;
  // onChange?: (value: string) => void;
}

export default function ({className, value = '', onChange}: FIntroductionEditorProps) {
  return (<div className={styles.introduction}>
    <Input.TextArea
      value={value}
      onChange={onChange}
      className={styles.TextArea}
    />
    <span className={styles.FInputWordCount}>{String(value).length}</span>
  </div>)
}
