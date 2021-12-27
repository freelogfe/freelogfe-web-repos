import * as React from 'react';
import styles from './index.less';
import { Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input';
// import { RefSelectProps } from 'antd/lib/select';
import { TextAreaRef } from 'antd/lib/input/TextArea';

interface FIntroductionEditorProps extends TextAreaProps {
  errorText?: string;
}

let textInput: any;

function FIntroductionEditor({
                               className,
                               value,
                               errorText,
                               ...props
                             }: FIntroductionEditorProps, ref: React.Ref<TextAreaRef> | undefined) {

  // React.useEffect(() => {
  //   textInput.focus();
  // }, []);

  return (<div className={styles.introduction}>
    <Input.TextArea
      {...props}
      ref={ref}
      value={value}
      // onChange={(e) => onChange && onChange(e)}
      className={styles.TextArea}
    />
    <span
      className={[styles.FInputWordCount, 1000 - String(value).length < 0 ? styles.beyond : ''].join(' ')}>{1000 - String(value).length}</span>
    <div className={styles.error}>{errorText}</div>
  </div>);
}

export default React.forwardRef(FIntroductionEditor);
