import * as React from 'react';
import styles from './index.less';
import { Input } from 'antd';
import { ChangeEventHandler, KeyboardEventHandler } from 'react';
import { TextAreaRef } from 'antd/lib/input/TextArea';

export interface FMultiLineInputProps {
  value: string;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  style?: React.CSSProperties;
  // FI18n.i18nNext.t('form_input_multiplelinetxt_error_length')
  lengthLimit?: number;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onPressEnter?: KeyboardEventHandler<HTMLTextAreaElement>;
}

function FMultiLineInput({
                            value,
                            placeholder = '',
                            className = '',
                            // hasError = false,
                            style = {},
                            lengthLimit = 600,
                            onChange,
                            onPressEnter,
                          }: FMultiLineInputProps, ref: React.Ref<TextAreaRef> | undefined) {
  return (<div className={styles.introduction}>
    <Input.TextArea
      ref={ref}
      value={value}
      placeholder={placeholder}
      className={[styles.TextArea, className].join(' ')}
      style={style}
      onChange={onChange}
      onPressEnter={onPressEnter}
      autoSize={{ minRows: 4, maxRows: 20 }}
    />
    <span
      className={[styles.FInputWordCount, value.length > lengthLimit ? styles.beyond : ''].join(' ')}>{lengthLimit - value.length}</span>
  </div>);
}

export default React.forwardRef(FMultiLineInput);
