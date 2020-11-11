import * as React from 'react';
import styles from './index.less';
import {Input} from 'antd';
import {TextAreaProps} from 'antd/lib/input';

// import {FTextButton} from '@/components/FButton';

interface FIntroductionEditorProps extends TextAreaProps {
  errorText?: string;
}

let textInput: any;

export default function ({className, value, errorText, ...props}: FIntroductionEditorProps) {

  React.useEffect(() => {
    textInput.focus();
  }, []);

  return (<div className={styles.introduction}>
    <Input.TextArea
      {...props}
      ref={(input) => textInput = input}
      value={value}
      // onChange={(e) => onChange && onChange(e)}
      className={styles.TextArea}
    />
    <span
      className={[styles.FInputWordCount, 1000 - String(value).length < 0 ? styles.beyond : ''].join(' ')}>{1000 - String(value).length}</span>
    <div className={styles.error}>{errorText}</div>
  </div>)
}
